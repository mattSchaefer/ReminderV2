import React from 'react';
import LoadingAnimation from '../LoadingAnimation'
import ReCaptchaV2 from 'react-google-recaptcha'
export default class EditEmailForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            requestUnderway: 'no',
            passwordFieldType: 'password'
        }
        this.setUnconfirmedEmail = this.setUnconfirmedEmail.bind(this)
        this.verifyForm = this.verifyForm.bind(this)
        this.showPasswordCheckboxChange = this.showPasswordCheckboxChange.bind(this)
        this.validateEmailMatch = this.validateEmailMatch.bind(this)

    }
    componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState){

    }
    setUnconfirmedEmail(){
        //alert('!')
        var curr_email = document.getElementById('change-email-current-email').value || ''
        var new_email = document.getElementById('change-email-new-email').value || ''
        var new_email_confirm = document.getElementById('change-email-new-email-confirm').value || ''
        const pword = document.getElementById('change-email-password').value || ''
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var verified = this.verifyForm(curr_email, new_email, new_email_confirm, pword)
        var access = this.props.accessToken
        var captcha_token = this.props.setUnconfirmedEmailCaptchaToken
        if(!verified)
            return;
        this.setState({requestUnderway: 'yes'})
        const url = "users/set_unconfirmed_email"
        const body = JSON.stringify({
            email: curr_email,
            new_email: new_email,
            password: pword
        })
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': 'bearer ' + access,
            'Captcha-Token': captcha_token
        }
        const options = {
            method: 'POST',
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            this.setState({requestUnderway: 'no'})
            if(json.status == 200){
                this.props.setUnconfirmedEmailStateValue(new_email)
                //document.getElementById('email-span').classList.add('green-underline')
                //document.getElementById('edit-email-toggle-button-icon').classList.remove('fa-pencil')
                //document.getElementById('edit-email-toggle-button-icon').classList.add('fa-check')
            }

        })
        .catch((e)=> {

        })
        
    }
    verifyForm(curr_email, new_email, new_email_confirm, pword){
        var flag = true;
        if(curr_email == ''){
            flag = false
            document.getElementById('change-email-current-email').classList.add('field-error')
        }
        if(new_email == ''){
            flag = false
            document.getElementById('change-email-new-email').classList.add('field-error')
        }
        if(new_email_confirm == ''){
            flag = false
            document.getElementById('change-email-new-email-confirm').classList.add('field-error')
        }
        if(pword == ''){
            flag = false
            document.getElementById('change-email-password').classList.add('field-error')
        }
        if(new_email !== new_email_confirm){
            flag = false
            document.getElementById('change-email-new-email').classList.add('field-error')
            document.getElementById('change-email-new-email-confirm').classList.add('field-error')
        }
        return flag;
    }
    showPasswordCheckboxChange(){
        if(document.getElementById('show-password-checkbox').checked){
            this.setState({passwordFieldType: 'text'})
        }else{
            this.setState({passwordFieldType: 'password'})
        }
    }
    validateEmailMatch(){
        setTimeout(() =>{
            if(document.getElementById('change-email-new-email').value == document.getElementById('change-email-new-email-confirm').value){
                document.getElementById('change-email-new-email').classList.remove('field-error')
                document.getElementById('change-email-new-email-confirm').classList.remove('field-error')
            }else{
                document.getElementById('change-email-new-email').classList.add('field-error')
                document.getElementById('change-email-new-email-confirm').classList.add('field-error')
            }
        },25)  
    }
    render(){
        return(
            <div>
                <h2>Change Email</h2>
                 <span className="login-form-span">
                    <label>Current email:</label>
                    <input className="form-control login-identifier" disabled id="change-email-current-email" placeholder={this.props.email} value={this.props.email} ></input>
                </span>
                <span>
                    <span className="login-form-span">
                        <label>New Email:</label>
                        <input className="form-control login-identifier" id="change-email-new-email" onChange={this.validateEmailMatch}></input>
                    </span>
                    <span className="login-form-span">
                        <label>New Email Confirm:</label>
                        <input className="form-control login-identifier" id="change-email-new-email-confirm" onChange={this.validateEmailMatch}></input>
                    </span>
                </span>
                <span className="login-form-span">
                    <label>Password:</label>
                    <input className="form-control login-identifier" id="change-email-password" type={this.state.passwordFieldType}></input>
                </span>
                <span className="show-password-span">
                    <label>Show Passwords:</label>
                    <input className="form-control" type="checkbox" id="show-password-checkbox" onChange={this.showPasswordCheckboxChange}></input>
                </span>
                {
                    this.state.requestUnderway == "no" &&
                    <ReCaptchaV2 id="setUnconfirmedEmailCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleSetUnconfirmedEmailCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />
                }
                {
                    this.state.requestUnderway == "no" &&
                    <button id="change-email-button" className="submit-button" onClick={this.setUnconfirmedEmail}>Change Email</button>
                    
                }
                {
                    this.state.requestUnderway == "yes" && 
                    <div className="change-email-loading-animation-container">
                        <LoadingAnimation />
                    </div>
                }
            </div>
        )
    }
}