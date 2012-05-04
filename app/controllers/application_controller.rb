class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :authenticate

  unless Rails.application.config.consider_all_requests_local
    rescue_from Exception, with: :render_execption
    rescue_from ActionController::RoutingError, with: :render_not_found
    rescue_from ActionController::UnknownController, with: :render_not_found
    rescue_from ActionController::UnknownAction, with: :render_not_found
    rescue_from Mongoid::Errors::DocumentNotFound, with: :render_not_found
  end

  def render_not_found
    render template: "/errors/404", status: :not_found, layout: 'error'
  end

  def render_execption
    render template: "/errors/500", status: :not_found, layout: 'error'
  end

  protected
  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == ENV['ADMIN_LOGIN'] && password == ENV['ADMIN_PASSWORD']
    end
  end

  def not_found
  	raise ActionController::RoutingError.new('Not Found')
	end
end
