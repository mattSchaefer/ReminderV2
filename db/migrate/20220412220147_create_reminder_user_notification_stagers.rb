class CreateReminderUserNotificationStagers < ActiveRecord::Migration[6.1]
  def change
    create_table :reminder_user_notification_stagers do |t|
      t.belongs_to "reminder_user"
      t.date "date"
      t.time "time"
      t.boolean "notification_sent"
      t.timestamps
    end
  end
end
