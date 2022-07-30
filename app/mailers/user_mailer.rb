class UserMailer < ApplicationMailer
    def activate_account_email
        @email = params[:email]
        @token = params[:token]
        mail(to: @email, subject: "Welcome to PostureCheck!  Activate your account...")
    end
    def forgot_password_email
        @email = params[:email]
        @token = params[:token]
        mail(to: @email, subject: "PostureCheck! Follow these instructions to reset your password")
    end
    def reset_phone_email
        @old_phone = params[:old_phone]
        @new_phone = params[:new_phone]
        @token = params[:token]
        @recipient = params[:recipient]
        mail(to: @recipient, subject: "~")
    end
    def reset_email_email
        @old_email = params[:old_email]
        @new_email = params[:new_email]
        @token = params[:token]
        mail(to: @new_email, subject: "Request to reset your PostureCheck! email account.")
    end
    def reminder_email
        @recipient = params[:recipient]
        @reminder_type = params[:reminder_type]
        @reminder_text = params[:reminder_text]
        mail(to: @recipient, subject: '~')
    end
    def contact_created_email
        @from = params[:from]
        @message = params[:message]
        mail(to: 'posturecheckforfree@gmail.com', subject: 'Contact Created')
    end
end
