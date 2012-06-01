require File.expand_path('../boot', __FILE__)

require "action_controller/railtie"
require "action_mailer/railtie"
require "active_resource/railtie"
require "rails/test_unit/railtie"
require "sprockets/railtie"
require "tire/rails/logger"

if defined?(Bundler)
  Bundler.require(*Rails.groups(:assets => %w(development test)))
end

$mixture_config = YAML.load_file("config/mixture.yml")[Rails.env].symbolize_keys
HOST            = $mixture_config[:host]

module Mixture
  class Application < Rails::Application
    config.autoload_paths += ["./app/jobs", "./app/uploaders", "./app/observers", "./lib/middleware"]

    config.middleware.use Rack::Cors do
      allow do
        origins 'http://mixture.dev', '0.0.0.0:5400', '0.0.0.0:5100', 'mixture.fm'
        resource '*', headers: :any, methods: [:get, :post, :put, :delete, :options]
      end
    end

    config.middleware.use "WwwMiddleware"

    config.mongoid.observers = :mix_observer, :performer_observer, :mix_collection_observer

    config.generators do |g|
      g.test_framework      :test_unit, fixture_replacement: :fabrication
      g.fixture_replacement :fabrication, dir: "test/fabricators"
    end

    config.encoding = "utf-8"
    config.filter_parameters += [:password]
    config.assets.enabled = true
    config.assets.version = '1.0.5'
  end
end
