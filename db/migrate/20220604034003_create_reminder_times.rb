class CreateReminderTimes < ActiveRecord::Migration[6.1]
  def change
    create_table :reminder_times do |t|
      t.time :time

      t.timestamps
    end
  end
end
