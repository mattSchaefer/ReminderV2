import React from 'react'
import EditReminderScheduleForm from '../components/EditReminderScheduleForm';
import EditEmailForm from '../components/forms/EditEmailForm';
import EditPhoneForm from '../components/forms/EditPhoneForm';
import EditTimezoneForm from '../components/forms/EditTimezoneForm';
import ChangePasswordForm from '../components/forms/ChangePasswordForm';
import EditCarrierForm from '../components/forms/EditCarrierForm';
import LoadingAnimation from '../components/LoadingAnimation';
import ReCaptchaV2 from 'react-google-recaptcha'
require('isomorphic-fetch')
import * as Scroll from 'react-scroll';
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

export default class Account extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            avaliableReminders: [],
            subscribedReminders: [],
            prettySubscriptions: [],
            showAccountInfo: 'no',
            editingReminderScheduleFor: '',
            editingAccount: 'no',
            requestUnderway: 'no',
            confirmEmailRequestUnderway: 'no',
            confirmPhoneRequestUnderway: 'no',
            resendingEmailCode: 'no',
            resendingPhoneCode: 'no',
            resendingActivationCode: 'no',
            deleteAccountDisplay: 'no'
        }
        this.getReminderSubscriptions = this.getReminderSubscriptions.bind(this)
        this.getAvaliableReminders = this.getAvaliableReminders.bind(this)
        this.toggleAccountInfoDisplay = this.toggleAccountInfoDisplay.bind(this)
        this.confirmUnconfirmedEmail = this.confirmUnconfirmedEmail.bind(this)
        this.confirmUnconfirmedPhone = this.confirmUnconfirmedPhone.bind(this)
        this.deleteAccount = this.deleteAccount.bind(this)
        this.activateAccount = this.activateAccount.bind(this)
        this.resendEmailCode = this.resendEmailCode.bind(this)
        this.resendPhoneCode = this.resendPhoneCode.bind(this)
        this.resendAccountActivationCode = this.resendAccountActivationCode.bind(this)
        this.toggleDeleteAccountDisplay = this.toggleDeleteAccountDisplay.bind(this)
        //this.toggleEditingAccount = this.toggleEditingAccount.bind(this)
    }
    componentDidMount(){
        this.getAvaliableReminders()
    }
    componentDidUpdate(prevProps, prevState){  
        // if(prevState.subscribedReminders !== this.state.subscribedReminders){
        //     for(var i = 0; i < this.state.subscribedReminders.length; i++){
        //         document.getElementById(this.state.subscribedReminders[i].reminder_type + '-checkbox').checked = true;
        //     }
        // }
        if(prevState.avaliableReminders !== this.state.avaliableReminders){
            this.getReminderSubscriptions()
        }
        if(prevProps.editingReminderScheduleFor.length > 0 && this.props.editingReminderScheduleFor.length == 0){
            this.getReminderSubscriptions()
        }
        if(this.props.unconfirmedPhone && this.props.unconfirmedPhone.length > 0){
            setTimeout(() => {document.getElementById('phone-span').classList.add('yellow-underline')},50)
            //document.getElementById('phone-span').classList.add('yellow-underline')
        }else{
            //document.getElementById('phone-span').classList.remove('yellow-underline')
        }
        if(this.props.unconfirmedEmail && this.props.unconfirmedEmail.length > 0){
           setTimeout(() => {document.getElementById('email-span').classList.add('yellow-underline')},50)
        }else{
            //document.getElementById('email').classList.remove('yellow-underline')
        }
    }
    toggleAccountInfoDisplay(){
        this.state.showAccountInfo == "yes" ? this.setState({showAccountInfo: 'no'}) : this.setState({showAccountInfo: 'yes'})
    }
    toggleDeleteAccountDisplay(){
        this.state.deleteAccountDisplay == "no" ? this.setState({deleteAccountDisplay: 'yes'}) : this.setState({deleteAccountDisplay: 'no'})
    }
    getReminderSubscriptions(){
        var url = "/get_user_subscriptions"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var bearer = this.props.accessToken.toString()
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer
        }
        var body = JSON.stringify({
            user_id: this.props.userId
        })
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
                var pretty_subscriptions = [];
                for(var i = 0; i < json.subscriptions.length; i++){
                    var curr_sub = json.subscriptions[i]
                    if(curr_sub.time){
                        if(pretty_subscriptions.filter((sub) => {return sub.sub_type == curr_sub.reminder_type}).length == 0){
                            pretty_subscriptions.push({
                                sub_type: curr_sub.reminder_type,
                                times: curr_sub.time,
                                max_per_day: curr_sub.max_per_day
                            })
                        }else{
                            var sub_to_edit = pretty_subscriptions.filter((sub) => {return sub.sub_type == curr_sub.reminder_type})
                            var the_rest = pretty_subscriptions.filter((sub) => {return sub.sub_type !== curr_sub.reminder_type})
                            sub_to_edit[0].times += ", " + curr_sub.time
                            pretty_subscriptions = sub_to_edit.concat(the_rest)
                        }
                    }   
                }
                console.log('pretty subscriptions')
                console.log(pretty_subscriptions)
                this.setState({
                    subscribedReminders: json.subscriptions,
                    prettySubscriptions: pretty_subscriptions
                })
            }
        })
        .catch((e) => {

        })
    }
    // toggleEditingAccount(){

    // }
    
    getAvaliableReminders(){
        var url = '/reminders'
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var bearer = this.props.accessToken.toString()

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer
        }
        var options = {
            method: "GET",
            headers: headers
        }
        fetch(url,options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            this.setState({avaliableReminders: json.reminders})
        })
        .catch((e) => {

        })
    }
    confirmUnconfirmedEmail(){
        var url = "users/confirm_unconfirmed_email"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var token = document.getElementById('confirm-email-code').value
        var unconfirmed_email = this.props.unconfirmedEmail.toString()
        var email = this.props.email.toString()
        var bearer = this.props.accessToken.toString()
        var captcha_token = this.props.confirmUnconfirmedEmailCaptchaToken
        console.log(unconfirmed_email)
        console.log(email)
        console.log(bearer)
        this.setState({confirmEmailRequestUnderway: 'yes'})
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer,
            'Captcha-Token': captcha_token
        }
        var body = JSON.stringify({
            email: email,
            new_email: unconfirmed_email,
            token: token
        })
        var options = {
            method: "POST",
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            this.setState({confirmEmailRequestUnderway: 'no'})
            if(json.status == 200){
                this.props.setUnconfirmedEmailStateValue('')
                this.setState({showAccountInfo: 'yes'})
                document.getElementById('email-span').classList.remove('yellow-underline')
                document.getElementById('email-span').classList.add('green-underline')
                document.getElementById('edit-email-toggle-button-icon').classList.remove('fa-pencil')
                document.getElementById('edit-email-toggle-button-icon').classList.add('fa-check')
            }
        })
        .catch((e) => {console.log(e)})
    }
    confirmUnconfirmedPhone(){
        var url = "users/confirm_unconfirmed_phone"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var token = document.getElementById('confirm-phone-code').value
        var unconfirmed_phone = this.props.unconfirmedPhone.toString()
        var phone = this.props.phone.toString()
        var bearer = this.props.accessToken.toString()
        var captcha_token = this.props.confirmUnconfirmedPhoneCaptchaToken
        console.log(unconfirmed_phone)
        console.log(phone)
        console.log(bearer)
        this.setState({confirmPhoneRequestUnderway: 'yes'})
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer,
            'Captcha-Token': captcha_token
        }
        var body = JSON.stringify({
            phone: phone,
            new_phone: unconfirmed_phone,
            token: token
        })
        var options = {
            method: "POST",
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            this.setState({confirmPhoneRequestUnderway: 'no'})
            if(json.status == 200){
                this.props.setUnconfirmedPhoneStateValue('')
                document.getElementById('phone-span').classList.add('green-underline')
                document.getElementById('phone-span').classList.remove('yellow-underline')
                document.getElementById('edit-phone-toggle-button-icon').classList.remove('fa-pencil')
                document.getElementById('edit-phone-toggle-button-icon').classList.add('fa-check')
            }
        })
        .catch((e) => {console.log(e)})
    }
    deleteAccount(){
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var bearer = this.props.accessToken.toString()
        var email = this.props.email.toString()
        var url = '/users'
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer
        }
        var body = JSON.stringify({
            email: email
        })
        var options = {
            method: "DELETE",
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            if(json.status == 200){
                this.props.goBackToLogin()
            }
        })
        .catch((e) => {
            console.log(e)
        })
    }
    activateAccount(){
        const url = "/users/activate"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var activation_token = document.getElementById('account-activation-token').value
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
        }
        var body = JSON.stringify({
            activation_token: activation_token
        })
        var options = {
            method: "POST",
            headers: headers,
            body: body
        }
        this.setState({requestUnderway: 'yes'})
        fetch(url,options)
        .then(response => response.json())
        .then((json) => {
            console.log(json)
            this.setState({requestUnderway: 'no'})
            if(json.status == 200){
                this.props.setActivated(true)
                this.props.setUser(json.id, json.phone, json.email, json.timezone, json.carrier, json.token.token, json.unconfirmed_email, json.unconfirmed_phone, json.activated)

            }
        })
        .catch((e)=>{
            this.setState({requestUnderway: 'no'})
        })
    }
    resendEmailCode(){
        const url = "/users/resend_code"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var bearer = this.props.accessToken.toString()
        var email = this.props.email.toString()
        this.setState({resendingEmailCode: 'yes'})
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer
        }
        var body = JSON.stringify({
            email: email,
            resend_code_type: 'email'
        })
        var options = {
            method: "POST",
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then(response => response.json())
        .then((json) => {
            this.setState({resendingEmailCode: 'no'})
            console.log(json)
        })
        .catch((e) => {
            console.log(e)
        })
    }
    resendPhoneCode(){
        const url = "/users/resend_code"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var bearer = this.props.accessToken.toString()
        var phone = this.props.phone.toString()
        this.setState({resendingPhoneCode: 'yes'})
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer
        }
        var body = JSON.stringify({
            phone: phone,
            resend_code_type: 'phone'
        })
        var options = {
            method: "POST",
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then(response => response.json())
        .then((json) => {
            this.setState({resendingPhoneCode: 'no'})
            console.log(json)
        })
        .catch((e) => {
            console.log(e)
        })
    }
    logout(){
        this.props.goBackToLogin
        
        setTimeout(() => {
            scroll.scrollMore(-100)
        },150)
    }
    resendAccountActivationCode(){
        const url = "/users/resend_code"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var bearer = this.props.accessToken.toString()
        var email = this.props.email.toString()
        this.setState({resendingActivationCode: 'yes'})
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer
        }
        var body = JSON.stringify({
            email: email,
            resend_code_type: 'account_activation'
        })
        var options = {
            method: "POST",
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then(response => response.json())
        .then((json) => {
            this.setState({resendingActivationCode: 'no'})
            console.log(json)
        })
        .catch((e) => {
            console.log(e)
        })
    }
    render(){
        const reminder_eles = this.state.avaliableReminders.map((reminder_obj) => 
            <span className="reminder-ele">
                <span className="checkbox-and-label">
                    {/* <input type="checkbox" className="reminder-checkbox" id={reminder_obj.reminder_type.toString().replaceAll(' ', '-') + '-checkbox'}></input> */}
                </span>
                <span className="reminder-type-label-container"><h3 id={reminder_obj.reminder_type.toString() + "-edit-form-header"}>{reminder_obj.reminder_type}</h3></span>
                <span className="schedule-container-outer">
                    {
                        this.state.prettySubscriptions.filter((sub)=> {return sub.sub_type.toString() == reminder_obj.reminder_type.toString()}).length > 0 && 
                        <span className="schedule-container-inner">
                            {
                                this.props.editingReminderScheduleFor !== reminder_obj.reminder_type.toString() && this.state.prettySubscriptions.filter((sub)=> {
                                    return sub.sub_type.toString() == reminder_obj.reminder_type.toString()
                                })[0].times.split(',').map((time) => 
                                    <span className="circle schedule-element">
                                        {time}   
                                    </span>
                                )
                            }
                            {
                                this.props.editingReminderScheduleFor !== reminder_obj.reminder_type.toString() &&
                                <button className="circle edit-reminder-schedule-button" id={reminder_obj.reminder_type.toString() + '-toggle-edit-button-outer'} onClick={() => this.props.toggleEditReminderScheduleFor(reminder_obj.reminder_type.toString())} tabindex="0">
                                    <i className="fa fa-pencil" id={reminder_obj.reminder_type.toString() + '-toggle-edit-button-icon'} />
                                
                                </button>
                            }
                            {
                                this.props.editingReminderScheduleFor == reminder_obj.reminder_type.toString() &&
                                <EditReminderScheduleForm editingFor={this.state.prettySubscriptions.filter((sub)=> {
                                    return sub.sub_type.toString() == reminder_obj.reminder_type.toString()
                                })} toggleSetReminderTimeValueUI={this.props.toggleSetReminderTimeValueUI} changeUserSubscriptionFor={this.props.changeUserSubscriptionFor} getReminderSubscriptions={this.getReminderSubscriptions} toggleEditReminderScheduleFor={this.props.toggleEditReminderScheduleFor} accessToken={this.props.accessToken} />
                            }
                        </span>
                    }
                    {
                        this.state.prettySubscriptions.filter((sub)=> {return sub.sub_type.toString() == reminder_obj.reminder_type.toString()}).length == 0 &&
                        <button className="edit-reminder-schedule-button" onClick={() => this.props.toggleEditReminderScheduleFor(reminder_obj.reminder_type.toString())} tabindex="0">
                            {
                                this.props.editingReminderScheduleFor !== reminder_obj.reminder_type.toString() &&
                                <span className="circle" id={reminder_obj.reminder_type.toString() + '-toggle-edit-button-outer'}>
                                    <i className="fa fa-plus" id={reminder_obj.reminder_type.toString() + '-toggle-edit-button-icon'}/>
                                </span>
                            }
                            {
                                this.props.editingReminderScheduleFor == reminder_obj.reminder_type.toString() &&
                                <EditReminderScheduleForm editingFor={[{new_subscription: reminder_obj}]} toggleSetReminderTimeValueUI={this.props.toggleSetReminderTimeValueUI} changeUserSubscriptionFor={this.props.changeUserSubscriptionFor} getReminderSubscriptions={this.getReminderSubscriptions} toggleEditReminderScheduleFor={this.props.toggleEditReminderScheduleFor} accessToken={this.props.accessToken}  />
                            }
                        </button>
                    }
                </span>
            </span>
        )
        return(
            <div className="account-container">
                <span className="account-inner-container">
                    {
                        this.props.activated == true &&
                        <div className="subscriptions-container">
                            <span className="header-logout-span">
                                <h2 className="subscription-header">Your Subscriptions</h2>
                                <button className="logout-button" onClick={this.props.goBackToLogin} tabindex="0">[logout]</button>
                            </span>
                            <p className="subscription-paragraph">Fill out the form below to subscribe to reminders.  Any change in schedule may not take place until the following day. Standard messaging rates apply.  This is a free service but feel free to donate to help keep the lights on [<i  onClick={() => scroll.scrollToBottom()} className="fa fa-coffee donate-para-icon"  />].</p>
                            
                            <span className="flex-col avaliable-reminder-list">
                                {reminder_eles}
                            </span>
                        </div>
                    }
                    <hr />
                    <div className="account-info-container">
                        <span className="account-info-header">
                            <h1 className="header-flex">
                                Account Info
                                {(this.props.unconfirmedEmail && this.props.unconfirmedEmail.length > 0 || this.props.unconfirmedPhone && this.props.unconfirmedPhone.length > 0 || this.props.activated !== true) && <span className="circle exclaim-warning">!</span>}
                            </h1>
                            <span>
                                <button className="toggle-show-account-button" onClick={this.toggleAccountInfoDisplay} tabindex="0">[{this.state.showAccountInfo == 'no' || this.props.activated !== true ? 'show' : 'hide'}]</button>
                                
                            </span>
                        </span>
                        {
                            this.props.activated !== true &&
                            <div className="activate-account-account-container" id="">
                                <span className="activate-account-account" id="activate-account-account">
                                    <h1>Activate Account</h1>
                                    <p>Activate your account in order to sign up for reminders.</p>
                                </span>
                                <span className="activate-account-form-span">
                                    <label>Activation Code:</label>
                                    <input className="form-control" id="account-activation-token" />
                                </span>
                                {
                                    this.state.requestUnderway == "no" &&
                                    <button className="submit-button activate-account-button" id="" onMouseEnter={this.loginSignupMouseEnter} onMouseLeave={this.loginSignupMouseLeave} onClick={this.activateAccount} >Activate Account</button>
                                }
                                {
                                    this.state.requestUnderway == "yes" || this.state.resendingActivationCode == "yes" &&
                                    <LoadingAnimation />
                                }
                                {
                                    this.state.resendingActivationCode == "no" &&
                                    <button tabindex="0" className="account-activation-resend-code transparent-bg" onClick={this.resendAccountActivationCode}>[resend code]</button>
                                }
                            </div>
                        }
                        {
                            this.props.unconfirmedPhone && this.props.unconfirmedPhone.length > 0 && 
                            <span className="confirm-unconfirmed-phone-container">
                                <h3>Confirm your new phone number</h3>
                                <label>Enter the code we sent to your new phone:</label>
                                <input className="form-control" id="confirm-phone-code"></input>
                                <ReCaptchaV2 id="confirmUnconfirmedPhoneCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleConfirmUnconfirmedPhoneCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />

                                {
                                    this.state.confirmPhoneRequestUnderway == "no" &&
                                    <button className="form-control submit-button" id="confirm-phone-submit" onClick={this.confirmUnconfirmedPhone}>Submit</button>
                                }
                                {
                                    this.state.confirmPhoneRequestUnderway == "yes" &&
                                    <LoadingAnimation />
                                }
                                {
                                    this.state.resendingPhoneCode == "no" &&
                                    <span className="confirm-email-resend-code" onClick={this.resendPhoneCode}>[resend code]</span>
                                }
                                {
                                    this.state.resendingPhoneCode == "yes" &&
                                    <LoadingAnimation />
                                }
                            </span>
                        }
                        {
                            this.props.unconfirmedEmail && this.props.unconfirmedEmail.length > 0 && 
                            <span className="confirm-unconfirmed-email-container">
                                <h3>Confirm your new email</h3>
                                <label>Enter the code we sent to your new email address:</label>
                                <input className="form-control" id="confirm-email-code"></input>
                                <ReCaptchaV2 id="confirmUnconfirmedEmailCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleConfirmUnconfirmedEmailCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />
                                {
                                    this.state.confirmEmailRequestUnderway == "no" &&
                                    <button className="form-control submit-button" id="confirm-email-submit" onClick={this.confirmUnconfirmedEmail}>Submit</button>
                                }
                                {
                                    this.state.confirmEmailRequestUnderway == "yes" &&
                                    <LoadingAnimation />
                                }
                                {
                                    this.state.resendingEmailCode == "no" &&
                                    <span className="confirm-email-resend-code" onClick={this.resendEmailCode}>[resend code]</span>
                                }
                                {
                                    this.state.resendingEmailCode == "yes" &&
                                    <LoadingAnimation />
                                }
                            </span>
                        }
                        {
                            this.state.showAccountInfo == 'yes' &&
                            <div className="account-info-attrs">
                                <hr />    
                                <span className="account-info-ele">
                                    <span className="account-info-label-and-attr">
                                        <label>email:</label>
                                        <span id="email-span">{this.props.email}</span>
                                    </span>
                                    {this.props.activated == true && <button tabindex="0" className="transparent-bg" onClick={() => this.props.toggleEditingAccount('email')}><i className={this.props.unconfirmedEmail && this.props.unconfirmedEmail.length > 0 ? 'fa fa-exclamation yellow-underline' : 'fa fa-pencil'} id="edit-email-toggle-button-icon"></i></button>}
                                </span>
                                <span className="account-info-ele">
                                    <span className="account-info-label-and-attr">
                                        <label>phone:</label>
                                        <span id="phone-span">{this.props.phone}</span>
                                    </span>
                                    {this.props.activated == true && <button tabindex="0" className="transparent-bg" onClick={() => this.props.toggleEditingAccount('phone')}><i className={this.props.unconfirmedPhone && this.props.unconfirmedPhone.length > 0 ? 'fa fa-exclamation yellow-underline' : 'fa fa-pencil'} id="edit-phone-toggle-button-icon"></i></button>}
                                </span>
                                <span className="account-info-ele">
                                    <span className="account-info-label-and-attr">
                                        <label>carrier:</label>
                                        <span id="carrier-span">{this.props.carrier}</span>
                                    </span>
                                    {this.props.activated == true && <button tabindex="0" className="transparent-bg" onClick={() => this.props.toggleEditingAccount('carrier')}><i className="fa fa-pencil" id="edit-carrier-toggle-button-icon"></i></button>}
                                </span>
                                <span className="account-info-ele">
                                    <span className="account-info-label-and-attr">
                                        <label>timezone:</label>
                                        <span id="timezone-span">{this.props.timezone}</span>
                                    </span>
                                    {this.props.activated == true && <button tabindex="0" className="transparent-bg" onClick={() => this.props.toggleEditingAccount('timezone')} id="edit-timezone-toggle-button"><i className="fa fa-pencil" id="edit-timezone-toggle-button-icon"></i></button>}
                                </span>
                                <span className="buttons-container">
                                    <span className="account-info-ele change-password-container">
                                        <button className="transparent-bg" tabindex="0" id="change-password-button" onClick={() => this.props.toggleEditingAccount('password')}>[Change Password]</button>
                                    </span>
                                    <span className="account-info-ele delete-account-container">
                                        {
                                            this.state.deleteAccountDisplay == "no" &&
                                            <button tabindex="0" className="transparent-bg" id="delete-account-button" onClick={this.toggleDeleteAccountDisplay}>[Delete Account]</button>
                                        }
                                        {
                                            this.state.deleteAccountDisplay == "yes" && 
                                            <span>
                                                <h3>Are you sure you want to delete your account?</h3>
                                                <span>
                                                    <span><button className="submit-button" onClick={this.deleteAccount}>Yes</button></span>
                                                    <span><button className="submit-button" onClick={this.toggleDeleteAccountDisplay}>No</button></span>
                                                </span>
                                            </span>
                                        }
                                    </span>
                                </span>
                                {
                                    this.props.editingAccountFor == "email" && this.props.unconfirmedEmail == '' &&
                                    <div>
                                        <hr />
                                        <EditEmailForm email={this.props.email} accessToken={this.props.accessToken} setUnconfirmedEmailStateValue={this.props.setUnconfirmedEmailStateValue} setUnconfirmedEmailCaptchaToken={this.props.setUnconfirmedEmailCaptchaToken} handleSetUnconfirmedEmailCaptchaChange={this.props.handleSetUnconfirmedEmailCaptchaChange} />
                                    </div>
                                }
                                {
                                    this.props.editingAccountFor == "phone" && this.props.unconfirmedPhone == '' &&
                                    <div>
                                        <hr />
                                        <EditPhoneForm phone={this.props.phone} accessToken={this.props.accessToken} setUnconfirmedPhoneStateValue={this.props.setUnconfirmedPhoneStateValue} setUnconfirmedPhoneCaptchaToken={this.props.setUnconfirmedPhoneCaptchaToken} handleSetUnconfirmedPhoneCaptchaChange={this.props.handleSetUnconfirmedPhoneCaptchaChange} />
                                    </div>
                                }
                                {
                                    this.props.editingAccountFor == "password" &&
                                    <div className="full-width">
                                        <hr />
                                        <ChangePasswordForm email={this.props.email} phone={this.props.phone} accessToken={this.props.accessToken} handleChangePasswordCaptchaChange={this.props.handleChangePasswordCaptchaChange} changePasswordCaptchaToken={this.props.changePasswordCaptchaToken} />
                                    </div>
                                }
                                {
                                    this.props.editingAccountFor == "carrier" &&
                                    <div>
                                        <hr />
                                        <EditCarrierForm carrier={this.props.carrier} email={this.props.email} accessToken={this.props.accessToken} setCarrier={this.props.setCarrier} />
                                    </div>
                                }
                                {
                                    this.props.editingAccountFor == "timezone" &&
                                    <div>
                                        <hr />
                                        <EditTimezoneForm timezone={this.props.timezone} email={this.props.email} accessToken={this.props.accessToken} setTimezone={this.props.setTimezone} />
                                    </div>
                                }
                            </div>
                        }
                        
                    </div>
                </span>
            </div>
        )
    }
}