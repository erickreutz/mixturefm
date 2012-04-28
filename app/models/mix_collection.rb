class MixCollection
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug

  paginates_per 12

  field :name, type: String
  field :mixes_count, type: Integer, default: 0
  slug :name

  has_many :mixes

  validates_presence_of :name, message: "cannot be blank."
  validates_uniqueness_of :name, message: "is already taken."

  # Do this later.
  attr_accessible :name, as: [ :default, :admin ]

  class << self
    def popular
      order_by([:mixes_count, :desc])
    end

    def paginate(options = {})
      page(options[:page]).per(options[:per_page])
    end
  end

  def years
    self.mixes.only(:debuted_at)
      .order_by(:debuted_at, :desc)
      .collect { |m| m.debuted_at.year }.uniq
  end

  def payload
  	{
      id: id,
  		name: name,
      slug: slug,
  		mix_count: mixes_count
  	}
  end

  def as_json(options={})
  	payload
  end
end
