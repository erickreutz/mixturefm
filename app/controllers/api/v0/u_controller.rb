class Api::V0::MeController < Api::BaseController
  before_filter :authenticate_with_api_key
  before_filter :verify_authenticated_user

  def show
    render json: @current_user
  end
end
