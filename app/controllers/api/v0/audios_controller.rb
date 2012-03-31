class Api::V0::AudiosController < Api::BaseController
	before_filter :authenticate_with_api_key
	before_filter :verify_authenticated_user, only: [:create]
	before_filter :find_audio, only: [:show, :stream]

	def show
		render json: @audio
	end

	def stream
		if @audio.sound.present?
			render json: { stream: @audio.public_stream_url }
		else
			head :not_found
		end
	end	

	def create
		@audio = Audio.new
		@audio.sound = params[:file]

		if @audio.save
			render json: @audio
		else
			render json: @audio.errors.full_messages, status: :not_acceptable
		end
	end

	private
	def find_audio
		@audio = Audio.find(params[:id] || params[:audio_id])
	rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
		head :not_found
	end
end