# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

#Creates a output log for you to view previously run cron jobs
set :output, "log/cron.log" 

#Sets the environment to run during development mode (Set to production by default)
set :environment, "development"

# every 1.day, :at => '0:05 am' do
#     runner "ReminderUserNotificationStager.stage_for_the_day"
# end

every 1.hour do
    #runner "ReminderUserNotificationStager.dispatch_for_this_hour"
    runner "ReminderUserNotificationStager.dispatch_for_this_hour_and_stage_for_next_hour"
end