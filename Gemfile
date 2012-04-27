source 'https://rubygems.org'

gem 'rails', '3.2.0'

# Bundle edge Rails instead:rout
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'bson_ext', '~> 1.5'
gem 'mongoid', '~> 2.4'
gem 'mongoid_session_store'
gem 'ejs'
gem 'backbone-support', git: 'git@github.com:erickreutz/backbone-support.git'
gem 'kaminari'
gem 'tire', git: 'git://github.com/jfredett/tire.git'
gem 'omniauth-facebook'
gem 'bitly'
gem 'postmark-rails','~> 0.4.1'
gem 'delayed_job'
gem 'delayed_job_mongoid'
gem 'mongoid_slug'
gem 'carrierwave-mongoid', require: 'carrierwave/mongoid'
gem 'carrierwave_backgrounder', git: 'git://github.com/lardawge/carrierwave_backgrounder.git'
gem 'fog'
gem 'unicorn'
gem 'meta-tags', require: 'meta_tags'
gem 'soundcloud', git: 'git://github.com/andrejj/soundcloud-ruby.git'

# For admin section
gem 'twitter-bootstrap-rails', '~> 2.0.1'
gem 'simple_form', '~> 2.0.0'
gem 'jquery-rails', '>= 1.0.12'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'coffee-rails', '~> 3.2.1'
	gem 'uglifier', '>= 1.0.3'
	gem 'less-rails'
end

group :test, :development do
	gem 'fabrication'
end

group :development do
	gem 'forgery', '~> 0.3.12'
	gem 'rb-fsevent'
	gem 'growl_notify'
  gem 'guard'
	gem 'guard-livereload'
	gem 'rockstar' # for seeding the artists with last.fm
end

group :test do
	gem 'capybara'
	gem 'cucumber-rails'
	gem 'database_cleaner'
	gem 'launchy'
	gem 'rack-test', require: 'rack/test'
	gem 'rr'
	gem 'shoulda-context'
	gem 'shoulda-matchers'
	gem 'webmock'
	gem 'multi_json'
end