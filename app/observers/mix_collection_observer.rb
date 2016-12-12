class MixCollectionObserver < Mongoid::Observer
  def after_update(mix_collection)
    mix_collection.mixes.each(&:update_index)
  end
end
