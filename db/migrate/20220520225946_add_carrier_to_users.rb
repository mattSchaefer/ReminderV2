class AddCarrierToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :carrier, :string
  end
end
