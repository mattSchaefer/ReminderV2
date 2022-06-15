import React from 'react'
require('isomorphic-fetch')
export default class EditReminderScheduleForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            avaliableReminderTimes: [{time_reminder_string: ''}]
        }
        this.getAvaliableReminderTimes = this.getAvaliableReminderTimes.bind(this)
    }
    componentDidMount(){
        this.getAvaliableReminderTimes()
    }
    componentDidUpdate(prevProps, prevState){
        if(prevState.avaliableReminderTimes !== this.state.avaliableReminderTimes){
            if(!this.props.editingFor[0].new_subscription){
                for(var i = 0; i < this.props.editingFor[0].times.split(',').length; i++){
                    if(document.getElementById(this.props.editingFor[0].sub_type + '-' + i)){
                        this.props.toggleSetReminderTimeValueUI(this.props.editingFor[0].sub_type + '-' + i, this.props.editingFor[0].times.split(',')[i].toString())
                        
                    }
                }
            }
        }
    }
    getAvaliableReminderTimes(){
        const url = "/reminder_times"
        const csrf = document.querySelector('meta[name="csrf-token"]').content
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrf
        }
        const options = {
            method: 'GET',
            headers: headers
        }
        fetch(url, options)
        .then(response => response.json())
        .then((json) => {
            if(json.status == 200)
                this.setState({avaliableReminderTimes: this.state.avaliableReminderTimes.concat(json.reminder_times)})
        })
        .catch((e) => {})
    }
    render(){
        var time_bubbles_data = []
        var unique_identifier

        if(this.props.editingFor[0].new_subscription){
            unique_identifier = this.props.editingFor[0].new_subscription.reminder_type
            for(var i = 0; i < this.props.editingFor[0].new_subscription.max_per_day; i++){
                time_bubbles_data.push({value: ''})
            }
        }else{
            unique_identifier = this.props.editingFor[0].sub_type
            for(var i = 0; i < this.props.editingFor[0].times.split(',').length; i++){
                time_bubbles_data.push({value: this.props.editingFor[0].times.split(',')[i]})
            }
            if(this.props.editingFor[0].times.split(',').length < this.props.editingFor[0].max_per_day){
                for(var j = 0; j < this.props.editingFor[0].max_per_day - this.props.editingFor[0].times.split(',').length; j++){
                    time_bubbles_data.push({value: ''})
                }
            }
        }
        var time_bubbles = time_bubbles_data.map((time_bubble, index) => 
                <select name={unique_identifier + '-' + index} id={unique_identifier + '-' + index} className="circle">
                    { this.state.avaliableReminderTimes.map((time) => <option value={time.reminder_time_string ? time.reminder_time_string : ''} className={unique_identifier + '-option'} id={time.reminder_time_string ? unique_identifier + '-' + index + '-' + time.reminder_time_string.replaceAll('.','-').replaceAll(' ', '-') : unique_identifier + '-' + index + '-blank' } onClick={() => this.props.toggleSetReminderTimeValueUI(unique_identifier + '-' + index, time.reminder_time_string || '')}>{time.reminder_time_string}</option>)}
                </select>
        )
        return(
            <div className="edit-reminder-schedule-form-container">
               {time_bubbles}
               <button className="change-schedule-button circle">change schedule</button>
            </div>
        )
    }
}