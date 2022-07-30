class ReminderUserNotificationStager < ApplicationRecord
    belongs_to :reminder_user
    def self.stage_for_the_day
        reminder_users = ReminderUser.all
        for reminder_user in reminder_users do
            stager = ReminderUserNotificationStager.new
            stager.reminder_user = reminder_user
            #to_parse =
            #.in_time_zone('Eastern Time (US & Canada)')
            #.in_time_zone('Mountain Time (US & Canada)')
            #.in_time_zone('Central Time (US & Canada)')
            #.in_time_zone('Pacific Time (US & Canada)')
            #.in_time_zone('Atlantic Time (US & Canada)')
            #.in_time_zone('Eastern Time (US & Canada)')
            #.in_time_zone('Hawaii'),
            #.in_time_zone('Alaska')
            string = DateTime.now.beginning_of_day.to_date.to_s + " " + reminder_user.reminder_time.reminder_time_string.to_s + " " 
            #fuzzy_date_string = DateTime.current
            case reminder_user.user.timezone
            when 'eastern-standard'
                string += 'Eastern'
                puts 'eastern-standard'
            when 'central-standard'
                string += 'Central'
            when 'pacific-standard'
                string += 'Pacific'
            when 'mountain-standard'
                string += 'Mountain'
            when 'alaska-standard'
                string += 'Alaska'
            when 'hawaii'
                string += 'Hawaii'
            else
                puts 'huh?'
            end
            if Time.now.dst?
                string += " DST"
            end
            puts string
            puts "staging for the day " + DateTime.current.to_s
            fuzzy_date_string = DateTime.parse(string)
            puts fuzzy_date_string
            puts fuzzy_date_string.utc
            stager.time = fuzzy_date_string.utc
            stager.notification_sent = false
            stager.date = DateTime.current.to_date
            stager.save
        end
    end
    def self.stage_this_type_for_this_user_for_today(user,type)
        reminder = Reminder.where(reminder_type: type).first
        reminder_users = ReminderUser.where(user_id: user, reminder_id: reminder)
        for reminder_user in reminder_users do 
            stager = ReminderUserNotificationStager.new
            stager.reminder_user = reminder_user
            string = DateTime.now.beginning_of_day.to_date.to_s + " " + reminder_user.reminder_time.reminder_time_string.to_s + " " 
            #fuzzy_date_string = DateTime.current
            case reminder_user.user.timezone
            when 'eastern-standard'
                string += 'Eastern'
                puts 'eastern-standard'
            when 'central-standard'
                string += 'Central Time (US & Canada)'
            when 'pacific-standard'
                string += 'Pacific Time (US & Canada)'
            when 'mountain-standard'
                string += 'Mountain Time (US & Canada)'
            when 'alaska-standard'
                string += 'Alaska'
            when 'hawaii'
                string += 'Hawaii'
            else
                puts 'huh?'
            end
            if Time.now.dst?
                string += " DST"
            end
            puts string
            puts "staging for the day " + DateTime.current
            fuzzy_date_string = DateTime.parse(string)
            puts fuzzy_date_string
            puts fuzzy_date_string.utc
            stager.time = fuzzy_date_string.utc
            stager.notification_sent = false
            stager.date = DateTime.current.to_date
            stager.save
        end
    end
    def self.dispatch_for_this_hour
        #Get all the stagers that are for "this hour" and notification sent is false, and search for all remaining "last hour" stagers where notification sent is false
        #Send the notification
        #Mark on the stager notification_sent to true
        this_hour = Time.now.utc.to_s.split(' ')[1].to_i
        puts "staging for the hour " + this_hour.to_s
        puts DateTime.current
        stagers = ReminderUserNotificationStager.where(notification_sent: false)
        for stager in stagers do
            #ones we havent sent for today, or if utc time is actually "tomorrow"
            if ( (stager.time.utc.to_s.split(" ")[1].to_i < this_hour) && (stager.time.utc.to_s.split(" ")[0] == Date.current.to_s) ) || DateTime.current.utc.to_i > stager.time.utc.to_i
                ### TODO????? CHECK AGAINS THE REMINDERUSER.USER.TIMEZONE??  actually maybe not, since its already set in utc based on user's timezone :)
                #send notification
                if stager.reminder_user && stager.reminder_user.user
                    recipient = SMSEasy::Client.sms_address(stager.reminder_user.user.phone, stager.reminder_user.user.carrier)
                    UserMailer.with(reminder_text: stager.reminder_user.reminder.text_body, reminder_type: stager.reminder_user.reminder.reminder_type,  recipient: recipient).reminder_email.deliver_now
                end
                #puts "inside if"
                
                stager.notification_sent = true
                stager.save()
            end
        end
    end
    def self.dispatch_for_this_hour_and_stage_for_next_hour
        puts "trying something"
        this_hour = Time.now.utc.to_s.split(' ')[1].to_i
        next_hour = Time.now.utc.to_s.split(' ')[1].to_i + 1
        dispatch_for_this_hour()
        reminder_users = ReminderUser.all
        for reminder_user in reminder_users do
            reminder_user_reminder_time_string = reminder_user.reminder_time.reminder_time_string
            string = DateTime.now.beginning_of_day.to_date.to_s + " " + reminder_user.reminder_time.reminder_time_string.to_s + " " 
            #fuzzy_date_string = DateTime.current
            case reminder_user.user.timezone
            when 'eastern-standard'
                string += 'Eastern'
                puts 'eastern-standard'
            when 'central-standard'
                string += 'Central'
            when 'pacific-standard'
                string += 'Pacific'
            when 'mountain-standard'
                string += 'Mountain'
            when 'alaska-standard'
                string += 'Alaska'
            when 'hawaii'
                string += 'Hawaii'
            else
                puts 'huh?'
            end
            if Time.now.dst?
                string += " DST"
            end
            puts string
            fuzzy_date_string = DateTime.parse(string)
            puts fuzzy_date_string
            puts fuzzy_date_string.utc.to_s.split(' ')[1].to_i
            reminder_user_reminder_time_int = fuzzy_date_string.utc.to_s.split(' ')[1].to_i
            puts next_hour = Time.now.utc.to_s.split(' ')[1].to_i + 1
            if reminder_user_reminder_time_int == next_hour
                #stage
                puts "found one"
                puts reminder_user
                stager = ReminderUserNotificationStager.new
                stager.reminder_user = reminder_user
                stager.time = fuzzy_date_string.utc
                stager.notification_sent = false
                stager.date = DateTime.current.to_date
                stager.save
                puts "staged!"
                puts stager
            end
        end
    end
    def timezone_offset_map
        {
            'eastern-standard': 5,
            'atlantic-standard': 4,
            'central-standard': 6,
            'mountain-standard': 7,
            'pacific-standard': 8,
            'alaska-standard': 9,
            'hawaii': 10
        }
    end
    def self.time_value_map
        {
            "12 a.m.": 0,
            "1 a.m.": 1,
            "2 a.m.": 2,
            "3 a.m.": 3,
            "4 a.m.": 4,
            "5 a.m.": 5,
            "6 a.m.": 6,
            "7 a.m.": 7,
            "8 a.m.": 8,
            "9 a.m.": 9,
            "10 a.m.": 10,
            "11 a.m.": 11,
            "12 p.m.": 12,
            "1 p.m.": 13,
            "2 p.m.": 14,
            "3 p.m.": 15,
            "4 p.m.": 16,
            "5 p.m.": 17,
            "6 p.m.": 18,
            "7 p.m.": 19,
            "8 p.m.": 20,
            "9 p.m.": 21,
            "10 p.m.": 22,
            "11 p.m.": 23,
            "": 24
        }
    end
end
