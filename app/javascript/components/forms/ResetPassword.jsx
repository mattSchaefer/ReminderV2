import React from 'react'
import { Link } from 'react-router-dom'
import LoadingAnimation from '../LoadingAnimation'
import ReCaptchaV2 from 'react-google-recaptcha'
require('isomorphic-fetch')

export default class ResetPassword extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            resetSuccessful: 'no',
            requestUnderway: 'no',
            passwordFieldType: 'password',
            resendingResetPasswordCode: 'no'
        }
        this.resetPasswordSubmit = this.resetPasswordSubmit.bind(this)
        this.verifyForm = this.verifyForm.bind(this)
        this.showPasswordCheckboxChange = this.showPasswordCheckboxChange.bind(this)
        this.validatePasswordMatch = this.validatePasswordMatch.bind(this)
        
    }
    componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState){

    }
    resetPasswordSubmit(){
        const token = document.getElementById('reset-password-token').value || ''
        const new_password = document.getElementById('reset-password-new-password').value || ''
        const new_password_confirm = document.getElementById('reset-password-new-password-confirm').value || ''
        var verified = this.verifyForm(token, new_password, new_password_confirm)
        if(!verified)
            return
        this.setState({requestUnderway: 'yes'})
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var captcha_token = this.props.resetPasswordCaptchaToken
        const url = 'users/reset_password'
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Captcha-Token': captcha_token
        }
        const body = JSON.stringify({
            token: token,
            new_password: new_password
        })
        const options = {
            method: 'POST',
            headers: headers,
            body: body
        }
        fetch(url,options)
        .then((response) => response.json())
        .then((json) => {
            
            console.log(json)
            this.setState({requestUnderway: 'no'})
            if(json.status == 200){
                this.setState({resetSuccessful: 'yes'})
            }
        })
        .catch((e) => {
            this.setState({requestUnderway: 'no'})
            console.log(e)
        })
    }
    verifyForm(token, new_password, new_password_confirm){
        var flag = true
        if(token == ""){
            document.getElementById('reset-password-token').classList.add('field-error')
            flag = false
        }
        if(new_password == ""){
            document.getElementById('reset-password-new-password').classList.add('field-error')
            flag = false
        }
        if(new_password_confirm == ""){
            document.getElementById('reset-password-new-password-confirm').classList.add('field-error')
            flag = false
        }
        if(new_password !== new_password_confirm){
            document.getElementById('reset-password-new-password').classList.add('field-error')
            document.getElementById('reset-password-new-password-confirm').classList.add('field-error')
            flag = false
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
            if(document.getElementById('reset-password-new-password').value == document.getElementById('reset-password-new-password-confirm').value){
                document.getElementById('reset-password-new-password').classList.remove('field-error')
                document.getElementById('reset-password-new-password-confirm').classList.remove('field-error')
            }else{
                document.getElementById('reset-password-new-password').classList.add('field-error')
                document.getElementById('reset-password-new-password-confirm').classList.add('field-error')
            }
        },25)  
    }
    
    render(){
        return(
            <div className="reset-password-container">
                {
                    this.state.resetSuccessful !== 'yes' && 
                    <div className="reset-password-form-container">
                    <span className="login-form-span">
                        <h1>Reset Password</h1>
                    </span>
                    <span className="login-form-span forgot-password-paragraph-container">
                        <p className="forgot-password-paragraph">Follow the instructions we sent to your email to set your new password.  If you need a new code please navigate back to the Forgot Password section.</p>
                    </span>
                    <span className="login-form-span">
                        <label>Token:</label>
                        <input id="reset-password-token" className="form-control"></input>
                    </span>
                    <span className="login-form-span">
                        <label>New Password:</label>
                        <input id="reset-password-new-password" className="form-control" type={this.state.passwordFieldType} onChange={this.validatePasswordMatch}></input>
                    </span>
                    <span className="login-form-span">
                        <label>New Password Confirm:</label>
                        <input id="reset-password-new-password-confirm" className="form-control" type={this.state.passwordFieldType} onChange={this.validatePasswordMatch}></input>
                    </span>
                    <span className="show-password-span">
                        <label>Show Passwords:</label>
                        <input className="form-control" type="checkbox" id="show-password-checkbox" onChange={this.showPasswordCheckboxChange}></input>
                    </span>
                    <ReCaptchaV2 id="setResetPasswordCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleResetPasswordCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />
                    <span className="login-form-span reset-password-submit-button-span">
                        {
                            this.state.requestUnderway == "no" &&
                            <button className="form-control submit-button" id="reset-password-submit" onClick={this.resetPasswordSubmit}>submit</button>
                        }
                        {
                            this.state.requestUnderway == "yes" &&
                            <LoadingAnimation />
                        }
                        {/* {
                            this.state.resendingResetPasswordCode == "no" &&
                            <button tabindex="0" className="reset-password-resend-code transparent-bg" onClick={this.resendResetPasswordCode}>[resend code]</button>
                        } */}
                    </span>
                    <button className="go-back-button" onClick={() => this.props.goBackToLogin()}><i className="fa fa-arrow-left"></i></button>
                </div>
                }
                {
                    this.state.resetSuccessful == 'yes' &&
                    <div className="reset-password-form-container">
                        <h1>Boom!</h1>
                        <p>You're good to go. </p>
                        <Link to="#" tabIndex="0" className="back-to-login" onClick={() => this.props.goBackToLogin()}>Log-in with your new password</Link>
                    </div>
                }
                 
            </div>
        )
    }
}