require 'test_helper'

class Api::V0::MixesControllerTest < ActionController::TestCase

	context "on GET mixes" do
		setup do
			@mixes = Array.new(10) { Fabricate(:mix) }
			get :index
		end

		should respond_with :success
		should "list all mixes" do
			response = MultiJson.decode @response.body
			assert_kind_of Array, response
			assert_kind_of Hash, response.first
		end
	end

end