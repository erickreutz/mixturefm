class Api::V0::UsersController < Api::BaseController
	def create
    @graph = Koala::Facebook::API.new(params[:access_token])
    profile = @graph.get_object("me")

    auth = {
      'provider' => 'facebook',
      'uid' => profile['id'],
      'info' => {
        'email'      => profile['email'],
        'first_name' => profile['first_name'],
        'last_name'  => profile['last_name']
      }
    }

		user = User.first(conditions: { provider: auth['provider'], uid: auth["uid"] }) || User.create_with_omniauth(auth)
		render json: user
	end
end