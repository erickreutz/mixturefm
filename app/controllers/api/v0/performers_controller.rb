class Api::V0::PerformersController < Api::BaseController
	def search
		resp = Performer.simple_search(/#{params[:q]}/i)
		render json: resp
	end
end