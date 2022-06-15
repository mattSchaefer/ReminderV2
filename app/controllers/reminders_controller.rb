class RemindersController < ApplicationController
    def show
        @reminders = Reminder.all()
        render json: {reminders: @reminders}
    end
    def create
    end
    def update
    end
    def delete
    end
end
