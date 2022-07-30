import React from 'react';
import LoadingAnimation from '../LoadingAnimation';
export default class EditCarrierForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            newCarrierSelection: '',
            requestUnderway: 'no'
        }
        this.editCarrierSubmit = this.editCarrierSubmit.bind(this)
        this.setNewCarrierSelection = this.setNewCarrierSelection.bind(this)
        this.verifyForm = this.verifyForm.bind(this)
    }
    componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState){

    }
    setNewCarrierSelection(){
        this.setState({newCarrierSelection: document.getElementById('edit-carrier-carrier-select').value})
    }
    editCarrierSubmit(){
        var email = this.props.email
        var token = this.props.accessToken
        var new_carrier = this.state.newCarrierSelection
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        const url = "users/change_carrier"
        var verified = this.verifyForm(new_carrier)
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
            new_carrier: new_carrier
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
                document.getElementById('carrier-span').classList.add('green-underline')
                document.getElementById('edit-carrier-toggle-button-icon').classList.remove('fa-pencil')
                document.getElementById('edit-carrier-toggle-button-icon').classList.add('fa-check')
                this.props.setCarrier(new_carrier)
            }
        })

    }
    verifyForm(new_carrier){
        var flag = true
        if(new_carrier == ''){
            document.getElementById('edit-carrier-carrier-select').classList.add('field-error')
            flag = false
        }
        return flag
    }
    render(){
        return(
            <div className="edit-carrier-container">
                <div className="edit-carrier-form-container">
                    <h2>Change Carrier:</h2>
                    <span className="login-form-span">
                        <label>Current Carrier:</label>
                        <input id="edit-carrier-current-carrier" className="form-control" placeholder={this.props.carrier} disabled value={this.props.carrier}></input>
                    </span>
                    <span className="login-form-span">
                        <label for="carrier-select">New Carrier:</label>
                        <select name="carrier-select" id="edit-carrier-carrier-select" className="form-control" onChange={this.setNewCarrierSelection}>
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
                    <span className="login-form-span">
                        {
                            this.state.requestUnderway == "no" &&
                            <button className="form-control submit-button" id="edit-carrier-submit-button" onClick={this.editCarrierSubmit} >Change Carrier</button>
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