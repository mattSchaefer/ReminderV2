class CreateReminderUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :reminder_users do |t|
      t.integer "reminder_id"
      t.integer "user_id"
      t.time "time"
      t.timestamps
    end
  end
end
