import React from 'react'
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

export default class About extends React.Component{
    constructor(props){
        super(props)
        this.state={
            factList: ["Posture can have a profound impact on your health, success, and overall happiness.", "It's recommended that you drink between 2.7 and 3.7 liters of water per day.", "Vitamins and supplements become less-effective when you miss days."],
            activeFactIndex: 0
        }
    }
    componentDidMount(){
        setInterval(() => {
            
            if(this.state.activeFactIndex == this.state.factList.length - 1){
                this.setState({activeFactIndex: 0})
            }else{
                var cur_index = this.state.activeFactIndex
                this.setState({activeFactIndex: cur_index+1})
            }
            document.getElementById('bottom-text').classList.remove('where-it-should-be-skewed')
        },5000)
    }
    componentDidUpdate(prevProps, prevState){
        setTimeout(() => {
            document.getElementById('bottom-text').classList.add('where-it-should-be-skewed')
        },150)
        
    }
    render(){
        return(
            <span className="about-section-container">
                <Element name="about-section-element" className="element-element" />
                <span className="about-section-element">
                    <h2 className="white-text about-section-h2 to-the-left about-section-text-shadow">What is PostureCheck?</h2>
                </span>
                <span className="about-section-element about-section-element-2">
                    <div className="phone-photo faded"></div>
                    <p className="white-text about-section-para to-the-right about-section-text-shadow">PostureCheck is a subscription service.  We allow you to subscribe to reminders that help yourself better your health.</p>
                </span>
                <span className="about-section-element about-list">
                    <span>
                        <h3 className="white-text about-section-h3 to-the-left about-section-text-shadow">We send text messages to your phone in order to help you frequently:</h3> 
                        <ul className="white-text">
                            <li className="to-the-left about-section-text-shadow">check your posture</li>
                            <li className="to-the-left about-section-text-shadow">drink water</li>
                            <li className="to-the-left about-section-text-shadow">take vitamins/medication</li>
                            <li className="to-the-left about-section-text-shadow">exercise</li>
                        </ul>
                        <h3 className="white-text to-the-left about-section-text-shadow" id="scroll-down">Scroll down to get started.</h3>
                    </span>
                    <span className="desk-photo faded"></span>
                </span>
                <h2 className="about-section-bottom white-text did-you-know faded about-section-text-shadow">Did you know?</h2>
                <span className=" about-section-bottom faded"><p id="bottom-text" className="bottom-text where-it-should-be-skewed about-section-text-shadow">{this.state.factList[this.state.activeFactIndex]}</p></span>
            </span>
        )
    }
}