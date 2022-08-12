import React from 'react'
import LoadingAnimation from '../LoadingAnimation'
import ReCaptchaV2 from 'react-google-recaptcha'
require('isomorphic-fetch')

export default class ForgotPassword extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            requestUnderway: 'no'
        }
        this.forgotPasswordSubmit = this.forgotPasswordSubmit.bind(this)
    }
    componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState){

    }
    forgotPasswordSubmit(){
        const url = "users/forgot_password"
        const email = document.getElementById('forgot-password-email').value || ''
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        const body = JSON.stringify({email: email})
        var captcha_token = this.props.forgotPasswordCaptchaToken
        this.setState({requestUnderway: 'yes'})
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
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
                this.props.toggleResetPassword()
            }else{
                document.getElementById('forgot-password-email').classList.add('field-error')
            }
        })
        .catch((e) => {
            console.log(e)
        })
    }
    render(){
        return(
            <div className="forgot-container">
                <div className="forgot-form-container">
                <span className="login-form-span">
                    <h1>Forgot Password</h1>
                </span>
                <span className="login-form-span forgot-password-paragraph-container">
                    <p className="forgot-password-paragraph">Enter the email address for your account and we'll send you instructions to reset your password.</p>
                </span>
                <span className="login-form-span">
                    <label>Email:</label>
                    <input id="forgot-password-email" className="form-control"></input>
                </span>
                {
                    this.state.requestUnderway == "no" &&
                    <ReCaptchaV2 id="setForgotPasswordCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleForgotPasswordCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />
                }
                <span className="login-form-span forgot-password-submit-button-span">
                    {
                        this.state.requestUnderway == "no" &&
                        <button className="form-control submit-button" id="forgot-password-submit" onClick={this.forgotPasswordSubmit}>submit</button>
                    }
                    {
                        this.state.requestUnderway == "yes" &&
                        <LoadingAnimation />
                    }
                    <button className="go-back-button" onClick={() => this.props.goBackToLogin()}><i className="fa fa-arrow-left"></i></button>
                </span>
                </div>
            </div>
        )
    }
}