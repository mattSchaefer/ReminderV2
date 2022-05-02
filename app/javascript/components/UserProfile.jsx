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
            signedIn: "no",
            createAccountToggle: "no"
        }

    }
    componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState){

    }
    render(){
        return (
            <div>
                {this.state.signedIn == "no" && this.state.createAccountToggle == "no" && <Login />}
                {this.state.signedIn == "no" && this.state.createAccountToggle == "yes" && <CreateAccount />}
                {this.state.signedIn == "yes" && <Account />}
            </div>
    )}
}