class ReminderUser < ApplicationRecord
    belongs_to :user
    belongs_to :reminder
end
