class Api::V0::PerformersController < Api::BaseController
  before_filter :find_performer, only: [:show]

  def index
    # Paginated all the artists we have
    @models = Performer.page(params[:page]).per(params[:per_page])

    resp = {
      page: @models.current_page,
      per_page: @models.limit_value,
      total: @models.total_count,
      models: @models
    }

    render json: resp
  end

  def show
    # Return the info for a single artist
    render json: @performer
  end

	def search
		resp = Performer.simple_search(/#{params[:q]}/i)
		render json: resp
	end
end