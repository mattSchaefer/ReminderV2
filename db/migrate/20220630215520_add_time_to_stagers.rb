class AddTimeToStagers < ActiveRecord::Migration[6.1]
  def change
    add_column(:reminder_user_notification_stagers, :time, :datetime)
  end
end
