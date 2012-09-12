class Mix
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::MultiParameterAttributes

  attr_accessor :performer_tokens
  attr_reader :performer_tokens

  paginates_per 12

  belongs_to :mix_collection
  has_and_belongs_to_many :performers
  has_many :favorites, order: [[ :created_at, :desc ]]

  field :caption, type: String
  field :debuted_at, type: DateTime
  field :play_count, type: Integer, default: 0
  field :popluarity_count, type: Integer, default: 0 # play_count + favorite_count
  field :short_url, type: String
  field :duration, type: Integer
  field :sc_url, type: String
  field :sc_id, type: Integer
  field :sc_stream_url, type: String
  field :processing, type: Boolean, default: false
  field :processed_at, type: DateTime

  include Tire::Model::Search
  include Tire::Model::Callbacks

  validates_presence_of :debuted_at, :mix_collection,
    :performer_ids, :sc_url
  validates_uniqueness_of :sc_url

  default_scope excludes(processed_at: nil)
  scope :popular, order_by(popluarity_count: :desc)
  scope :recent, order_by(created_at: :desc)
  scope :unprocessed, where(processed_at: nil).order_by(:created_at, :desc)

  scope :in_year, ->(year) {
    where(
      :debuted_at.gte => Date.new(year.to_i),
      :debuted_at.lt  => (Date.new(year.to_i) + 1.year)
    )
  }

  # Do this later.
  attr_accessible :caption, :debuted_at, :performer_tokens,
    :mix_collection_id, :short_url, :sc_url,
    :processed, :processed_at, as: :admin

  mapping do
    indexes :id,               type: 'string',  index: :not_analyzed
    indexes :caption,          type: 'string',  analyzer: 'snowball', boost: 50
    indexes :play_count,       type: 'integer', index: :not_analyzed
    indexes :popluarity_count, type: 'integer', index: :not_analyzed
    indexes :processed_at, type: 'date', include_in_all: false
    indexes :performers do
      indexes :id, type: 'string', index: :not_analyzed
      indexes :name, type: 'string', analyzer: 'snowball', boost: 50
    end
    indexes :collection do
      indexes :id, type: 'string', index: :not_analyzed
      indexes :name, type: 'string', analyzer: 'snowball', boost: 50
    end
  end

  set_callback :save,   :before, :update_counter_cache, :if => :mix_collection_id_changed?
  set_callback :save,   :before, :update_popularity_count

  # Called after cause we need acces to them by there id's in delayed_job
  set_callback :save,   :after, :fetch_soundcloud_data, :if => :sc_url_changed?
  set_callback :create, :after, :generate_short_url

  class << self
    def paginate(options = {})
      page(options[:page]).per(options[:per_page])
    end

    def elastic_search(options={}, role=:default)
      tire.search( load: true, page: options[:page], per_page: (options[:per_page] || 12) ) do
        query do
          string options[:query], default_operator: "AND"
        end

        filter :missing, { field: :processed_at } if role.equal? :default

        sort do
          by :popluarity_count, 'desc'
        end
      end
    end
  end

  # For Tire
  def to_indexed_json
    {
      id: id,
      performers: performers.map { |p| { id: p.id, name: p.name } },
      mix_collection: { id: mix_collection.id, name: mix_collection.name },
      caption: caption,
      debuted_at: debuted_at,
      created_at: created_at,
      play_count: play_count,
      popluarity_count: popluarity_count
    }.to_json
  end

  def payload(options = {})
    {
      id: id,
      collection: mix_collection,
      performers: performers,
      caption: caption,
      play_count: play_count,
      favorite_count: favorites.count,
      debuted_at: debuted_at.to_i,
      created_at: created_at.to_i,
      duration: duration,
      is_favorite: options[:user].present? ? !options[:user].favorites.where(mix_id: self.id).empty? : false,
      short_url: short_url
    }
  end

  def as_json(options={})
    payload options
  end

  def title
    "#{mix_collection.name}#{!caption.blank? ? " - " + caption : ""} with #{performers.collect {|p| p.name }.join(', ')}"
  end

  alias :original_mix_collection= :mix_collection=
  def mix_collection=(mix_collection)
    if mix_collection.is_a? Hash
      mix_collection_id = mix_collection['id']
    else
      send :original_mix_collection=, mix_collection
    end
  end

  alias :original_performers= :performers=
  def performers=(performers)
    # Are the objects returned from ElasticSearch?
    if performers.all? { |p| p.is_a? Hash }
      performer_ids = performers.map { |c| c['id'] }
    else
      send :original_performers=, performers
    end
  end

  def performer_tokens=(ids)
    ids = ids.split(",")

    # Create the new performer if the ID is not an integer
    ids.collect! do |id|
      if BSON::ObjectId.legal?(id)
        id
      else
        id.strip!
        per = Performer.first(conditions: { name: Regexp.new(id, true) } )
        per.nil? ? Performer.create!(name: id).id : per.id
      end
    end

    self.performer_ids = ids.uniq
  end

  def played!
    self.inc(:play_count, 1)
    self.save
  end

  def streamable_url
    self.sc_stream_url =~ /\?/ ? "#{self.sc_stream_url}&client_id=#{ENV['SOUNDCLOUD_CLIENT_ID']}" : "#{self.sc_stream_url}?client_id=#{ENV['SOUNDCLOUD_CLIENT_ID']}"
  end

  def absolute_url(host=HOST)
    "http://#{host}/m/#{id}"
  end

  def generate_short_url
    Delayed::Job.enqueue(
      ShortenURLJob.new(self.class, self.id, :short_url, self.absolute_url),
      queue: 'short_url'
    )
  end

  def processed?
    self.processed_at.present?
  end

  def fetch_soundcloud_data
    Delayed::Job.enqueue SoundcloudMixDataJob.new(self.id)
  end

  protected
  def update_counter_cache
    new_mc = MixCollection.find self.mix_collection_id
    new_mc.inc(:mixes_count, 1);

    if self.mix_collection_id_was.present?
      old_mc = MixCollection.find self.mix_collection_id_was
      old_mc.inc(:mixes_count, -1);
    end
  end

  def update_popularity_count
    self.popluarity_count = self.favorites.count + self.play_count
  end
end
