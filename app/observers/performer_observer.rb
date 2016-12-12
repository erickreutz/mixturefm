class PerformerObserver < Mongoid::Observer
  def after_update(performer)
    performer.mixes.each(&:update_index)
  end
end
