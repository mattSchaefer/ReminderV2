class AuthController < ApplicationController
    include Token
    def login
        respond_to :json
        if @user = User.find_by(email: auth_params[:email]) || @user = User.find_by(phone: auth_params[:phone])
            if @user.authenticate(auth_params[:password])
                token = build_token(@user.id)
                unconf_email = @user.unconfirmed_email || ""
                unconf_phone = @user.unconfirmed_phone || ""
                render json: {message: "login success", id: @user.id, phone: @user.phone, email: @user.email, token: token, timezone: @user.timezone, carrier: @user.carrier, unconfirmed_email: unconf_email, unconfirmed_phone: unconf_phone, status: 200}
            else
                render json: {message: 'unauthorized', status: 505}
            end
        else 
            render json: {message: 'not found', status: 404}
        end
    end
    def logout
    end
    private
        def auth_params
            params.permit(:email, :phone, :password, :password_confirm)
        end
end
