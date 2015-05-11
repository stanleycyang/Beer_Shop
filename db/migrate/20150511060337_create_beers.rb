class CreateBeers < ActiveRecord::Migration
  def change
    create_table :beers do |t|
      t.string :name
      t.integer :quantity
      t.string :location
      t.string :description

      t.timestamps null: false
    end
  end
end
