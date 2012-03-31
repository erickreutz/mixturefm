class Admin::PerformersController < Admin::BaseController
	before_filter :find_performer, only: [:edit, :update, :show]

	def index
		@performers = Performer.paginate(page: params[:page])
	end

	def show; end

	def edit; end

	def update
		@performer.write_attributes params[:performer], as: :admin
		if @performer.save
			redirect_to admin_performer_path(@performer), notice: 'Performer updated.'
		else
			render 'edit'
		end
	end

	def new
		@performer = Performer.new
	end

	def create
		@performer = Performer.new params[:performer], as: :admin
		if @performer.save
			redirect_to admin_performer_path(@performer), notice: 'Performer created.'
		else
			render 'new'
		end
	end

	private
	def find_performer
		@performer = Performer.find_by_slug(params[:id]) || not_found
	rescue Mongoid::Errors::DocumentNotFound, BSON::InvalidObjectId
		not_found
	end
end