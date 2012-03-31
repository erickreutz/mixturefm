class ShortenURLJob < Struct.new(:klass, :id, :column, :url)
	@queue = :shorten_url

  def self.perform(*args)
		new(*args).perform
  end

	def perform
		resource  = klass.is_a?(String) ? klass.constantize : klass
		record 	  = resource.unscoped.find(id)
		record.send :"#{column}=", $bitly.shorten(url, history: 0).short_url
		record.save!
	end
end