class MixObserver < Mongoid::Observer
	def after_destroy(mix)
		# keep the search index in check.
		mix.tire.index.remove('mix', mix.id)
	end
end
