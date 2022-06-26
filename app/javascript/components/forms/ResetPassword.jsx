import React from 'react'
import { Link } from 'react-router-dom'
require('isomorphic-fetch')

export default class ResetPassword extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            resetSuccessful: 'no'
        }
        this.resetPasswordSubmit = this.resetPasswordSubmit.bind(this)
        this.verifyForm = this.verifyForm.bind(this)
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
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        const url = 'users/reset_password'
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
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
            if(json.status == 200){
                this.setState({resetSuccessful: 'yes'})
            }
        })
        .catch((e) => {
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
                        <p className="forgot-password-paragraph">Follow the instructions we sent to your email to set your new password.</p>
                    </span>
                    <span className="login-form-span">
                        <label>Token:</label>
                        <input id="reset-password-token" className="form-control"></input>
                    </span>
                    <span className="login-form-span">
                        <label>New Password:</label>
                        <input id="reset-password-new-password" className="form-control"></input>
                    </span>
                    <span className="login-form-span">
                        <label>New Password Confirm:</label>
                        <input id="reset-password-new-password-confirm" className="form-control"></input>
                    </span>
                    <span className="login-form-span reset-password-submit-button-span">
                        <button className="form-control circle" id="reset-password-submit" onClick={this.resetPasswordSubmit}>submit</button>
                    </span>
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