class ContactsController < ApplicationController
    def create
        if request.headers['Captcha-Token']
            token_verification_response = verify_captcha()
        else
            token_verification_response = "rcaptcha unauthorized"
        end
        if !token_verification_response["success"]
            return render json: {message: 'unauthorized', status: 400}
        end
        contact = Contact.new(contact_params)
        if contact.save!
            UserMailer.with(from: contact_params[:email], message: contact_params[:message]).contact_created_email.deliver_later
            render json: {message: 'contact created', contact: contact, status: 200}
            return
        end
        render json: {message: 'there was an issue', status: 200}
    end
    private
        def contact_params
            params.permit(:email, :message)
        end
end
