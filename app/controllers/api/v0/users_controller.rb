class Api::V0::UsersController < Api::BaseController
	def create
		auth = request.env["omniauth.auth"]
		user = User.first(conditions: { provider: auth["provider"], uid: auth["uid"] }) || User.create_with_omniauth(auth)
		render json: user
	end
end