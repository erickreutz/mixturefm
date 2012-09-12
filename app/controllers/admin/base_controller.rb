class Admin::BaseController < ApplicationController
	layout 'admin'
  before_filter :authenticate_admin

  protected
  def authenticate_admin
    authenticate_or_request_with_http_basic do |username, password|
      username == ENV['ADMIN_LOGIN'] && password == ENV['ADMIN_PASSWORD']
    end
  end
end
