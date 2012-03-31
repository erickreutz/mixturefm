class Api::V0::MixCollectionsController < Api::BaseController
	before_filter :find_mix_collection, only: [:show, :years]

	def all
		render json: MixCollection.order_by(:name, :asc)
	end

	def index
		resp = {
			page: params[:page],
			per_page: params[:per_page],
			total: MixCollection.count,
			models: MixCollection.order_by([:mixes_published_count, :desc]).page(params[:page]).per(params[:per_page])
		}
		render json: resp
	end

	def show
		render json: @mix_collection
	end

	def years
		render json: @mix_collection.years
	end
end