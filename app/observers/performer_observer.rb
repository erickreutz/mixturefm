class PerformerObserver < Mongoid::Observer
	def after_update(performer)
		performer.mixes.each do |mix|
			mix.update_index if mix.published?
		end
	end
end
