import React from 'react'
require('isomorphic-fetch')

export default class ForgotPassword extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
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
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
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
            if(json.status == 200){
                this.props.toggleResetPassword()
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
                <span className="login-form-span forgot-password-submit-button-span">
                    <button className="form-control circle" id="forgot-password-submit" onClick={this.forgotPasswordSubmit}>submit</button>
                </span>
                </div>
            </div>
        )
    }
}