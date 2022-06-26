class ReminderUserNotificationStager < ApplicationRecord
    belongs_to :reminder_user
    def self.stage_for_the_day
        reminder_users = ReminderUser.all()
        for reminder_user in reminder_users do
            stager = ReminderUserNotificationStager.new()
            stager.reminder_user = reminder_user
            stager.time = reminder_user.reminder_time.reminder_time_string
            stager.notification_sent = false
            stager.date = DateTime.current.to_date
            stager.save()
            puts stager
        end
    end
    def self.dispatch_for_this_hour
        #Get all the stagers that are for "this hour" and notification sent is false, and search for all remaining "last hour" stagers where notification sent is false
        #Send the notification
        #Mark on the stager notification_sent to true
    
        this_hour = Time.now.to_s.split(' ')[1]
        stagers = ReminderUserNotificationStager.where("time < ?", this_hour).where.not(notification_sent: true)
        for stager in stagers do
            #send notification
            stager.notification_sent = true
            stager.save()
        end
        puts stagers
    end
end
