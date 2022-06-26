import React from 'react';

export default class EditPhoneForm extends React.Component{
    constructor(props){
        super(props)
        this.state={}
        this.setUnconfirmedPhone = this.setUnconfirmedPhone.bind(this)
        this.verifyForm = this.verifyForm.bind(this)
    }
    componentDidMount(){}
    componentDidUpdate(prevProps, prevState){}
    setUnconfirmedPhone(){
        const url = 'users/set_unconfirmed_phone'
        var curr_phone = document.getElementById('change-phone-current-phone').value || ''
        var new_phone = document.getElementById('change-phone-new-phone').value || ''
        var new_phone_confirm = document.getElementById('change-phone-new-phone-confirm').value || ''
        const pword = document.getElementById('change-phone-password').value || ''
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var verified = this.verifyForm(curr_phone, new_phone, new_phone_confirm, pword)
        var access = this.props.accessToken
        if(!verified)
            return;
            const body = JSON.stringify({
                phone: curr_phone,
                new_phone: new_phone,
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
                if(json.status == 200)
                    this.props.setUnconfirmedPhoneStateValue(new_phone)
            })
            .catch((e)=> {

            })
    }
    verifyForm(curr_phone, new_phone, new_phone_confirm, pword){
        var flag = true;
        if(curr_phone == ''){
            flag = false
            document.getElementById('change-phone-current-phone').classList.add('field-error')
        }
        if(new_phone == ''){
            flag = false
            document.getElementById('change-phone-new-phone').classList.add('field-error')
        }
        if(new_phone_confirm == ''){
            flag = false
            document.getElementById('change-phone-new-phone-confirm').classList.add('field-error')
        }
        if(pword == ''){
            flag = false
            document.getElementById('change-phone-password').classList.add('field-error')
        }
        if(new_phone !== new_phone_confirm){
            flag = false
            document.getElementById('change-phone-new-phone').classList.add('field-error')
            document.getElementById('change-phone-new-phone-confirm').classList.add('field-error')
        }
        return flag;
    }
    render(){
        return(
            <div>
                <h2>Change Phone</h2>
                 <span className="login-form-span">
                    <label>Current phone:</label>
                    <input className="form-control login-identifier" disabled id="change-phone-current-phone" placeholder={this.props.phone} value={this.props.phone} ></input>
                </span>
                <span>
                    <span className="login-form-span">
                        <label>New Phone:</label>
                        <input className="form-control login-identifier" id="change-phone-new-phone"></input>
                    </span>
                    <span className="login-form-span">
                        <label>New Phone Confirm:</label>
                        <input className="form-control login-identifier" id="change-phone-new-phone-confirm"></input>
                    </span>
                </span>
                <span className="login-form-span">
                    <label>Password:</label>
                    <input className="form-control login-identifier" id="change-phone-password" type="password"></input>
                </span>
                <button id="change-phone-button" onClick={this.setUnconfirmedPhone}>Change Phone</button>
            </div>
        )
    }
}