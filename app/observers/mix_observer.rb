class MixObserver < Mongoid::Observer
	def after_create(mix)
		MixMailer.delay(queue: 'mail').mix_contribution(mix.id)
		UserMailer.delay(queue: 'mail').mix_contribution(mix.contributor.id, mix.id)
	end

	def published(mix)
		# means this mix has been published before and the user has
		# already been notifed. 
		if !mix.contributor_notified? 
			Delayed::Job.enqueue MixPublicationEmailJob.new(mix.contributor.id, mix.id), queue: 'mail'
		end
	end

	def unpublished(mix)
		# keep the search index in check.
		mix.tire.index.remove('mix', mix.id)
	end

	def after_destroy(mix)
		# keep the search index in check.
		mix.tire.index.remove('mix', mix.id)
	end
end
