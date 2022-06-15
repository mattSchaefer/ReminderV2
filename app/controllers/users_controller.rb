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
        @user.activated = true
        if @user.save!
            render json: {message: "user successfully activated!", status: 200, email: @user.email, phone: @user.phone, timezone: @user.timezone, carrier: @user.carrier}
        else
            render json: {message: "there was some issue activating that user", status: 400}
        end
    rescue => error
        render json: {error: error, status: 500}
    end
    def change_email

    end
    def change_phone

    end
    def change_password

    end

    private
        def user_params
            params.permit(:email, :password, :password_confirm, :phone, :carrier, :timezone, :activation_token, :user)
        end
end
