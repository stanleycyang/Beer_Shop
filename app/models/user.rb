class User < ActiveRecord::Base
  before_save :downcase_email
  before_create :create_api_key

  has_one :api_key, dependent: :destroy
  has_many :beers, dependent: :destroy
  has_many :comments, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }, uniqueness: {case_sensitive: false}, length: {maximum: 255}

  # Creates password and password confirmation with validations
  has_secure_password
  validates :password, length: {minimum: 6}

  def self.find_by_access_token(access_token)
    APIKey.find_by(access_token: access_token).user
  end

  private
    def downcase_email
      self.email.downcase!
    end

    def create_api_key
      self.api_key = APIKey.create
    end
end
