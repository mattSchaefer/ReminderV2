class ChangeStagerTimeColumnType < ActiveRecord::Migration[6.1]
  def change
    remove_column(:reminder_user_notification_stagers, :time)
  end
end
