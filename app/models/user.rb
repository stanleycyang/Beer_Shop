class User < ActiveRecord::Base
  before_save :downcase_email
  before_create :create_api_key

  has_one :api_key, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }, uniqueness: {case_sensitive: false}, length: {maximum: 255}

  # Creates password and password confirmation with validations
  has_secure_password
  validates :password, length: {minimum: 6}

  private
    def downcase_email
      self.email.downcase!
    end

    def create_api_key
      self.api_key = APIKey.create
    end
end
