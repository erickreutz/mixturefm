class MixObserver < Mongoid::Observer
  def after_destroy(mix)
    mix.tire.index.remove('mix', mix.id)
  end
end
