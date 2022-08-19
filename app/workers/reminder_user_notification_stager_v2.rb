class ReminderUserNotificationStagerV2
    include Sidekiq::Worker
    def perform(*args)
        ReminderUserNotificationStager.dispatch_for_this_hour_and_stage_for_next_hour
    end
end
#Sidekiq::Cron::Job.create(name: 'ReminderUserNotificationStagerV2 - every 1hour', cron: '0 */1 * * *', class: 'ReminderUserNotificationStagerV2')