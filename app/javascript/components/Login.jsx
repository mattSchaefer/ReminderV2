import React from 'react'
import { Link } from 'react-router-dom'
export default class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.login = this.login.bind(this)
    }
    componentDidMount(){}
    componentDidUpdate(prevProps, prevState){}
    login(){}
    render(){
        return(
        <div className="login-container">
            <div className="login-form-container">
                <span className="login-form-span">
                    <h1>Log In</h1>
                </span>
                <span className="login-form-span">
                    <label>Phone or Email:</label>
                    <input className="form-control"></input>
                </span>
                <span className="login-form-span">
                    <label>Password:</label>
                    <input className="form-control" type="password"></input>
                </span>
                <p>New here? <Link to="#" tabindex="0">Create an account</Link></p>
                <button className="login-button" id="login-button">Log-in</button>
            </div>
        </div>
    )}
}