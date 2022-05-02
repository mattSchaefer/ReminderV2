class User < ApplicationRecord
    has_secure_password
    has_many :reminder_users
    has_many :reminders, :through => :reminder_users
end
