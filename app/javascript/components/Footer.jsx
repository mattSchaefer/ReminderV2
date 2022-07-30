import React from 'react'
import ReCaptchaV2 from 'react-google-recaptcha'
import LoadingAnimation from '../components/LoadingAnimation'
require('isomorphic-fetch')

export default class Footer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            contactFormToggle: 'yes',
            contactSubmissionStatus: 999,
            requestUnderway: 'no',
            donateLinkDisplay: 'yes',
            linkedInLinkDisplay: 'yes',
            otherProjectsDisplay: 'yes',
            donateTooltipDisplay: 'no',
            otherProjectsTooltipDisplay: 'no',
            linkedinTooltipDisplay: 'no'
        }
        this.toggleContactForm = this.toggleContactForm.bind(this)
        this.submitContactForm = this.submitContactForm.bind(this)
        this.validateForm = this.validateForm.bind(this)
        this.toggleDonateLinkDisplay = this.toggleDonateLinkDisplay.bind(this)
        this.toggleLinkedInLinkDisplay = this.toggleLinkedInLinkDisplay.bind(this)
        this.toggleOtherProjectsDisplay = this.toggleOtherProjectsDisplay.bind(this)
        this.toggleDonateTooltipDisplay = this.toggleDonateTooltipDisplay.bind(this)
        this.toggleOtherProjectsTooltipDisplay = this.toggleOtherProjectsTooltipDisplay.bind(this)
        this.toggleLinkedinTooltipDisplay = this.toggleLinkedinTooltipDisplay.bind(this)

    }
    componentDidMount(){}
    componentDidUpdate(prevProps, prevState){}
    toggleContactForm(){
        this.state.contactFormToggle == 'yes' ? this.setState({contactFormToggle: 'no'}) : this.setState({contactFormToggle: 'yes'})
    }
    toggleDonateLinkDisplay(){
        this.state.contactFormToggle == 'yes' ? this.setState({donateLinkDisplay: 'no'}) : this.setState({donateLinkDisplay: 'yes'})
    }
    toggleLinkedInLinkDisplay(){
        this.state.contactFormToggle == 'yes' ? this.setState({linkedInLinkDisplay: 'no'}) : this.setState({linkedInLinkDisplay: 'yes'})
    }
    toggleOtherProjectsDisplay(){
        this.state.contactFormToggle == 'yes' ? this.setState({otherProjectsDisplay: 'no'}) : this.setState({otherProjectsDisplay: 'yes'})
    }
    toggleDonateTooltipDisplay(){
        this.state.donateTooltipDisplay == "yes" ? this.setState({donateTooltipDisplay: 'no'}) : this.setState({donateTooltipDisplay: 'yes'})
    }
    toggleOtherProjectsTooltipDisplay(){
        this.state.otherProjectsTooltipDisplay == "yes" ? this.setState({otherProjectsTooltipDisplay: 'no'}) : this.setState({otherProjectsTooltipDisplay: 'yes'})
    }
    toggleLinkedinTooltipDisplay(){
        this.state.linkedinTooltipDisplay == "yes" ? this.setState({linkedinTooltipDisplay: 'no'}) : this.setState({linkedinTooltipDisplay: 'yes'})
    }
    submitContactForm(){
        const email = document.getElementById('contact-form-email').value || ""
        const message = document.getElementById('contact-form-message').value || ""
        var valid = this.validateForm(email, message)
        if(!valid)
            return
        this.setState({requestUnderway: 'yes'})
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        var captcha_token = this.props.contactCaptchaToken
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf,
            'Captcha-Token': captcha_token
        }
        const url = '/create-contact'
        var body = JSON.stringify({
            email: email,
            message: message
        })
        const options = {
            method: 'POST',
            headers: headers,
            body: body
        }
        fetch(url,options)
        .then((response)=> response.json())
        .then((json) => {
            console.log(json)
            this.setState({requestUnderway: 'no'})
            if(json.status){
                this.setState({contactSubmissionStatus: json.status})
            }
        })
        .catch((e) => {
            console.log(e)
        })
    }
    validateForm(email, message){
        var flag = true
        if(email == ""){
            document.getElementById('contact-form-email').classList.add('field-error')
            flag = false
        }
        if(message == ""){
            document.getElementById('contact-form-message').classList.add('field-error')
            flag = false
        }
        return flag
    }

    render(){
        return(
            <div className="footer-container">
                {
                    this.state.contactFormToggle == 'no' &&
                    <div className="footer-element faded">
                        <h1 onClick={this.toggleContactForm}>Contact</h1>
                    </div>
                }
                {
                    this.state.contactFormToggle == 'yes' && this.state.contactSubmissionStatus !== 200 &&
                    <div className="footer-element contact-form">
                        <h1>Contact</h1>
                        <span>
                            <label>email:</label>
                            <input className="form-control" id="contact-form-email" />
                        </span>
                        <span>
                            <label>message:</label>
                            <textarea type="text" className="form-control" id="contact-form-message" />
                        </span>
                        <ReCaptchaV2 id="contactCaptcha" sitekey={process.env.REACT_APP_RCAPTCHA_SITE_KEY} onChange={(token) => {this.props.handleContactCaptchaChange(token)}} onExpire={(e) => {handleCaptchaExpire()}} />
                        {
                            this.state.requestUnderway == 'yes' &&
                            <LoadingAnimation />
                        }
                        {
                            this.state.requestUnderway == 'no' &&
                            <span>
                                <button className="form-control submit-button" onClick={this.submitContactForm}>Submit</button>
                            </span>
                        }
                    </div>
                }
                {
                    this.state.contactFormToggle == 'yes' && this.state.contactSubmissionStatus == 200 &&
                    <div className="footer-element contact-success">
                        <h1>Thanks!</h1>
                        <p>We'll reach out when we can.</p>
                    </div>
                }
                <div className="footer-element faded">
                    <span className="footer-element-inner">
                        <h2 className="footer-header" onClick={this.toggleDonateLinkDisplay}>Donate</h2>
                        {
                            this.state.donateLinkDisplay == "yes" && 
                            <span className="footer-element-container">
                                {
                                    this.state.donateTooltipDisplay == "yes" &&
                                    <span id="donate-tooltip" className="tooltip-container">
                                        <div className="tooltip-body">
                                            http://buymecoffee
                                        </div>
                                        <div className="tooltip-bottom"></div>
                                    </span>
                                }
                                <button tabindex="0" target="_blank" onClick={() => window.open("https://www.buymeacoffee.com/matthewschaefer", "_blank")} className="footer-link-ele transparent-bg"><h1><i className="fa fa-coffee donate-footer-icon" onMouseEnter={this.toggleDonateTooltipDisplay} onMouseLeave={this.toggleDonateTooltipDisplay}></i></h1></button>
                            </span>
                        }
                    </span>
                    
                </div>
                <div className="footer-element faded">
                    <span className="footer-element-inner">
                        <h2 className="footer-header" onClick={this.toggleLinkedInLinkDisplay}>Professional Inquiries</h2>
                        {
                            this.state.linkedInLinkDisplay == "yes" &&
                            <span className="footer-element-container"> 
                                {
                                    this.state.linkedinTooltipDisplay == "yes" &&
                                    <span id="linked-in-tooltip" className="tooltip-container">
                                        <div className="tooltip-body">
                                            http://linkedin.com
                                        </div>
                                        <div className="tooltip-bottom"></div>
                                    </span>
                                }
                                <button tabindex="0" target="_blank" onClick={() => window.open("https://www.linkedin.com/in/matt-schaefer-b42911150/", "_blank")} className="footer-link-ele transparent-bg"><h1><i className="fa fa-linkedin" onMouseEnter={this.toggleLinkedinTooltipDisplay} onMouseLeave={this.toggleLinkedinTooltipDisplay}></i></h1></button>
                            </span>
                        }
                    </span>
                </div>
                <div className="footer-element faded" id="end">
                    <span className="footer-element-inner">
                        <h2 className="footer-header" onClick={this.toggleOtherProjectsDisplay}>Other Projects</h2>
                        {
                            this.state.otherProjectsDisplay == "yes" && 
                            <span className="footer-element-container">
                                {
                                    this.state.otherProjectsTooltipDisplay == "yes" &&
                                    <span id="other-projects-tooltip" className="tooltip-container">
                                        <div className="tooltip-body">
                                            http://matthewschaefer.digital
                                        </div>
                                        <div className="tooltip-bottom"></div>
                                    </span>
                                }
                                <button tabindex="0" target="_blank" onClick={() => window.open("http://matthewschaefer.digital","_blank")} className="footer-link-ele transparent-bg"><h1><i className="fa fa-clipboard" onMouseEnter={this.toggleOtherProjectsTooltipDisplay} onMouseLeave={this.toggleOtherProjectsTooltipDisplay}></i></h1></button>
                            </span>
                        }
                    </span>
                </div>
                
                
            </div>
        )
    }
}