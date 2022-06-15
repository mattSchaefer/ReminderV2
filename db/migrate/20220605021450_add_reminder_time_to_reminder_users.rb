class AddReminderTimeToReminderUsers < ActiveRecord::Migration[6.1]
  def change
    add_reference :reminder_users, :reminder_time, index: true
  end
end
