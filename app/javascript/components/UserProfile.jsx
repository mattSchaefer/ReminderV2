import React from 'react'
import Login from '../components/Login'
import Account from '../components/Account'
import CreateAccount from '../components/CreateAccount'
export default class UserProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userId: 0,
            email: "",
            phone: "",
            signedIn: "no",
            createAccountToggle: "no",
            editingReminderScheduleFor: ''
        }
        this.toggleCreateAccount = this.toggleCreateAccount.bind(this)
        this.toggleSignedIn = this.toggleSignedIn.bind(this)
        this.setUser = this.setUser.bind(this)
        this.toggleEditReminderScheduleFor = this.toggleEditReminderScheduleFor.bind(this)
        this.toggleSetReminderTimeValueUI = this.toggleSetReminderTimeValueUI.bind(this)
        this.sortEditingReminderTimeValuesUI = this.sortEditingReminderTimeValuesUI.bind(this)
        this.changeUserSubscriptionFor = this.changeUserSubscriptionFor.bind(this)
    }
    componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState){

    }
    toggleCreateAccount(){
        this.state.createAccountToggle == "no" ? this.setState({createAccountToggle: "yes"}) : this.setState({createAccountToggle: "no"})
    }
    toggleSignedIn(){}
    setUser(id, phone, email, timezone, carrier){
        this.setState({
            userId: id,
            email: email,
            phone: phone,
            timezone: timezone,
            carrier: carrier,
            signedIn: "yes"
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
            console.log((which_prefix + '-' +  + i.toString() + '-' + which_sorted[i].toString()).toString().replaceAll('.','-').replaceAll(' ', '-').replaceAll('--','-'))
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
                console.log(document.getElementById(which_prefix + '-' +  + i.toString() + '-blank'))
                document.getElementById(which_prefix + '-' +  + i.toString() + '-blank').setAttribute('selected','selected')
            }
        }
    }
    changeUserSubscriptionFor(which){
        
    }
    render(){
        return (
            <div>
                <div className="info"></div>
                {this.state.signedIn == "no" && this.state.createAccountToggle == "no" && <Login toggleCreate={this.toggleCreateAccount} setUser={this.setUser} toggleSignedIn={this.toggleSignedIn} />}
                {this.state.signedIn == "no" && this.state.createAccountToggle == "yes" && <CreateAccount toggleCreate={this.toggleCreateAccount} setUser={this.setUser} toggleSignedIn={this.toggleSignedIn} />}
                {this.state.signedIn == "yes" && <Account userId={this.state.userId} email={this.state.email} phone={this.state.phone} timezone={this.state.timezone} carrier={this.state.carrier} setUser={this.setUser} toggleEditReminderScheduleFor={this.toggleEditReminderScheduleFor} editingReminderScheduleFor={this.state.editingReminderScheduleFor} toggleSignedIn={this.toggleSignedIn} toggleSetReminderTimeValueUI={this.toggleSetReminderTimeValueUI} changeUserSubscriptionFor={this.changeUserSubscriptionFor} />}
            </div>
    )}
}