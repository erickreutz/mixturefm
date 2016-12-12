class SoundcloudMixDataJob < Struct.new(:mix_id)
  @queue = :soundcloud

  def before(_job)
    @mix = Mix.unscoped.find(mix_id)
    @mix.update_attribute(:processing, true)
  end

  def perform
    sc_track = $soundcloud.get('/resolve', url: @mix.sc_url)
    @mix.sc_id = sc_track.id
    @mix.sc_stream_url = sc_track.stream_url
    @mix.duration = (sc_track.duration / 1000) # SC duration is in milliseoncds.
  end

  def success(_job)
    @mix.assign_attributes({
                             processed_at: DateTime.now,
                             processing: false
                           }, as: :admin)
  end

  def after(_job)
    @mix.update_attribute(:processing, false)
  end

  def error(_job, _exception)
    @mix.update_attribute(:processed_at, nil)
  end

  def failure
    @mix.update_attribute(:processed_at, nil)
  end
end
