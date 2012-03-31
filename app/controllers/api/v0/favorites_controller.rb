class Api::V0::FavoritesController < Api::BaseController
	before_filter :authenticate_with_api_key
	before_filter :verify_authenticated_user
	before_filter :find_mix, only: [:create, :destroy] 

	def index
		@models = @current_user.favorites.page(params[:page]).per(params[:per_page])
		resp = {
			page: @models.current_page,
			per_page: @models.limit_value,
			total: @models.total_count,
			models: @models
		}

		render json: resp.as_json(user: @current_user)
	end

	def create
		@current_user.favorite! @mix
		head :ok
	end

	def destroy
		@current_user.unfavorite! @mix
		head :ok
	end

end