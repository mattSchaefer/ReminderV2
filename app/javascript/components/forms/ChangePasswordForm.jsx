import React from 'react';
import LoadingAnimation from '../LoadingAnimation';
import ReCaptchaV2 from 'react-google-recaptcha';

export default class ChangePasswordForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            responseStatus: 999,
            requestUnderway: 'no',
            passwordFieldType: 'password'
        }
        this.verifyForm = this.verifyForm.bind(this)
        this.changePasswordSubmit = this.changePasswordSubmit.bind(this)
        this.showPasswordCheckboxChange = this.showPasswordCheckboxChange.bind(this)
        this.validatePasswordMatch = this.validatePasswordMatch.bind(this)
        this.validateNewPasswordMatch = this.validateNewPasswordMatch.bind(this)
    }
    componentDidMount(){}
    componentDidUpdate(prevProps, prevState){}
    changePasswordSubmit(){
        const password = document.getElementById('change-password-password').value || ''
        const password_confirm = document.getElementById('change-password-password-confirm').value || ''
        const new_password = document.getElementById('change-password-new-password').value || ''
        const new_password_confirm = document.getElementById('change-password-new-password-confirm').value || ''
        var email = this.props.email
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var verified = this.verifyForm(password, password_confirm, new_password, new_password_confirm)
        var access = this.props.accessToken
        var captcha_token = this.props.changePasswordCaptchaToken
        if(!verified)
            return;
        this.setState({requestUnderway: 'yes'})
        const url = 'users/change_password'
        var body = JSON.stringify({
            old_password: password,
            new_password: new_password,
            email: email
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
            this.setState({responseStatus: json.status, requestUnderway: 'no'})
        })
        .catch((e) => {

        })
    }
    verifyForm(password, password_confirm, new_password, new_password_confirm){
        var flag = true
        if(password == ''){
            flag = false
            document.getElementById('change-password-password').classList.add('field-error')
        }
        if(password_confirm == ''){
            flag = false
            document.getElementById('change-password-password-confirm').classList.add('field-error')
        }
        if(password_confirm !== password){
            flag = false
            document.getElementById('change-password-password-confirm').classList.add('field-error')
            document.getElementById('change-password-password').classList.add('field-error')
        }
        if(new_password_confirm !== new_password){
            flag = false
            document.getElementById('change-password-new-password-confirm').classList.add('field-error')
            document.getElementById('change-password-new-password').classList.add('field-error')
        }
        return flag
    }
    showPasswordCheckboxChange(){
        if(document.getElementById('show-password-checkbox').checked){
            this.setState({passwordFieldType: 'text'})
        }else{
            this.setState({passwordFieldType: 'password'})
        }
    }
    validatePasswordMatch(){
        setTimeout(() =>{
            if(document.getElementById('change-password-password').value == document.getElementById('change-password-password-confirm').value){
                document.getElementById('change-password-password').classList.remove('field-error')
                document.getElementById('change-password-password-confirm').classList.remove('field-error')
            }else{
                document.getElementById('change-password-password').classList.add('field-error')
                document.getElementById('change-password-password-confirm').classList.add('field-error')
            }
        },25)  
    }
    validateNewPasswordMatch(){
        setTimeout(() =>{
            if(document.getElementById('change-password-new-password').value == document.getElementById('change-password-new-password-confirm').value){
                document.getElementById('change-password-new-password').classList.remove('field-error')
                document.getElementById('change-password-new-password-confirm').classList.remove('field-error')
            }else{
                document.getElementById('change-password-new-password').classList.add('field-error')
                document.getElementById('change-password-new-password-confirm').classList.add('field-error')
            }
        },25)  
    }
    render(){
        return(
            <div className="change-password-form-container">
                <h2>Change Password</h2>
                {
                    this.state.responseStatus !== 200 &&
                    <span>
                        <span>
                            <span className="login-form-span">
                                <label>New Password:</label>
                                <input className="form-control login-identifier" id="change-password-new-password" type={this.state.passwordFieldType} onChange={this.validateNewPasswordMatch}></input>
                            </span>
                            <span className="login-form-span">
                                <label>New Password Confirm:</label>
                                <input className="form-control login-identifier" id="change-password-new-password-confirm" type={this.state.passwordFieldType} onChange={this.validateNewPasswordMatch}></input>
                            </span>
                        </span>
                        <span className="login-form-span">
                            <label>Password:</label>
                            <input className="form-control login-identifier" id="change-password-password" type={this.state.passwordFieldType} onChange={this.validatePasswordMatch}></input>
                        </span>
                        <span className="login-form-span">
                            <label>Password confirm:</label>
                            <input className="form-control login-identifier" id="change-password-password-confirm" type={this.state.passwordFieldType} onChange={this.validatePasswordMatch}></input>
                        </span>
                        <span className="show-password-span">
                            <label>Show Passwords:</label>
                            <input className="form-control" type="checkbox" id="show-password-checkbox" onChange={this.showPasswordCheckboxChange}></input>
                        </span>
                        <ReCaptchaV2 id="changePasswordCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleChangePasswordCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />
                        {
                            this.state.requestUnderway == "no" &&
                            <button id="change-password-button" className="submit-button" onClick={this.changePasswordSubmit}>Change Password</button>
                        }
                        {
                            this.state.requestUnderway == "yes" && 
                            <div className="change-email-loading-animation-container">
                                <LoadingAnimation />
                            </div>
                        }
                        
                    </span>
                }
                {
                    this.state.responseStatus == 200 &&
                    <span className="good-to-go">
                        <h3><i className="fa fa-check"></i> You're good to go.</h3>
                        <p>Next time you sign in, use your new password.</p>
                    </span>
                }
            </div>
        )
    }
}