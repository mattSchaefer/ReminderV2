import React from 'react';
import LoadingAnimation from '../LoadingAnimation'
export default class EditTimezoneForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            newTimezoneSelection: '',
            requestUnderway: 'no'
        }
        this.setNewTimezoneSelection = this.setNewTimezoneSelection.bind(this)
        this.editTimezoneSubmit = this.editTimezoneSubmit.bind(this)
        this.verifyForm = this.verifyForm.bind(this)
    }
    componentDidMount(){}
    componentDidUpdate(prevProps, prevState){}
    setNewTimezoneSelection(){
        this.setState({newTimezoneSelection: document.getElementById('edit-timezone-timezone-select').value})
    }
    editTimezoneSubmit(){
        var email = this.props.email
        var token = this.props.accessToken
        var new_timezone = this.state.newTimezoneSelection
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        const url = "users/change_timezone"
        var verified = this.verifyForm(new_timezone)
        if(!verified)
            return
        this.setState({requestUnderway: 'yes'})
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrf,
            'Authorization': 'bearer ' + token
        }
        const body= JSON.stringify({
            email: email,
            new_timezone: new_timezone
        })
        const options = {
            method: "POST",
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            this.setState({requestUnderway: 'no'})
            if(json.status == 200){
                document.getElementById('timezone-span').classList.add('green-underline')
                document.getElementById('edit-timezone-toggle-button-icon').classList.remove('fa-pencil')
                document.getElementById('edit-timezone-toggle-button-icon').classList.add('fa-check')
                this.props.setTimezone(new_timezone)
            }
        })
    }
    verifyForm(new_timezone){
        var flag = true
        if(new_timezone == ''){
            document.getElementById('edit-timezone-timezone-select').classList.add('field-error')
            flag = false
        }
        return flag
    }
    render(){
        return(
            <div className="edit-carrier-container">
                <div className="edit-carrier-form-container">
                    <h2>Change Timezone:</h2>
                    <span className="login-form-span">
                        <label>Current Timezone:</label>
                        <input id="edit-timezone-current-timezone" className="form-control" placeholder={this.props.timezone} disabled value={this.props.timezone}></input>
                    </span>
                    <span className="login-form-span">
                        <label for="timezone-select">New Timezone:</label>
                        <select name="timezone-select" id="edit-timezone-timezone-select" className="form-control" onChange={this.setNewTimezoneSelection}>
                            <option value=""></option>
                            <option value="eastern-standard">Eastern Standard</option>
                            <option value="central-standard">Central Standard</option>
                            <option value="mountain-standard">Mountain Standard</option>
                            <option value="pacific-standard">Pacific Standard</option>
                            <option value="alaska-daylight">Alaska Daylight</option>
                            <option value="hawaii">Hawaiii Standard</option>
                        </select>
                    </span>
                    <span className="login-form-span">
                        {
                            this.state.requestUnderway == "no" &&
                            <button className="form-control submit-button" id="edit-timezone-submit-button" onClick={this.editTimezoneSubmit} >Change Timezone</button>
                        }   
                        {
                            this.state.requestUnderway == "yes" &&
                            <div className="change-email-loading-animation-container">
                                <LoadingAnimation />
                            </div>
                        }
                    </span>
                </div>
            </div>
        )
    }
}