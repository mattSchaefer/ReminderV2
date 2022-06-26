import React from 'react'
import { Link } from 'react-router-dom'
require('isomorphic-fetch')
export default class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            formError: 'no',
            view: 'login'
        }
        this.login = this.login.bind(this)
    }
    componentDidMount(){
        
    }
    componentDidUpdate(prevProps, prevState){

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
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var body
        var url = '/login'
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
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
           
            if(json.status == 200){
                this.props.setUser(json.id, json.phone, json.email, json.timezone, json.carrier, json.token.token, json.unconfirmed_email, json.unconfirmed_phone)
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
    render(){
        return(
        <div className="login-container">
            <div className="login-form-container">
                <span className="login-form-span">
                    <h1>Log In</h1>
                </span>
                <span className="login-form-span">
                    <label>Phone or Email:</label>
                    <input className="form-control login-identifier" id="login-identifier"></input>
                </span>
                <span className="login-form-span">
                    <label>Password:</label>
                    <input className="form-control" type="password" id="login-password"></input>
                </span>
                <p>New here? <Link to="#" tabIndex="0"  onClick={this.props.toggleCreate}>Create an account</Link></p>
                <span className="forgot-reset-password-container">
                    <Link to="#" tabIndex="0" className="forgot-password-button" onClick={this.props.toggleForgotPassword}>Forgot password</Link>
                    <Link to="#" tabIndex="0" className="reset-password-button" onClick={this.props.toggleResetPassword}>Reset password</Link>
                </span>
                <button className="login-button" id="login-button" onClick={this.login}>Log-in</button>
            </div>
        </div>
    )}
}