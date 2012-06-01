class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :cor

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

  def cor
    headers["Access-Control-Allow-Origin"]  = "*"
    headers["Access-Control-Allow-Methods"] = %w{GET POST PUT DELETE}.join(",")
    headers["Access-Control-Allow-Headers"] = %w{Origin Accept Content-Type X-Requested-With X-CSRF-Token}.join(",")
  end

  protected
  def not_found
  	raise ActionController::RoutingError.new('Not Found')
	end
end
