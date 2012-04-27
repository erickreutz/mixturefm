class Admin::MixesController < Admin::BaseController
	before_filter :find_mix, only: [:show, :edit, :destroy, :publish, :unpublish, :update]

	def index
		@mixes = Mix.unscoped.paginate(page: params[:page])
	end

	def new
		@mix = Mix.new
	end

	def show; end
	def edit; end

	def create
		@mix = Mix.new params[:mix], as: :admin
		Rails.logger.info "MIX PARAMS #{ params[:mix] }"

		if @mix.save
			redirect_to admin_mix_path(@mix), notice: 'Mix created.'
		else
			render 'new'
		end
	end

	def update
		@mix.assign_attributes(params[:mix], as: :admin)
		if @mix.save
			redirect_to admin_mix_path(@mix), notice: "Mix has been updated."
		else
			render :edit
		end
	end

	protected
	def find_mix
		@mix = Mix.unscoped.find(params[:mix_id] || params[:id]) || not_found
	rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
		not_found
	end
end