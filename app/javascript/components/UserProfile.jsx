import React from 'react'
import Login from '../components/Login'
import Account from '../components/Account'
import CreateAccount from '../components/CreateAccount'
import ForgotPassword from '../components/forms/ForgotPassword'
import ResetPassword from '../components/forms/ResetPassword'
export default class UserProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userId: 0,
            email: "",
            phone: "",
            signedIn: "no",
            createAccountToggle: "no",
            forgotPasswordToggle: "no",
            resetPasswordToggle: "no",
            editingReminderScheduleFor: '',
            accessToken: '',
            unconfirmedEmail: '',
            unconfirmedPhone: ''
        }
        this.toggleCreateAccount = this.toggleCreateAccount.bind(this)
        this.toggleForgotPassword = this.toggleForgotPassword.bind(this)
        this.toggleResetPassword = this.toggleResetPassword.bind(this)
        this.toggleSignedIn = this.toggleSignedIn.bind(this)
        this.setUser = this.setUser.bind(this)
        this.toggleEditReminderScheduleFor = this.toggleEditReminderScheduleFor.bind(this)
        this.toggleSetReminderTimeValueUI = this.toggleSetReminderTimeValueUI.bind(this)
        this.goBackToLogin = this.goBackToLogin.bind(this)
        this.sortEditingReminderTimeValuesUI = this.sortEditingReminderTimeValuesUI.bind(this)
        this.changeUserSubscriptionFor = this.changeUserSubscriptionFor.bind(this)
        this.toggleEditingAccount = this.toggleEditingAccount.bind(this)
        //this.confirmUnconfirmedEmail = this.confirmUnconfirmedEmail.bind(this)
        this.setUnconfirmedEmailStateValue = this.setUnconfirmedEmailStateValue.bind(this)
        this.setEmail = this.setEmail.bind(this)
        this.setPhone = this.setPhone.bind(this)
        this.setCarrier = this.setCarrier.bind(this)
        this.setTimezone = this.setTimezone.bind(this)
        this.setUnconfirmedPhoneStateValue = this.setUnconfirmedPhoneStateValue.bind(this)
    }
    componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState){
        if(prevState.unconfirmedEmail.length > 0 && this.state.unconfirmedEmail.length == 0){
            this.setEmail(prevState.unconfirmedEmail)
        }
        if(prevState.unconfirmedPhone.length > 0 && this.state.unconfirmedPhone.length == 0){
            this.setPhone(prevState.unconfirmedPhone)
        }
        if(prevState.forgotPasswordToggle == "no" && this.state.forgotPasswordToggle == "yes"){
            this.setState({resetPasswordToggle: 'no'})
        }
        if(prevState.resetPasswordToggle == "no" && this.state.resetPasswordToggle == "yes"){
            this.setState({forgotPasswordToggle: 'no'})
        }
    }
    setEmail(value){
        this.setState({email: value})
    }
    setPhone(value){
        this.setState({phone: value})
    }
    setCarrier(value){
        this.setState({carrier: value})
    }
    setTimezone(value){
        this.setState({timezone: value})
    }
    toggleCreateAccount(){
        this.state.createAccountToggle == "no" ? this.setState({createAccountToggle: "yes"}) : this.setState({createAccountToggle: "no"})
    }
    toggleForgotPassword(){
        this.state.forgotPasswordToggle == "no" ? this.setState({forgotPasswordToggle: "yes"}) : this.setState({forgotPasswordToggle: 'yes'})
    }
    toggleResetPassword(){
        this.state.resetPasswordToggle == "no" ? this.setState({resetPasswordToggle: "yes"}) : this.setState({resetPasswordToggle: 'no'})
    }
    goBackToLogin(){
        this.setState({
            userId: 0,
            email: "",
            phone: "",
            signedIn: "no",
            createAccountToggle: "no",
            forgotPasswordToggle: "no",
            resetPasswordToggle: "no",
            editingReminderScheduleFor: '',
            accessToken: '',
            unconfirmedEmail: '',
            unconfirmedPhone: ''
        })
    }
    toggleSignedIn(){}
    setUser(id, phone, email, timezone, carrier, token, unconfirmedEmail, unconfirmedPhone){
        this.setState({
            userId: id,
            email: email,
            phone: phone,
            timezone: timezone,
            carrier: carrier,
            signedIn: "yes",
            editingAccountWhich: "",
            accessToken: token,
            unconfirmedEmail: unconfirmedEmail,
            unconfirmedPhone: unconfirmedPhone
        })
    }
    toggleEditReminderScheduleFor(reminder_type){
        this.setState({editingReminderScheduleFor: reminder_type})
    }
    toggleSetReminderTimeValueUI(which, value){
        console.log(document.getElementById(which))
        if(document.getElementById((which + '-' + value.toString()).toString().replaceAll('.','-').replaceAll(' ', '-').replaceAll('--','-')))
            document.getElementById((which + '-' + value.toString()).toString().replaceAll('.','-').replaceAll(' ', '-').replaceAll('--','-')).setAttribute('selected','selected')
        this.sortEditingReminderTimeValuesUI(which)
    }
    toggleEditingAccount(which){
        this.setState({
            editingAccountWhich: which
        })
    }
    sortEditingReminderTimeValuesUI(which){
        var which_prefix = which.toString().substring(0, which.toString().indexOf('-'))
        var arr_of_which = []
        var which_sorted = []
        var options = document.getElementsByClassName(which + '-option')
        for(var j = 0; j < options.length; j++){
            options[j].setAttribute('selected', 'false')
            options[j].removeAttribute('selected')
        }
        var value_map = {
            "12 a.m.": 0,
            "1 a.m.": 1,
            "2 a.m.": 2,
            "3 a.m.": 3,
            "4 a.m.": 4,
            "5 a.m.": 5,
            "6 a.m.": 6,
            "7 a.m.": 7,
            "8 a.m.": 8,
            "9 a.m.": 9,
            "10 a.m.": 10,
            "11 a.m.": 11,
            "12 p.m.": 12,
            "1 p.m.": 13,
            "2 p.m.": 14,
            "3 p.m.": 15,
            "4 p.m.": 16,
            "5 p.m.": 17,
            "6 p.m.": 18,
            "7 p.m.": 19,
            "8 p.m.": 20,
            "9 p.m.": 21,
            "10 p.m.": 22,
            "11 p.m.": 23,
            "": 24
            }
        if(document.getElementById(which_prefix + '-0')){
            arr_of_which.push(document.getElementById(which_prefix + '-0').value)
        }
        if(document.getElementById(which_prefix + '-1')){
            arr_of_which.push(document.getElementById(which_prefix + '-1').value)
        }
        if(document.getElementById(which_prefix + '-2')){
            arr_of_which.push(document.getElementById(which_prefix + '-2').value)
        }
        if(document.getElementById(which_prefix + '-3')){
            arr_of_which.push(document.getElementById(which_prefix + '-3').value)
        }
        var options = document.getElementsByTagName('option')
        which_sorted = arr_of_which.sort((a ,b) => {
            return value_map[a] > value_map[b]
        })
        for(var j = 0; j < options.length; j++){
            options[j].removeAttribute('selected')
        }
        var select = document.getElementsByTagName('select')
        for(var i = 0; i < select.length; i++){
            select[i].removeAttribute('value')
        }
        for(var i = 0; i < which_sorted.length; i++){
            document.getElementById(which_prefix + '-' + i.toString() ).setAttribute('value', which_sorted[i])
            if(document.getElementById((which_prefix + '-' +  + i.toString() + '-' + which_sorted[i].toString()).toString().replaceAll('.','-').replaceAll(' ', '-').replaceAll('--','-'))){
                document.getElementById((which_prefix + '-' +  + i.toString() + '-' + which_sorted[i].toString()).toString().replaceAll('.','-').replaceAll(' ', '-').replaceAll('--','-')).setAttribute('selected','selected')
            }
            if(which_sorted[i] == "blank" || which_sorted[i] == ""){
                if(document.getElementById(which_prefix + '-' + i.toString() ).getAttribute('value') !== document.getElementById(which_prefix + '-' + i.toString() ).selectedOptions[0].getAttribute('value')){
                    var clone = document.getElementById(which_prefix + '-' + i.toString() ).selectedOptions[0].cloneNode(true)
                    var to_afterize = document.getElementById(which_prefix + '-' + i.toString() ).selectedOptions[0].previousSibling
                    document.getElementById(which_prefix + '-' + i.toString() ).selectedOptions[0].remove()
                    to_afterize.after(clone)
                }
                document.getElementById(which_prefix + '-' +  + i.toString() + '-blank').setAttribute('selected','selected')
            }
        }
    }
    changeUserSubscriptionFor(which){
        var arr_of_which = []
        if(document.getElementById(which + '-0')){
            arr_of_which.push(document.getElementById(which + '-0').value)
        }
        if(document.getElementById(which + '-1')){
            arr_of_which.push(document.getElementById(which + '-1').value)
        }
        if(document.getElementById(which + '-2')){
            arr_of_which.push(document.getElementById(which + '-2').value)
        }
        if(document.getElementById(which + '-3')){
            arr_of_which.push(document.getElementById(which + '-3').value)
        }
        var string_of_which = arr_of_which.filter((a) => {return a.length && a.length > 0}).join()
       
        const url = "/change_user_subscriptions"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
        }
        const body = JSON.stringify({
            user_id: this.state.userId,
            times: string_of_which,
            reminder_type: which
        })
        const options = {
            method: 'POST',
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then((response) => response.json())
        .then((json) => {
             console.log(json)
            for(var i = 0; i < json.added_reminder_users.length; i++){
                document.getElementById(json.added_reminder_users[i].reminder_type + '-' + i.toString()).setAttribute('value',json.added_reminder_users[i].time)
            }
            if(json.status == 200){
                this.setState({editingReminderScheduleFor: ''})
            }
        })
        .catch((e) => {
            console.log(e)
            //...
        })
    }
    setUnconfirmedEmailStateValue(newValue){
        this.setState({unconfirmedEmail: newValue})
    }
    setUnconfirmedPhoneStateValue(newValue){
        this.setState({unconfirmedPhone: newValue})
    }
    render(){
        return (
            <div>
                <div className="info"></div>
                {this.state.signedIn == "no" && this.state.createAccountToggle == "no" && this.state.forgotPasswordToggle == "no" && this.state.resetPasswordToggle == "no" && <Login toggleCreate={this.toggleCreateAccount} toggleForgotPassword={this.toggleForgotPassword} toggleResetPassword={this.toggleResetPassword} setUser={this.setUser} toggleSignedIn={this.toggleSignedIn} />}
                {this.state.signedIn == "no" && this.state.createAccountToggle == "yes" && <CreateAccount toggleCreate={this.toggleCreateAccount} setUser={this.setUser} toggleSignedIn={this.toggleSignedIn} goBackToLogin={this.goBackToLogin} />}
                {this.state.signedIn == "no" && this.state.forgotPasswordToggle == "yes" && <ForgotPassword toggleResetPassword={this.toggleResetPassword} toggleForgotPassword={this.toggleForgotPassword} goBackToLogin={this.goBackToLogin} />}
                {this.state.signedIn == "no" && this.state.resetPasswordToggle == "yes" && <ResetPassword toggleResetPassword={this.toggleResetPassword} toggleForgotPassword={this.toggleForgotPassword} goBackToLogin={this.goBackToLogin} />}
                {
                    this.state.signedIn == "yes" && 
                    <Account 
                        userId={this.state.userId} 
                        email={this.state.email} 
                        phone={this.state.phone} 
                        timezone={this.state.timezone} 
                        carrier={this.state.carrier} 
                        unconfirmedEmail={this.state.unconfirmedEmail}
                        unconfirmedPhone={this.state.unconfirmedPhone}
                        setUser={this.setUser} 
                        toggleEditReminderScheduleFor={this.toggleEditReminderScheduleFor} 
                        editingReminderScheduleFor={this.state.editingReminderScheduleFor} 
                        oggleSignedIn={this.toggleSignedIn} 
                        toggleSetReminderTimeValueUI={this.toggleSetReminderTimeValueUI} 
                        changeUserSubscriptionFor={this.changeUserSubscriptionFor} 
                        toggleEditingAccount={this.toggleEditingAccount} 
                        editingAccountFor={this.state.editingAccountWhich} 
                        accessToken={this.state.accessToken}
                        confirmUnconfirmedEmail={this.confirmUnconfirmedEmail}
                        setUnconfirmedEmailStateValue={this.setUnconfirmedEmailStateValue} 
                        setUnconfirmedPhoneStateValue={this.setUnconfirmedPhoneStateValue}
                        setTimezone={this.setTimezone}
                        setCarrier={this.setCarrier}
                    />
                        
                }
            </div>
    )}
}