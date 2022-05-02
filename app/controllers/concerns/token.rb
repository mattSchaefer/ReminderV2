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
    protected
        def jwt_expired(exception)
            render json: {exception: exception}
        end
    private
        
end