class FixColumnName < ActiveRecord::Migration[6.1]
  def self.up
    rename_column :reminders, :type, :reminder_type
  end
end
