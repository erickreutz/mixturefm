require 'uri'

if ENV['BONSAI_INDEX_URL'].present?
  uri = URI( ENV['BONSAI_INDEX_URL'] )
  Tire.configure {
    url "#{uri.scheme}://#{uri.host}"
  }

  $bonsai_index_name = uri.path[/[^\/]+$/]
else
  app_name = Rails.application.class.parent_name.underscore.dasherize
  app_env = Rails.env
  $bonsai_index_name = "#{app_name}-#{app_env}"
end