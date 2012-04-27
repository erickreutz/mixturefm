class MixCollectionObserver < Mongoid::Observer
	def after_update(mix_collection)
		mix_collection.mixes.each do |mix|
			mix.update_index
		end
	end
end