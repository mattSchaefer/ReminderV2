import React from 'react'
import VideoPlayer from '../components/VideoPlayer'
import About from '../components/About'
import UserProfile from '../components/UserProfile'
import Footer from '../components/Footer'
import * as Scroll from 'react-scroll';
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

export default class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authenticated: 'no',
            currentUser: 'anon',
            refreshToken: '',
            phone: '',
            contactCaptchaToken: ''
        }
        this.scrollListener = this.scrollListener.bind(this)
        this.removeScrollListener = this.removeScrollListener.bind(this)
        this.animateSpring = this.animateSpring.bind(this)
        this.putBackSpring = this.putBackSpring.bind(this)
        this.scrollToLoginSection = this.scrollToLoginSection.bind(this)
        this.setHomepagePhone = this.setHomepagePhone.bind(this)
        this.handleContactCaptchaChange = this.handleContactCaptchaChange.bind(this)
    }
    componentDidMount(){
        window.addEventListener("scroll", this.scrollListener)
    }
    scrollListener(){
        var windowHeight = window.innerHeight;
        var already_cycled = document.getElementById('end').classList.contains('where-it-should-be')
        console.log('scrolling')
        if(already_cycled){
            console.log('end')
            this.removeScrollListener()
            return
        }
        var revealables = document.querySelectorAll('.to-the-left,.to-the-right,.faded')
        for(var i = 0; i < revealables.length; i++){
            var section_top = revealables[i].getBoundingClientRect().top
            var scroll_show = 0
            var windowHeight = window.innerHeight;
            if(section_top < (windowHeight - scroll_show))
                revealables[i].classList.add('where-it-should-be', 'full-opacity')
            
        }
    }
    removeScrollListener(){
        window.removeEventListener('scroll', this.scrollListener)
    }
    animateSpring(){
        var skews = document.getElementsByClassName('skewed-strip')
        for(var i = 0; i < skews.length; i++){
            skews[i].classList.add('retract-spring')
        }
    }
    putBackSpring(){
        var skews = document.getElementsByClassName('skewed-strip')
        for(var i = 0; i < skews.length; i++){
            skews[i].classList.remove('retract-spring')
        }
    }
    scrollToLoginSection(){
        scroll.scrollTo('login-section-element')
    }
    setHomepagePhone(value){
        this.setState({phone: value})
    }
    componentDidUpdate(prevProps, prevState){
        
    }
    handleContactCaptchaChange(token){
        this.setState({contactCaptchaToken: token})
    }
    render(){
        return(
            <div className="homepage-container">
                <section>
                    <span className="header-and-para">
                        <h1 className="remember-now-header">PostureCheck</h1>
                        <p className="reminder-para">Sometimes all it takes is a small reminder.</p>
                        <span className="fancy-button-container">
                            <span className="skewed-strip"></span>
                            <span className="skewed-strip"></span>
                            <span className="skewed-strip"></span>
                            <Link to="login-section-element" className="scroll-link" spy={true} smooth={true} >
                                <button className="login-signup-header-button" onMouseEnter={this.animateSpring} onMouseLeave={this.putBackSpring} >
                                {/* onClick={this.scrollToLoginSection} */}
                                    {   
                                        this.state.phone == "" && 
                                        <span>Log-in or Sign-up</span>
                                    }
                                    {   
                                        this.state.phone !== "" && 
                                        <span>
                                            <i className="fa fa-user"></i>
                                            {this.state.phone}
                                        </span>
                                    }
                                </button>
                            </Link>
                        </span>
                        <Link to="about-section-element" spy={true} smooth={true} >
                            {/* onClick={() => scroll.scrollMore(1000)} */}
                            <span className="scrolldown-header" >Scroll down to learn more <i className="fa fa-arrow-down"></i></span>
                        </Link>
                        <span className="scrolldown-header-2" onClick={() => scroll.scrollToBottom()}>Contact/Donate<i className="fa fa-arrow-down"></i></span>
                    </span>
                    <VideoPlayer />
                </section>
                <section className="black-background">
                    <About />
                </section>
                <section className="black-background" id="profile-section">
                    <UserProfile setHomepagePhone={this.setHomepagePhone} />
                </section>
                <section className="footer-section">
                    <Footer handleContactCaptchaChange={this.handleContactCaptchaChange} contactCaptchaToken={this.state.contactCaptchaToken} />
                </section>
            </div>
        )
    }
}