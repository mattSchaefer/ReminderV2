import React from 'react';

export default class EditEmailForm extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
        this.setUnconfirmedEmail = this.setUnconfirmedEmail.bind(this)
        this.verifyForm = this.verifyForm.bind(this)
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
        if(!verified)
            return;
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
            this.props.setUnconfirmedEmailStateValue(new_email)
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
                        <input className="form-control login-identifier" id="change-email-new-email"></input>
                    </span>
                    <span className="login-form-span">
                        <label>New Email Confirm:</label>
                        <input className="form-control login-identifier" id="change-email-new-email-confirm"></input>
                    </span>
                </span>
                <span className="login-form-span">
                    <label>Password:</label>
                    <input className="form-control login-identifier" id="change-email-password" type="password"></input>
                </span>
                <button id="change-email-button" onClick={this.setUnconfirmedEmail}>Change Email</button>
            </div>
        )
    }
}