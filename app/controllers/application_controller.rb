class ApplicationController < ActionController::Base
  protect_from_forgery

  unless Rails.application.config.consider_all_requests_local
    rescue_from Exception, with: :render_execption
    rescue_from ActionController::RoutingError, with: :render_not_found
    rescue_from ActionController::UnknownController, with: :render_not_found
    rescue_from ActionController::UnknownAction, with: :render_not_found
    rescue_from Mongoid::Errors::DocumentNotFound, with: :render_not_found
  end

  def render_not_found
    render template: '/errors/404', status: :not_found, layout: 'error'
  end

  def render_execption
    render template: '/errors/500', status: :not_found, layout: 'error'
  end

  protected

  def not_found
    raise ActionController::RoutingError, 'Not Found'
  end
end
