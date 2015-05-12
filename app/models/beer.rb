class Beer < ActiveRecord::Base
  belongs_to :user
  has_many :comments

  validates :name, :quantity, :location,  presence: true
  validates_numericality_of :quantity, :on => :create

  # Descending order
  default_scope->{order(created_at: :desc)}
end
