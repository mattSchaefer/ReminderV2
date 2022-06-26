import React from 'react';

export default class ChangePasswordForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            responseStatus: 999
        }
        this.verifyForm = this.verifyForm.bind(this)
        this.changePasswordSubmit = this.changePasswordSubmit.bind(this)
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
        if(!verified)
            return;
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
            'Authorization': 'bearer ' + access
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
            this.setState({responseStatus: json.status})
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
                                <input className="form-control login-identifier" id="change-password-new-password"></input>
                            </span>
                            <span className="login-form-span">
                                <label>New Password Confirm:</label>
                                <input className="form-control login-identifier" id="change-password-new-password-confirm"></input>
                            </span>
                        </span>
                        <span className="login-form-span">
                            <label>Password:</label>
                            <input className="form-control login-identifier" id="change-password-password" type="password"></input>
                        </span>
                        <span className="login-form-span">
                            <label>Password confirm:</label>
                            <input className="form-control login-identifier" id="change-password-password-confirm"></input>
                        </span>
                        <button id="change-password-button" onClick={this.changePasswordSubmit}>Change Password</button>
                    </span>
                }
                {
                    this.state.responseStatus == 200 &&
                    <span className="good-to-go">
                        <h3>You're good to go.</h3>
                        <p>Next time you sign in, use your new password.</p>
                    </span>
                }
            </div>
        )
    }
}