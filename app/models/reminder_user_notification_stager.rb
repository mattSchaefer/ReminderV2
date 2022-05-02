class ReminderUserNotificationStager < ApplicationRecord
    belongs_to :reminder_user

    def self.stage_for_the_day
        r = Reminder.new()
        r[:reminder_type] = "hello_cron"
        r.save()
    end
    def self.dispatch_for_this_hour
        5
    end
end
