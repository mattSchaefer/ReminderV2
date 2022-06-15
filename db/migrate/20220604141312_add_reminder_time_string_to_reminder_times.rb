class AddReminderTimeStringToReminderTimes < ActiveRecord::Migration[6.1]
  def change
    add_column :reminder_times, :reminder_time_string, :string
  end
end
