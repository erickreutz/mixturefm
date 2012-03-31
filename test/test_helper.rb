ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'capybara/rails'

class ActiveSupport::TestCase
  # self.use_transactional_fixtures = true
  # self.use_instantiated_fixtures  = false
  ActionDispatch::TestRequest::DEFAULT_ENV['HTTPS'] = 'on'
end

class ActionController::TestCase
  # include Devise::TestHelpers
end

class Test::Unit::TestCase
  # include Rack::Test::Methods
  # include RR::Adapters::TestUnit unless include?(RR::Adapters::TestUnit)
  include WebMock::API
end
