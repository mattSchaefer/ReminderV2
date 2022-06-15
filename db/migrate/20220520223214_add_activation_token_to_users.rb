class AddActivationTokenToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :activated, :boolean
    add_column :users, :activation_token, :string
    add_column :users, :activation_sent_at, :datetime
    add_column :users, :reset_email_token, :string
    add_column :users, :reset_email_sent_at, :datetime
    add_column :users, :unconfirmed_email, :string
    add_column :users, :reset_phone_token, :string
    add_column :users, :reset_phone_sent_at, :datetime
    add_column :users, :reset_password_token, :string
    add_column :users, :reset_password_sent_at, :datetime

  end
end
