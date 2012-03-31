class Admin::MixesController < Admin::BaseController
	before_filter :find_mix, only: [:show, :edit, :destroy, :publish, :unpublish, :update]

	def index
		@mixes = Mix.unscoped.paginate(page: params[:page])
	end

	def published
		@mixes = Mix.paginate(page: params[:page])
		render :index
	end

	def unpublished
		@mixes = Mix.unscoped.unpublished.paginate(page: params[:page])
		render :index
	end

	def show; end
	def edit; end

	def update
		Rails.logger.info params
		@mix.write_attributes(params[:mix], as: :admin)
		if @mix.save
			redirect_to admin_mix_path(@mix), notice: "Mix has been updated."
		else
			render :edit
		end
	end

	def publish
		@mix.publish!
		redirect_to admin_mix_path(@mix), notice: "Mix has been published."
	end

	def unpublish
		@mix.unpublish!
		redirect_to admin_mix_path(@mix), notice: "Mix has been unpublished."
	end

	protected
	def find_mix
		@mix = Mix.unscoped.find(params[:mix_id] || params[:id]) || not_found
	rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
		not_found
	end
end