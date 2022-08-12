import React from 'react'
import { Link } from 'react-router-dom'
import { Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import LoadingAnimation from '../components/LoadingAnimation'
import ReCaptchaV2 from 'react-google-recaptcha';
require('isomorphic-fetch')
export default class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            formError: 'no',
            view: 'login',
            requestUnderway: 'no',
            passwordFieldType: 'password'
        }
        this.login = this.login.bind(this)
        this.showPasswordCheckboxChange = this.showPasswordCheckboxChange.bind(this)
        //this.handleLoginCaptchaChange = this.handleLoginCaptchaChange.bind(this)
        this.handleCaptchaExpire = this.handleCaptchaExpire.bind(this)
    }
    componentDidMount(){
        
    }
    componentDidUpdate(prevProps, prevState){
        if(this.state.formError == "yes"){
            document.getElementById('login-identifier').classList.add('field-error')
            document.getElementById('login-password').classList.add('field-error')
        }
    }
    login(){
        var identifier = document.getElementById('login-identifier').value
        var password = document.getElementById('login-password').value
        if(!identifier || !password){
            if(!identifier){
                document.getElementById('login-identifier').classList.add('field-error')
            }
            if(!password){
                document.getElementById('login-password').classList.add('field-error')
            }
            return false;
        }
        this.setState({requestUnderway: 'yes'})
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var body
        var url = '/login'
        var captcha_token = this.props.loginCaptchaToken
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Captcha-Token': captcha_token
        }
        if(identifier.toString().indexOf('@')>-1){
            body = JSON.stringify({email: identifier, password: password})
        }else{
            var stripped = this.stripPhoneNumber(identifier)
            body = JSON.stringify({phone: stripped, password: password})
        }
        var options = {
            method: "POST",
            headers: headers,
            body: body
        }
        fetch(url,options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            this.setState({requestUnderway: 'no'})
            if(json.status == 200){
                this.props.setUser(json.id, json.phone, json.email, json.timezone, json.carrier, json.token.token, json.unconfirmed_email, json.unconfirmed_phone, json.activated)
            }else{
                this.setState({formError: 'yes'})
            }
        })
        .catch((e) => {
            this.setState({formError: 'yes'})
        })
    }
    stripPhoneNumber(number){ 
        return number.replace(/\D/g,'');
    }
    showPasswordCheckboxChange(){
        if(document.getElementById('show-password-checkbox').checked){
            this.setState({passwordFieldType: 'text'})
        }else{
            this.setState({passwordFieldType: 'password'})
        }
    }
    
    handleCaptchaExpire(){
       
    }
    render(){
        return(
        <div className="login-container">
            
            <div className="login-form-container faded" id="login-form-container">
                <span className="login-form-span login-header-span">
                    <h1 className="login-header">Log In</h1>
                </span>
                <p className="signup-container">New here? <button to="#" tabIndex="0"  onClick={this.props.toggleCreate} className="signup-link">Sign Up!</button></p>
                <span className="login-form-span">
                    <label>Phone or Email:</label>
                    <input className="form-control login-identifier" id="login-identifier"></input>
                </span>
                <span className="login-form-span">
                    <label>Password:</label>
                    <input className="form-control" type={this.state.passwordFieldType} id="login-password"></input>
                </span>
                <span className="show-password-span">
                    <label>Show Password:</label>
                    <input className="form-control" type="checkbox" id="show-password-checkbox" onChange={this.showPasswordCheckboxChange}></input>
                </span>
                {
                    this.state.requestUnderway == "no" &&
                    <ReCaptchaV2 id="loginSignupCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleLoginCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />
                }
                <span className="forgot-reset-password-container">
                    <button to="#" tabIndex="0" className="forgot-password-button" onClick={this.props.toggleForgotPassword}>Forgot password</button>
                    <button to="#" tabIndex="0" className="reset-password-button" onClick={this.props.toggleResetPassword}>Reset password</button>
                </span>
                {
                    this.state.requestUnderway == "no" &&
                    <button className="login-button" id="login-button" onClick={this.login}>Log-in</button>
                }
                {
                    this.state.requestUnderway == "yes" &&
                    <LoadingAnimation />
                }
                
            </div>
        </div>
    )}
}