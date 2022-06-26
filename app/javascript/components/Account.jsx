import React from 'react'
import EditReminderScheduleForm from '../components/EditReminderScheduleForm';
import EditEmailForm from '../components/forms/EditEmailForm';
import EditPhoneForm from '../components/forms/EditPhoneForm';
import EditTimezoneForm from '../components/forms/EditTimezoneForm';
import ChangePasswordForm from '../components/forms/ChangePasswordForm';
import EditCarrierForm from '../components/forms/EditCarrierForm';
require('isomorphic-fetch')
export default class Account extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            avaliableReminders: [],
            subscribedReminders: [],
            prettySubscriptions: [],
            showAccountInfo: 'no',
            editingReminderScheduleFor: '',
            editingAccount: 'no'
        }
        this.getReminderSubscriptions = this.getReminderSubscriptions.bind(this)
        this.getAvaliableReminders = this.getAvaliableReminders.bind(this)
        this.toggleAccountInfoDisplay = this.toggleAccountInfoDisplay.bind(this)
        this.confirmUnconfirmedEmail = this.confirmUnconfirmedEmail.bind(this)
        this.confirmUnconfirmedPhone = this.confirmUnconfirmedPhone.bind(this)
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
    }
    toggleAccountInfoDisplay(){
        this.state.showAccountInfo == "yes" ? this.setState({showAccountInfo: 'no'}) : this.setState({showAccountInfo: 'yes'})
    }
    
    getReminderSubscriptions(){
        var url = "/get_user_subscriptions"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
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
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
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
        console.log(unconfirmed_email)
        console.log(email)
        console.log(bearer)
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer
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
            if(json.status == 200)
                this.props.setUnconfirmedEmailStateValue('')
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
        console.log(unconfirmed_phone)
        console.log(phone)
        console.log(bearer)
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': "bearer " + bearer
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
            if(json.status == 200)
                this.props.setUnconfirmedPhoneStateValue('')
        })
        .catch((e) => {console.log(e)})
    }
    render(){
        const reminder_eles = this.state.avaliableReminders.map((reminder_obj) => 
            <span className="reminder-ele">
                <span className="checkbox-and-label">
                    {/* <input type="checkbox" className="reminder-checkbox" id={reminder_obj.reminder_type.toString().replaceAll(' ', '-') + '-checkbox'}></input> */}
                </span>
                <span className="reminder-type-label-container"><h3>{reminder_obj.reminder_type}</h3></span>
                <span>
                    {
                        this.state.prettySubscriptions.filter((sub)=> {return sub.sub_type.toString() == reminder_obj.reminder_type.toString()}).length > 0 && 
                        <span>
                            {
                                this.props.editingReminderScheduleFor !== reminder_obj.reminder_type.toString() && this.state.prettySubscriptions.filter((sub)=> {
                                    return sub.sub_type.toString() == reminder_obj.reminder_type.toString()
                                })[0].times.split(',').map((time) => 
                                    <span className="circle">
                                        {time}   
                                    </span>
                                )
                            }
                            {
                                this.props.editingReminderScheduleFor !== reminder_obj.reminder_type.toString() &&
                                <span className="circle edit-reminder-schedule-button" onClick={() => this.props.toggleEditReminderScheduleFor(reminder_obj.reminder_type.toString())}>
                                    <i className="fa fa-pencil" />
                                
                                </span>
                            }
                            {
                                this.props.editingReminderScheduleFor == reminder_obj.reminder_type.toString() &&
                                <EditReminderScheduleForm editingFor={this.state.prettySubscriptions.filter((sub)=> {
                                    return sub.sub_type.toString() == reminder_obj.reminder_type.toString()
                                })} toggleSetReminderTimeValueUI={this.props.toggleSetReminderTimeValueUI} changeUserSubscriptionFor={this.props.changeUserSubscriptionFor} getReminderSubscriptions={this.getReminderSubscriptions} toggleEditReminderScheduleFor={this.props.toggleEditReminderScheduleFor} />
                            }
                        </span>
                    }
                    {
                        this.state.prettySubscriptions.filter((sub)=> {return sub.sub_type.toString() == reminder_obj.reminder_type.toString()}).length == 0 &&
                        <span className="edit-reminder-schedule-button" onClick={() => this.props.toggleEditReminderScheduleFor(reminder_obj.reminder_type.toString())}>
                            {
                                this.props.editingReminderScheduleFor !== reminder_obj.reminder_type.toString() &&
                                <span className="circle">
                                    <i className="fa fa-plus" />
                                </span>
                            }
                            {
                                this.props.editingReminderScheduleFor == reminder_obj.reminder_type.toString() &&
                                <EditReminderScheduleForm editingFor={[{new_subscription: reminder_obj}]} toggleSetReminderTimeValueUI={this.props.toggleSetReminderTimeValueUI} changeUserSubscriptionFor={this.props.changeUserSubscriptionFor} getReminderSubscriptions={this.getReminderSubscriptions} toggleEditReminderScheduleFor={this.props.toggleEditReminderScheduleFor} />
                            }
                        </span>
                    }
                </span>
            </span>
        )
        return(
            <div className="account-container">
                <span className="account-inner-container">
                    <div className="subscriptions-container">
                        <h2 className="subscription-header">Your Subscriptions</h2>
                        <p className="subscription-paragraph">Fill out the form below to subscribe to our various reminders.  Your reminder won't arrive at exactly the selected time, but we'll try our best.  Standard messaging rates apply.  This is a free service but feel free to donate.</p>
                        <span className="flex-col avaliable-reminder-list">
                            {reminder_eles}
                        </span>
                    </div>
                    <hr />
                    <div className="account-info-container">
                        <span className="account-info-header">
                            <h1 className="header-flex">
                                Account Info
                                {(this.props.unconfirmedEmail.length > 0 || this.props.unconfirmedPhone.length > 0) && <span className="circle exclaim-warning">!</span>}
                            </h1>
                            <span className="toggle-show-account-button" onClick={this.toggleAccountInfoDisplay}>[{this.state.showAccountInfo == 'no' ? 'show' : 'hide'}]</span>
                        </span>
                        {
                            this.props.unconfirmedPhone.length > 0 && 
                            <span className="confirm-unconfirmed-phone-container">
                                <h3>Confirm your phone number</h3>
                                <label>Enter the code we sent to your phone:</label>
                                <input className="form-control" id="confirm-phone-code"></input>
                                <button className="form-control circle" id="confirm-phone-submit" onClick={this.confirmUnconfirmedPhone}>Submit</button>
                                <span className="confirm-email-resend-code">[resend code]</span>
                            </span>
                        }
                        {
                            this.props.unconfirmedEmail.length > 0 && 
                            <span className="confirm-unconfirmed-email-container">
                                <h3>Confirm your email address</h3>
                                <label>Enter the code we sent to your email address:</label>
                                <input className="form-control" id="confirm-email-code"></input>
                                <button className="form-control circle" id="confirm-email-submit" onClick={this.confirmUnconfirmedEmail}>Submit</button>
                                <span className="confirm-email-resend-code">[resend code]</span>
                            </span>
                        }
                        {
                            this.state.showAccountInfo == 'yes' &&
                            <div className="account-info-attrs">
                                <hr />    
                                <span className="account-info-ele">
                                    <span className="account-info-label-and-attr">
                                        <label>email:</label>
                                        <span>{this.props.email}</span>
                                    </span>
                                    <span onClick={() => this.props.toggleEditingAccount('email')}><i className="fa fa-pencil"></i></span>
                                </span>
                                <span className="account-info-ele">
                                    <span className="account-info-label-and-attr">
                                        <label>phone:</label>
                                        <span>{this.props.phone}</span>
                                    </span>
                                    <span onClick={() => this.props.toggleEditingAccount('phone')}><i className="fa fa-pencil"></i></span>
                                </span>
                                <span className="account-info-ele">
                                    <span className="account-info-label-and-attr">
                                        <label>carrier:</label>
                                        <span>{this.props.carrier}</span>
                                    </span>
                                    <span onClick={() => this.props.toggleEditingAccount('carrier')}><i className="fa fa-pencil"></i></span>
                                </span>
                                <span className="account-info-ele">
                                    <span className="account-info-label-and-attr">
                                        <label>timezone:</label>
                                        <span>{this.props.timezone}</span>
                                    </span>
                                    <span onClick={() => this.props.toggleEditingAccount('timezone')}><i className="fa fa-pencil"></i></span>
                                </span>
                                <span className="buttons-container">
                                    <span className="account-info-ele change-password-container">
                                        <span id="change-password-button" onClick={() => this.props.toggleEditingAccount('password')}>[Change Password]</span>
                                    </span>
                                    <span className="account-info-ele delete-account-container">
                                        <span id="delete-account-button" onClick={() => this.props.toggleEditingAccount('delete')}>[Delete Account]</span>
                                    </span>
                                </span>
                                {
                                    this.props.editingAccountFor == "email" && this.props.unconfirmedEmail == '' &&
                                    <div>
                                        <hr />
                                        <EditEmailForm email={this.props.email} accessToken={this.props.accessToken} setUnconfirmedEmailStateValue={this.props.setUnconfirmedEmailStateValue} />
                                    </div>
                                }
                                {
                                    this.props.editingAccountFor == "phone" && this.props.unconfirmedPhone == '' &&
                                    <div>
                                        <hr />
                                        <EditPhoneForm phone={this.props.phone} accessToken={this.props.accessToken} setUnconfirmedPhoneStateValue={this.props.setUnconfirmedPhoneStateValue} />
                                    </div>
                                }
                                {
                                    this.props.editingAccountFor == "password" &&
                                    <div className="full-width">
                                        <hr />
                                        <ChangePasswordForm email={this.props.email} phone={this.props.phone} accessToken={this.props.accessToken} />
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