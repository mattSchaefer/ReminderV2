class Reminder < ApplicationRecord
    has_many :reminder_users
    has_many :users, :through => :reminder_users
end
