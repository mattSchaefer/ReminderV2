import React from 'react'
require('isomorphic-fetch')
export default class CreateAccount extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            accountCreationSubmissionComplete: 'no',
            accountCreationSubmissionResponse: {},
            accountActivationSubmissionComplete: 'no',
            accountActivationSubmissionResponse: {},
            accountActivated: 'no',
            accountCreationErrorText: ''
        }
        this.createAccount = this.createAccount.bind(this)
        this.activateAccount = this.activateAccount.bind(this)
        this.loginSignupMouseEnter = this.loginSignupMouseEnter.bind(this)
        this.loginSignupMouseLeave = this.loginSignupMouseLeave.bind(this)
        this.validateAccountCreation = this.validateAccountCreation.bind(this)
        this.validatePasswordMatch = this.validatePasswordMatch.bind(this)
    }
    componentDidMount(){

    }
    componentDidUpdate(PrevProps, prevState){

    }
    createAccount(){
        var url = '/users'
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
        }
        var email = document.getElementById('create-account-email').value || ''
        var phone = document.getElementById('create-account-phone').value.toString() || ''
        phone = this.stripPhoneNumber(phone)
        var password = document.getElementById('create-account-password').value || ''
        var password_confirm = document.getElementById('create-account-password-confirm').value || ''
        var carrier = document.getElementById('carrier-select').value || ''
        var timezone = document.getElementById('timezone-select').value || ''
        var valid = this.validateAccountCreation(email, phone, password, password_confirm, carrier, timezone)
        if(!valid)
            return;
        var body = JSON.stringify({
            email: email,
            phone: phone,
            password: password,
            carrier: carrier,
            timezone: timezone
        })
        var options = {
            method: 'POST',
            headers: headers,
            body: body
        }
        fetch(url, options)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            if(json.status == 200){
                this.setState({
                    accountCreationSubmissionResponse: json,
                    accountCreationSubmissionComplete: 'yes'
                })
            }else if(json.status == 500 || json.status == 505){
                if(json.error.indexOf('Email') > -1 || json.error.indexOf('Phone') > -1){
                    alert('phone or email already taken, please use different credentials to sign up')
                    //TODO: display text on form instead of alert
                    document.getElementById('create-account-email').classList.add('field-error')
                    document.getElementById('create-account-phone').classList.add('field-error')
                }
            }
        })
        .catch(e => {
            console.log(e)
            this.setState({accountCreationSubmissionResponse: e})
        })
    }
    validateAccountCreation(email, phone, password, password_confirm, carrier, timezone){
        document.getElementById('create-account-email').classList.remove('field-error')
        document.getElementById('create-account-phone').classList.remove('field-error')
        document.getElementById('create-account-password').classList.remove('field-error')
        document.getElementById('create-account-password-confirm').classList.remove('field-error')
        document.getElementById('carrier-select').classList.remove('field-error')
        document.getElementById('timezone-select').classList.remove('field-error')
        var flag = true
        if(email == ""){
            document.getElementById('create-account-email').classList.add('field-error')
            flag = false
        }
        if(phone == ""){
            document.getElementById('create-account-phone').classList.add('field-error')
            flag = false
        }
        if(carrier == ""){
            document.getElementById('carrier-select').classList.add('field-error')
            flag = false
        }
        if(timezone == ""){
            document.getElementById('timezone-select').classList.add('field-error')
            flag = false
        }
        if(password == "" || password_confirm == "" || password !== password_confirm){
            document.getElementById('create-account-password').classList.add('field-error')
            document.getElementById('create-account-password-confirm').classList.add('field-error')
            flag = false
        }
        return flag
    }
    validatePasswordMatch(){
        setTimeout(() =>{
            if(document.getElementById('create-account-password').value == document.getElementById('create-account-password-confirm').value){
                document.getElementById('create-account-password').classList.remove('field-error')
                document.getElementById('create-account-password-confirm').classList.remove('field-error')
            }else{
                document.getElementById('create-account-password').classList.add('field-error')
                document.getElementById('create-account-password-confirm').classList.add('field-error')
            }
        },25)  
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
        fetch(url,options)
        .then(response => response.json())
        .then((json) => {
            console.log(json)
            if(json.status == 200){
                this.setState({
                    accountActivationSubmissionComplete: 'yes',
                    accountActivationSubmissionResponse: json,
                })
                this.props.setUser(json.id, json.phone, json.email)
            }
        })
        .catch((e)=>{

        })
    }
    loginSignupMouseEnter(){
       // document.getElementById('create-account-form-container').classList.add('focus-blend')
        //document.getElementById('profile-section').classList.add('orange-background')
    }
    loginSignupMouseLeave(){
        //document.getElementById('create-account-form-container').classList.remove('focus-blend')
        //document.getElementById('profile-section').classList.remove('orange-background')

    }
    stripPhoneNumber(number){
        return number.replace(/\D/g,'');
    }
    render(){
        return(
            <div className="create-account-container">
                {
                    this.state.accountCreationSubmissionComplete == 'no' &&
                    <div className="create-account-form-container" id="create-account-form-container">
                        <span className="create-account-form-span">
                            <h1>Create Account</h1>
                        </span>
                        <span className="create-account-form-span">
                            <label>Phone:</label>
                            <input className="form-control" id="create-account-phone"></input>
                        </span>
                        <span className="create-account-form-span">
                            <label for="carrier-select">Carrier:</label>
                            <select name="carrier-select" id="carrier-select" className="form-control">
                                <option value=""></option>
                                <option value="verizon">Verizon</option>
                                <option value={"at&t"}>AT{'&'}T</option>
                                <option value="aio">Aio Wireless</option>
                                <option value="alltel">Alltel</option>
                                <option value="ameritech">Ameritech</option>
                                <option value="bell-atlantic">Bell-Atlantic</option>
                                <option value="bellsouthmobility">Bellsouth Mobility</option>
                                <option value="blueskyfrog">BlueSkyFrog</option>
                                <option value="boost">Boost Mobile</option>
                                <option value="cellularsouth">Cellular South</option>
                                <option value="comcast">Comcast PCS</option>
                                <option value="cricket">Cricket</option>
                                <option value="kajeet">kajeet</option>
                                <option value="metropcs">Metro PCS</option>
                                <option value="nextel">Nextel</option>
                                <option value="powertel">Powertel</option>
                                <option value="pscwireless">PSC Wireless</option>
                                <option value="quest">Quest</option>
                                <option vaule="southernlink">Southern Link</option>
                                <option value="sprint">Sprint PCS</option>
                                <option value="suncom">Suncom</option>
                                <option value="t-mobile">T-Mobile</option>
                                <option value="tracfone">Tracfone</option>
                                <option value="telus-mobility">Telus Mobility</option>
                                <option value="virgin">Virgin Mobile</option>
                            </select>
                        </span>
                        <span className="create-account-form-span">
                            <label>Time-zone</label>
                            <select name="timezone-select" id="timezone-select" className="form-control">
                                <option value=""></option>
                                <option value="eastern-standard">Eastern Standard</option>
                                <option value="central-standard">Central Standard</option>
                                <option value="mountain-standard">Mountain Standard</option>
                                <option value="pacific-standard">Pacific Standard</option>
                                <option value="alaska-daylight">Alaska Daylight</option>
                                <option value="hawaii">Hawaiii Standard</option>
                            </select>
                        </span>
                        <span className="create-account-form-span">
                            <label>Email:</label>
                            <input className="form-control" id="create-account-email"></input>
                        </span>
                        <span className="create-account-form-span">
                            <label>Password:</label>
                            <input className="form-control"  id="create-account-password" onChange={this.validatePasswordMatch}></input>
                        </span>
                        <span className="create-account-form-span">
                            <label>Password Confirm:</label>
                            <input className="form-control"  id="create-account-password-confirm" onChange={this.validatePasswordMatch}></input>
                        </span>
                        <button className="create-account-button" id="create-account-button" onClick={this.createAccount} onMouseEnter={this.loginSignupMouseEnter} onMouseLeave={this.loginSignupMouseLeave} onFocus={this.loginSignupMouseEnter} onBlur={this.loginSignupMouseLeave} >Create Account</button>
                    </div>
                }
                {
                    this.state.accountCreationSubmissionComplete == 'yes' && this.state.accountActivationSubmissionComplete == 'no' &&
                    <div className="activate-account-form-container" id="activate-account-form-container">
                        <span className="activate-account-form-span" id="activate-account-form-span">
                            <h1>Activate Account</h1>
                        </span>
                        <span className="activate-account-form-span">
                            <label>Activation Code:</label>
                            <input className="form-control" id="account-activation-token" />
                        </span>
                        <button className="activate-account-button" id="activate-account-button" onMouseEnter={this.loginSignupMouseEnter} onMouseLeave={this.loginSignupMouseLeave} onClick={this.activateAccount} >Activate Account</button>
                    </div>
                }
            </div>
        )
    }
}