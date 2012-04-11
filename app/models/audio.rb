class Audio
  include Mongoid::Document
  include Mongoid::Timestamps

  has_one :mix

  field :duration, type: Integer
  field :bitrate,  type: Integer
  field :sample_rate, type: Integer
  field :tag_meta, type: String, default: "{}"
  field :sound, type: String
  field :sound_tmp, type: String
  field :sound_processing, type: Boolean, default: false

  mount_uploader :sound, SoundUploader
  # store_in_background :sound

  # before_validation :read_mp3_meta
  validates_presence_of :sound
  # validate :mp3_meta

  attr_accessible :sound, as: [ :default, :admin ]
  attr_accessible :duration, :sample_rate, :bitrate, as: [ :admin ]

  def tag_meta
    ActiveSupport::JSON.decode(self[:tag_meta])
  end

  def tag_meta=(tm={})
    self[:tag_meta] = ActiveSupport::JSON.encode(tm)
  end

  def payload
    {
      id: id,
      duration: duration,
      bitrate: bitrate,
      sample_rate: sample_rate,
      tag_meta: tag_meta
    }
  end

  def as_json(options={})
    payload
  end

  def public_stream_url
    sound.present? ? sound.file.authenticated_public_url : ""
  end

  protected
  # def read_mp3_meta
  #   return if !sound.present? && !sound_changed?

  #   mp3meta = TagLib::MPEG::File.new(sound.path)
  #   if !mp3meta.audio_properties.nil?

  #     props = mp3meta.audio_properties

  #     self.duration    = props.length
  #     self.bitrate     = props.bitrate
  #     self.sample_rate = props.sample_rate
  #   end

  #   tag = mp3meta.tag

  #   self.tag_meta = {
  #     album: tag.album,
  #     artist: tag.artist,
  #     comment: tag.comment,
  #     genre: tag.genre,
  #     title: tag.title,
  #     track: tag.track,
  #     year: tag.year,
  #   }

  #   mp3meta.close
  #   mp3meta = nil
  # end

  # def mp3_meta
  #   props = [self.duration, self.bitrate, self.sample_rate].keep_if { |p| p.present? && !p.zero? }
  #   errors[:base] << "Error reading audio file" if props.count < 3
  # end

end