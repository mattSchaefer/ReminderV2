class AddUnconfirmedPhoneToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :unconfirmed_phone, :string
  end
end
