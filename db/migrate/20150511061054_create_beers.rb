class CreateBeers < ActiveRecord::Migration
  def change
    create_table :beers do |t|
      t.string :name
      t.integer :quantity
      t.string :location
      t.string :description
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
