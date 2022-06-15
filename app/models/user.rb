class User < ApplicationRecord
    has_secure_password
    has_many :reminder_users
    has_many :reminders, :through => :reminder_users
    validates :email, presence: true, uniqueness: true
    validates :phone, presence: true, uniqueness: true
    validates :password, presence: true, on: [:create, :change_email, :change_phone, :change_password]
    include Token
end
