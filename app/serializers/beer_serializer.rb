class BeerSerializer < ActiveModel::Serializer
  attributes :id, :name, :quantity, :location, :description, :poster

  def poster
    return {id: object.user.id, name: object.user.name}
  end
end
