class ReminderUsersController < ApplicationController
    protect_from_forgery with: :null_session
    include Token
    def show
        @reminder_users = ReminderUser.all()
        render json: {reminder_users: @reminder_users, status: 200}
    end
    def create
        @reminder_user = @ReminderUser.new(reminder_user_params)
        if @reminder_user.save!
            render json: {reminder_user: @reminder_user, status: 200}
        end
    end
    def update
    end
    def destroy
    end
    def get_reminders_for_user
        header = request.headers['Authorization'] || ''
        token = header.split(' ').last
        authorized_token = authorize_token(token, params[:user_id].to_s)
        if authorized_token[:message] == 'authorized'
            @reminders_for_user = ReminderUser.where(user_id: params[:user_id])
            reminders_copy = []
            for ele in @reminders_for_user do
                obj = {user_id: "", reminder_type: '', id: '', reminder_id: '', time: ''}
                obj["user_id"] = ele.user_id || ""
                obj["reminder_type"] = ele.reminder.reminder_type || ""
                obj["id"] = ele.id || ""
                obj["reminder_id"] = ele.reminder_id || ""
                obj["max_per_day"] = ele.reminder.max_per_day || ""
                if ele.reminder_time
                    obj["time"] = ele.reminder_time.reminder_time_string || ""
                end
                reminders_copy.push(obj)
            end
            render json: {subscriptions: reminders_copy, status: 200, user_id: reminder_user_params[:user_id]}
        else
            render json: {message: "there seems to be some issue", status: 400}
            return
        end
    end
    def update_schedule_for_user_reminders
        respond_to :json
        header = request.headers['Authorization'] || ''
        token = header.split(' ').last
        authorized_token = authorize_token(token, params[:user_id].to_s)
        if authorized_token[:message] != 'authorized'
            render json: {error: 'unauthorized', status: 402}
            return
        end
        if ( !params[:times] && !params[:time] ) || !params[:user_id] || !params[:reminder_type]
            render json: {error: 'missing params', status: 402}
        end
        @reminder = Reminder.where(reminder_type: params[:reminder_type]).first
        @reminder_user_to_destroy = ReminderUser.where(user_id: params[:user_id], reminder_id: @reminder.id)
        @reminder_user_to_destroy.destroy_all
        @times = params[:times].to_s.split(',')
        @added_times = []
        for time in @times do
            reminder_user = ReminderUser.new()
            time_lookup = ReminderTime.where(reminder_time_string: time).first
            if !@reminder || !time
                render json: {error: 'missing params', status: 402}
            end
            reminder_user.reminder_id = @reminder.id
            reminder_user.user_id = params[:user_id]
            reminder_user.reminder_time_id = time_lookup.id
            if reminder_user.save!
                obj = {user_id: "", reminder_type: '', id: '', reminder_id: '', time: ''}
                obj["user_id"] = reminder_user.user_id || ""
                obj["reminder_type"] = reminder_user.reminder.reminder_type || ""
                obj["id"] = reminder_user.id || ""
                obj["reminder_id"] = reminder_user.reminder_id || ""
                obj["max_per_day"] = reminder_user.reminder.max_per_day || ""
                if reminder_user.reminder_time
                    obj["time"] = reminder_user.reminder_time.reminder_time_string || ""
                end
                @added_times.push(obj)
            end
        end
        #stage this time for this user for today?  only stage for times that havent happened yet today?  or dont worry, and schedule update will take place the next day :).  could  be spammed otherwise
        render json: {added_reminder_users: @added_times, status: 200}
    end
    def get_instances_of_reminder
        if !reminder_user_params[:reminder_id]
            render json: {message: 'missing params', status: 500}
            return
        end
        @instances = ReminderUser.find_by(reminder_id: reminder_user_params[:reminder_id])
        render json: {instances: @instances, status: 200}
    end
    def stage_this_user_and_type_for_today
        ReminderUserNotificationStager.stage_this_type_for_this_user_for_today(params[:user_id], params[:reminder_type])
    end
    private
        def reminder_user_params
            params.permit(:reminder_id, :user_id, :time, :times, :reminder_type)
        end
end
