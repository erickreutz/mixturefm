CarrierWave::Storage::Fog::File.class_eval do

	def authenticated_public_url
		authed_url    = self.authenticated_url
		authed_url    = authed_url.split('?')
		authed_url[0] = self.public_url
		authed_url.join('?')
	end

end