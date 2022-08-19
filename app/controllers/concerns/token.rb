module Token
    extend ActiveSupport::Concern
    def build_token(data)
        secret = self.secret
        expire_frame = self.expiration_frame
        payload = {data: data, createdAt: DateTime.current, exp: Time.now.to_i + expire_frame}
        token = encode_token(payload, secret)
        return {token: token, pretty_expire: Time.at(Time.now.to_i + expire_frame)}
    end
    def encode_token(payload,secret)
        JWT.encode payload, secret, 'HS256'
    end
    def decode_token(token)
        JWT.decode(token, self.secret)
        rescue => error
            {status: 401, body: 'very bad', error: error}
    end
    def validate_token(token)
        decoded = decode_token(token)
        expired = DateTime.now.to_i > decoded[0]['exp']
        return_data = {expired: expired, decoded: decoded}
        return_data
        rescue => error
             {status: 401, body: 'very bad', error: error}
    end
    def expiration_frame
        6000
    end
    def authorize_token(token, user_id)
        decoded = decode_token(token)
        expired = DateTime.now.to_i > decoded[0]['exp']
        return_data = {expired: expired, decoded: decoded}
        if decoded[0]['data'].to_s == user_id.to_s && User.find(user_id).activated && User.find(user_id).activated == true && expired === false
            return_data = {message: 'authorized', status: 200}
        else
            return_data = {message: 'not authorized', status: 500}
        end
        return_data
    end
    protected
        def jwt_expired(exception)
            render json: {exception: exception}
        end
        def secret
            ENV['SECRET_KEY_BASE'] || Rails.application.secrets.secret_key_base
        end
    private
        
end