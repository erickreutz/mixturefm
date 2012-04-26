class MixObserver < Mongoid::Observer
	def after_destroy(mix)
		# keep the search index in check.
		mix.tire.index.remove('mix', mix.id)
	end

	def after_create(mix) {
		# Delayed job that goes out and fetches the soundcloud data
	}
end
