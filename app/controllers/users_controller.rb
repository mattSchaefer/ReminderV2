class UsersController < ApplicationController
    protect_from_forgery with: :null_session
    include Token
    def new
        @user = User.new
    end
    def create
        respond_to :json
        @user = User.create(user_params)
        @user.activation_token = SecureRandom.hex(10)
        @user.activation_sent_at = Time.now.utc
        if @user.save!
            token = build_token(@user.id)
            # send activation email/sms
            render json: {message: "success", token: token, status: 200}
        else
            render json: {message: "bad", status: 500}
        end
    rescue => error
        render json: {error: error, status: 505}
    end
    def index

    end
    def update
        
    end
    def delete

    end

    def activate_account
        if !user_params[:activation_token]
            render json: {message: "no activation token supplied...", status: 400}
            return
        end
        @user = User.find_by(activation_token: user_params[:activation_token])
        if !@user
            render json: {message: "there's been an issue", status: 500}
            return
        end
        if ((@user.activation_sent_at + 4.hours) < Time.now.utc)
            render json: {message: "that token has expired.  please request a new one", status: 204}
            return
        end
        @user.activated = trued
        if @user.save!
            render json: {message: "user successfully activated!", status: 200, email: @user.email, phone: @user.phone, timezone: @user.timezone, carrier: @user.carrier}
        else
            render json: {message: "there was some issue activating that user", status: 400}
        end
    rescue => error
        render json: {error: error, status: 500}
    end
    def set_unconfirmed_email
        respond_to :json
        if request.headers['Captcha-Token']
            token_verification_response = verify_captcha()
        else
            token_verification_response = "rcaptcha unauthorized"
        end
        header = request.headers['Authorization'] || ''
        token = header.split(' ').last
        
        
        if !user_params[:email] || !user_params[:new_email]
            render json: {message: "missing params", status: 400}
            return
        end
        @user = User.find_by(email: user_params[:email])
        user_id = @user.id
        authorized_token = authorize_token(token, user_id.to_s)
        new_token = build_token(user_id)
        if authorized_token[:message] == 'authorized' && @user && @user.authenticate(user_params[:password])
            already_taken = User.find_by(email: [user_params[:new_email]])
            pending_taken = User.find_by(unconfirmed_email: user_params[:new_email])
            if !already_taken
                @user.unconfirmed_email = user_params[:new_email]
                @user.reset_email_token = SecureRandom.hex(10).strip
                @user.reset_email_sent_at = Time.now.utc
                if @user.save!
                    @reset_token = @user.reset_email_token
                    #UserMailer.with(reset_token: @reset_token, old_email: user_params[:email], new_email: user_params[:new_email]).reset_email_email.deliver_now
                    render json: {status: 200, message: 'unconfirmed email set and instructions sent', email: user_params[:new_email], new_token: new_token}, status: :ok
                    #send user reset email token
                else
                    render json: {message: "there seems to be some issue", status: 400}
                    return
                end
            else
                render json: {message: "there seems to be some issue", status: 400}
                return
            end
        else
            render json: {message: "there seems to be some issue", status: 400}
            return
        end
    end
    def confirm_unconfirmed_email
        respond_to :json
        email = params[:email].to_s
        user = User.find_by(unconfirmed_email: user_params[:new_email])
        user_id = user.id
        header = request.headers['Authorization'] || ''
        token = header.split(' ').last
        authorized_token = authorize_token(token, user_id.to_s)
        new_token = build_token(user_id)
        # 
        user_email_confirmation_token_valid = (user.reset_email_token == params[:token]) && ((user.reset_email_sent_at + 4.hours) > Time.now.utc)
        if request.headers['Captcha-Token']
            token_verification_response = verify_captcha()
        else
            token_verification_response = "rcaptcha unauthorized"
        end
        if !user || !user_email_confirmation_token_valid || authorized_token[:message] != 'authorized' 
            render json: {error: 'there is an issue with that suspicious link...', status: 401}
        else
            user.email = user.unconfirmed_email
            user.unconfirmed_email = ''
            if user.save!
                render json: {status: 200, message: 'email updated successfully', email: user.email, new_token: new_token}, status: :ok
            else
                render json: {status: 401, body: "oops"}
            end
        end
    end
    def set_unconfirmed_phone
        respond_to :json
        if request.headers['Captcha-Token']
            token_verification_response = verify_captcha()
        else
            token_verification_response = "rcaptcha unauthorized"
        end
        header = request.headers['Authorization'] || ''
        token = header.split(' ').last
        
        
        if !user_params[:phone] || !user_params[:new_phone]
            render json: {message: "missing params", status: 400}
            return
        end
        @user = User.find_by(phone: user_params[:phone])
        user_id = @user.id
        authorized_token = authorize_token(token, user_id.to_s)
        new_token = build_token(user_id)
        if authorized_token[:message] == 'authorized' && @user && @user.authenticate(user_params[:password])
            already_taken = User.find_by(phone: [user_params[:new_phone]])
            pending_taken = User.find_by(unconfirmed_phone: user_params[:new_phone])
            if !already_taken
                @user.unconfirmed_phone = user_params[:new_phone]
                @user.reset_phone_token = SecureRandom.hex(10).strip
                @user.reset_phone_sent_at = Time.now.utc
                if @user.save!
                    @reset_token = @user.reset_phone_token
                    #UserMailer.with(reset_token: @reset_token, old_email: user_params[:email], new_email: user_params[:new_email]).reset_email_email.deliver_now
                    render json: {status: 200, message: 'unconfirmed phone set and instructions sent', phone: user_params[:new_phone], new_token: new_token}, status: :ok
                    #send user reset email token
                else
                    render json: {message: "there seems to be some issue1", status: 400}
                    return
                end
            else
                render json: {message: "there seems to be some issue2", status: 400, already_taken: already_taken}
                return
            end
        else
            render json: {message: "there seems to be some issue3", status: 400}
            return
        end
        rescue => error
            render json: {error: error, status: 505}
    end
    def confirm_unconfirmed_phone
        respond_to :json
        phone = params[:phone].to_s
        user = User.find_by(unconfirmed_phone: user_params[:new_phone])
        user_id = user.id
        header = request.headers['Authorization'] || ''
        token = header.split(' ').last
        authorized_token = authorize_token(token, user_id.to_s)
        new_token = build_token(user_id)
        # 
        user_phone_confirmation_token_valid = (user.reset_phone_token == params[:token]) && ((user.reset_phone_sent_at + 4.hours) > Time.now.utc)
        if request.headers['Captcha-Token']
            token_verification_response = verify_captcha()
        else
            token_verification_response = "rcaptcha unauthorized"
        end
        if !user || !user_phone_confirmation_token_valid || authorized_token[:message] != 'authorized' 
            render json: {error: 'there is an issue with that suspicious link...', status: 401}
        else
            user.phone = user.unconfirmed_phone
            user.unconfirmed_phone = ''
            if user.save!
                render json: {status: 200, message: 'phone updated successfully', phone: user.phone, new_token: new_token}, status: :ok
            else
                render json: {status: 401, body: "oops"}
            end
        end
    end
    def forgot_password
        if user_params[:email].blank?
            return render json: {error: 'Email not present'}
        end
        if request.headers['Captcha-Token']
            token_verification_response = verify_captcha()
        else
            token_verification_response = "rcaptcha unauthorized"
        end
        user = User.find_by(email: user_params[:email].downcase)
        #&& token_verification_response["success"]
        if user 
            user.reset_password_token = SecureRandom.hex(10).strip
            user.reset_password_sent_at = Time.now.utc
            if user.save!
                @reset_token = user.reset_password_token
                #UserMailer.with(forgot_token: @reset_token, email: user_params[:email]).forgot_password_email.deliver_now
                render json: {status: 200, reset_token: @reset_token}, status: :ok
            end
        else
            render json: {error: ['Email address not found. Please check and try again.']}, status: :not_found
        end
    end
    def reset_via_token
        token = user_params[:token].to_s
        if user_params[:token].blank?
            return render json: {error: 'token not present'}
        end
        if request.headers['Captcha-Token']
            token_verification_response = verify_captcha()
        else
            token_verification_response = "rcaptcha unauthorized"
        end
        user = User.find_by(reset_password_token: token)
        valid = ((user.reset_password_sent_at + 4.hours) > Time.now.utc)
        #&& token_verification_response["success"]
        if user.present? && valid 
            user.reset_password_token = nil
            user.password = user_params[:new_password]
            if user.save!
                render json: {status: 200, message: 'password successfully reset'}, status: :ok
            else
                render json: {error: 'error'}
            end
        end
    end
    def reset_via_old_password
        respond_to :html, :json, :xml
        if user_params[:email]
            user = User.find_by(email: user_params[:email])
            user_id = user.id
            header = request.headers['Authorization'] || ''
            token = header.split(' ').last
            authorized_token = authorize_token(token, user_id.to_s)
            new_token = build_token(user_id)
            if request.headers['Captcha-Token']
                token_verification_response = verify_captcha()
            else
                token_verification_response = "rcaptcha unauthorized"
            end
            # && token_verification_response["success"]
            if user.authenticate(user_params[:old_password]) && authorized_token[:message] == 'authorized'
                user.password = user_params[:new_password]
                user.save!
                render json: {message: 'good', status: 200, new_token: new_token}
            else
                render json: {message: 'bad', status: 500}
            end
        else
            render json: {error: 'error'}
        end
    end
    def change_carrier
        respond_to :json
        if user_params[:email]
            user = User.find_by(email: user_params[:email])
            user_id = user.id
            header = request.headers['Authorization'] || ''
            token = header.split(' ').last
            authorized_token = authorize_token(token, user_id.to_s)
            new_token = build_token(user_id)
            if request.headers['Captcha-Token']
                token_verification_response = verify_captcha()
            else
                token_verification_response = "rcaptcha unauthorized"
            end
            # && token_verification_response["success"]
            if authorized_token[:message] == 'authorized'
                user.carrier = user_params[:new_carrier]
                user.save!
                render json: {message: 'good', status: 200, new_token: new_token}
            else
                render json: {message: 'bad', status: 500}
            end
        else
            render json: {error: 'error'}
        end

    end
    def change_timezone
        if user_params[:email]
            user = User.find_by(email: user_params[:email])
            user_id = user.id
            header = request.headers['Authorization'] || ''
            token = header.split(' ').last
            authorized_token = authorize_token(token, user_id.to_s)
            new_token = build_token(user_id)
            if request.headers['Captcha-Token']
                token_verification_response = verify_captcha()
            else
                token_verification_response = "rcaptcha unauthorized"
            end
            # && token_verification_response["success"]
            if authorized_token[:message] == 'authorized'
                user.timezone = user_params[:new_timezone]
                user.save!
                render json: {message: 'good', status: 200, new_token: new_token}
            else
                render json: {message: 'bad', status: 500}
            end
        else
            render json: {error: 'error'}
        end
    end
    private
        def user_params
            params.permit(:email, :password, :password_confirm, :phone, :carrier, :new_carrier, :timezone, :new_timezone, :activation_token, :user, :new_email, :new_phone, :token, :old_password, :new_password)
        end
end
