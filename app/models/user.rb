class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :uid, type: String
  field :provider, type: String
  field :email, type: String
  field :first_name, type: String
  field :last_name, type: String
  field :api_key, type: String
  field :admin, type: Boolean, default: false
  has_many :favorites


  set_callback(:create, :before) do |document|
    document.generate_token(:api_key)
  end

  class << self
    def create_with_omniauth(auth)
      create! do |user|
        user.provider   = auth["provider"]
        user.uid        = auth["uid"]
        user.email      = auth["info"]["email"]
        user.first_name = auth["info"]["first_name"]
        user.last_name  = auth["info"]["last_name"]
      end
    end
  end

  def generate_token(column)
    begin
      self[column] = SecureRandom.urlsafe_base64
    end while User.exists?(conditions: { column => self[column] })
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def payload
    {
      id: id,
      uid: uid,
      email: email,
      first_name: first_name,
      last_name: last_name,
      api_key: api_key
    }
  end

  def as_json(options={})
    payload
  end

  def favorite!(mix)
    self.favorites.create(mix: mix) if self.favorites.where(mix_id: mix.id).empty?
  end

  def unfavorite!(mix)
    fav = self.favorites.where(mix_id: mix.id).first
    fav.present? && fav.destroy
  end

end