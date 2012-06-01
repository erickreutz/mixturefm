class Performer
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug

  field :name, :type => String
  slug :name
  paginates_per 20

  has_and_belongs_to_many :mixes

  validates_presence_of :name, message: "cannot be blank."
  validates_uniqueness_of :name, message: "is already taken.", case_sensitive: false

  attr_accessible :name, as: [ :default, :admin ]
  default_scope order_by(name: 'ASC')

  def payload
  	{
      id: id,
  		name: name,
      slug: slug
  	}
  end

  def as_json(options={})
  	payload
  end

  class << self
    def simple_search(query = //i)
      where(:name => query)
    end

    def paginate(options = {})
      page(options[:page]).per(options[:per_page])
    end
  end
end
