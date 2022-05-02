class UsersController < ApplicationController
    protect_from_forgery with: :null_session
    include Token
    def new
        @user = User.new
    end
    def create
        respond_to :json
        @user = User.create(user_params)
        if @user.valid? && @user.save!
            token = build_token(@user.id)
            render json: {message: "success", token: token, status: 200}
        else
            render json: {message: "bad", status: 500}
        end
    end
    def index
    end
    def update
        
    end
    def delete
    end
    private
        def user_params
            params.require(:user).permit(:email, :password, :password_confirm, :phone)
        end
end
