import React from 'react'
import {Link} from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import About from '../components/About'
export default class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authenticated: 'no',
            currentUser: 'anon',
            refreshToken: ''
        }
    }

    render(){
        return(
            <div className="homepage-container">
                <section>
                    <span className="header-and-para">
                        <h1 className="remember-now-header">RememberNow</h1>
                        <p className="reminder-para">Sometimes all it takes is a small reminder.</p>
                        <button className="login-signup-header-button">Log-in or Sign-up</button>
                    </span>
                    <VideoPlayer />
                </section>
                <section className="black-background">
                    <About />
                </section>
                <section></section>
            </div>
        )
    }
}