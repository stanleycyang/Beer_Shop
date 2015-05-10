class ApiKey < ActiveRecord::Base
  before_create :generate_access_token
  belongs_to :user

  def as_json(options={})
    super(only: :access_token)
  end

  private
    def generate_access_token
      begin
        self.access_token = SecureRandom.hex
      end while self.class.exists?(access_token: access_token)
    end
end
