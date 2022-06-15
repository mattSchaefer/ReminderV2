class ReminderUser < ApplicationRecord
    belongs_to :user
    belongs_to :reminder
    belongs_to :reminder_time
end
