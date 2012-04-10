require 'uri'

if ENV['BONSAI_INDEX_URL'].present?
  uri = URI( ENV['BONSAI_INDEX_URL'] )
  Tire.configure {
    url "#{uri.scheme}://#{uri.host}"
    global_index_name uri.path[/[^\/]+$/]
  }
end