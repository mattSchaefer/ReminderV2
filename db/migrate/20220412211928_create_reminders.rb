class CreateReminders < ActiveRecord::Migration[6.1]
  def change
    create_table :reminders do |t|
      t.string "type"
      t.text "text_body"
      t.integer "max_per_day"
      t.timestamps
    end
  end
end
