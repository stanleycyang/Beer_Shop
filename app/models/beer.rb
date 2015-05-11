class Beer < ActiveRecord::Base
  belongs_to :user
  has_many :comments

  # Descending order
  default_scope->{order(created_at: :desc)}
end
