import React from 'react'

export default class About extends React.Component{
    constructor(props){
        super(props)
        this.state={
            factList: ["Believe it or not, posture can have a profound impact on your health, success, and overall happiness.", "It's recommended that you drink between 2.7 and 3.7 liters of water per day- that's a lot!", "Vitamins and supplements become less-effective when you miss days."],
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
        },5000)
    }
    componentDidUpdate(prevProps, prevState){

    }
    render(){
        return(
            <span className="about-section-container">
                <span className="about-section-element">
                    <h2 className="white-text about-section-h2">What is RememberNow?</h2>
                </span>
                <span className="about-section-element about-section-element-2">
                    <div className="phone-photo"></div>
                    <p className="white-text about-section-para">RememberNow is a subscription service.  We allow you to subscribe to reminders that help yourself better your health.</p>
                </span>
                <span className="about-section-element about-list">
                    <span>
                        <h3 className="white-text about-section-h3">We send text messages to your phone in order to help you frequently:</h3> 
                        <ul className="white-text">
                            <li>check your posture</li>
                            <li>drink water</li>
                            <li>take vitamins/medication</li>
                            <li>exercise</li>
                        </ul>
                        <h3 className="white-text" id="scroll-down">Scroll down to get started.</h3>
                    </span>
                    <span className="desk-photo"></span>
                </span>
                <span className="aout-section-element about-section-bottom"><p className="bottom-text">{this.state.factList[this.state.activeFactIndex]}</p></span>
            </span>
        )
    }
}