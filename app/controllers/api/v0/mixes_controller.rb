class Api::V0::MixesController < Api::BaseController
  before_filter :authenticate_with_api_key
  before_filter :verify_authenticated_user, only: [:create]

  before_filter lambda {
    find_performer if request.params.include?('performer_id')
  }, only: [:index]

  before_filter lambda {
    find_mix_collection if request.params.include?('collection_id')
  }, only: [:index]

  before_filter :find_mix, only: [:show, :played, :stream]

  def index
    @models = @performer.present? ? @performer.mixes : @mix_collection.mixes
    @models = @models.in_year(params[:year]) unless params[:year].blank?

    @models = @models.order_by([:debuted_at, :desc])
                     .page(params[:page])
                     .per(params[:per_page])

    resp = {
      page: @models.current_page,
      per_page: @models.limit_value,
      total: @models.total_count,
      models: @models
    }

    render json: resp.as_json(user: @current_user)
  end

  def recent
    @models = Mix.recent.page(params[:page]).per(params[:per_page])
    resp = {
      page: @models.current_page,
      per_page: @models.limit_value,
      total: @models.total_count,
      models: @models
    }

    render json: resp.as_json(user: @current_user)
  end

  def popular
    @models = Mix.popular.page(params[:page]).per(params[:per_page])
    resp = {
      page: @models.current_page,
      per_page: @models.limit_value,
      total: @models.total_count,
      models: @models
    }

    render json: resp.as_json(user: @current_user)
  end

  def search
    @results = Mix.elastic_search(params)

    resp = {
      page: @results.current_page,
      per_page: @results.limit_value,
      total: @results.total_count,
      models: @results
    }

    render json: resp.as_json(user: @current_user)
  end

  def show
    render json: @mix.as_json(user: @current_user)
  end

  def played
    @mix.played!
    head :ok
  end

  def stream
    redirect_to @mix.streamable_url
  end
end
