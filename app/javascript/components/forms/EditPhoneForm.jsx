import React from 'react';
import ReCaptchaV2 from 'react-google-recaptcha'
import LoadingAnimation from '../LoadingAnimation'
export default class EditPhoneForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            passwordFieldType: 'password',
            requestUnderway: 'no'
        }
        this.setUnconfirmedPhone = this.setUnconfirmedPhone.bind(this)
        this.verifyForm = this.verifyForm.bind(this)
        this.showPasswordCheckboxChange = this.showPasswordCheckboxChange.bind(this)
        this.validatePhoneMatch = this.validatePhoneMatch.bind(this)
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
        var captcha_token = this.props.setUnconfirmedPhoneCaptchaToken
        if(!verified)
            return;
        this.setState({requestUnderway: 'yes'})
        const body = JSON.stringify({
            phone: curr_phone,
            new_phone: new_phone,
            password: pword
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
            this.setState({requestUnderway: 'no'})
            console.log(json)
            if(json.status == 200){
                this.props.setUnconfirmedPhoneStateValue(new_phone)
                // document.getElementById('phone-span').classList.add('green-underline')
                // document.getElementById('edit-phone-toggle-button-icon').classList.remove('fa-pencil')
                // document.getElementById('edit-phone-toggle-button-icon').classList.add('fa-check')
            }
        })
        .catch((e)=> {
            this.setState({requestUnderway: 'no'})
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
    showPasswordCheckboxChange(){
        if(document.getElementById('show-password-checkbox').checked){
            this.setState({passwordFieldType: 'text'})
        }else{
            this.setState({passwordFieldType: 'password'})
        }
    }
    validatePhoneMatch(){
        setTimeout(() =>{
            if(document.getElementById('change-phone-new-phone').value == document.getElementById('change-phone-new-phone-confirm').value){
                document.getElementById('change-phone-new-phone').classList.remove('field-error')
                document.getElementById('change-phone-new-phone-confirm').classList.remove('field-error')
            }else{
                document.getElementById('change-phone-new-phone').classList.add('field-error')
                document.getElementById('change-phone-new-phone-confirm').classList.add('field-error')
            }
        },25)  
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
                        <input className="form-control login-identifier" id="change-phone-new-phone" onChange={this.validatePhoneMatch}></input>
                    </span>
                    <span className="login-form-span">
                        <label>New Phone Confirm:</label>
                        <input className="form-control login-identifier" id="change-phone-new-phone-confirm" onChange={this.validatePhoneMatch}></input>
                    </span>
                </span>
                <span className="login-form-span">
                    <label>Password:</label>
                    <input className="form-control login-identifier" id="change-phone-password" type={this.state.passwordFieldType}></input>
                </span>
                <span className="show-password-span">
                    <label>Show Passwords:</label>
                    <input className="form-control" type="checkbox" id="show-password-checkbox" onChange={this.showPasswordCheckboxChange}></input>
                </span>
                {
                    this.state.requestUnderway == "no" &&
                    <ReCaptchaV2 id="setUnconfirmedPhoneCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleSetUnconfirmedPhoneCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />
                }
                {
                    this.state.requestUnderway == "yes" &&
                    <span className="set-unconfirmed-phone-loading-animation-outer">
                        <LoadingAnimation />
                    </span>
                }
                {
                    this.state.requestUnderway == "no" &&
                    <button className="submit-button" id="change-phone-button" onClick={this.setUnconfirmedPhone}>Change Phone</button>
                }
            </div>
        )
    }
}