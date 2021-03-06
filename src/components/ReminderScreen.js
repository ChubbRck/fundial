
import React, { PureComponent } from 'react'



let time = new Date().toLocaleString();



class ReminderScreen extends PureComponent {
    

    state = {
        message: '',
        reminderMinute: 20,
        reminderHour: 20
    }

    componentDidMount() {
    
    }

    componentWillUnmount() {
       
    }
    
    handleTimeChange = (event) => {
        var minutes = event.target.value.split(":")[1];
        var hours = event.target.value.split(":")[0];       
        this.setState({reminderHour:hours});
        this.setState({reminderMinute:minutes});
    }
    
    handleMessageChange = (event) => {
        this.setState({message: event.target.value});
    }

    render() {
        const { game } = this.state
        var fileString = "/img/16/22.gif";
        var divStyle = {
            width: '100%',
            height: '100%',
            backgroundImage: 'url(' + fileString + ')',
            backgroundColor: "red",
            position: "absolute",
            backgroundSize: "100% 100%",
            top: 0,
            left: 0
        }

        return (
            
            <div id = "overlayContainer" className = {`no-pulse ${this.props.shown ? 'shown' : 'hidden'}`}>
                <div className = "clock-image" style={divStyle} />
                <div id = "darkOverlay" className = {this.props.shown ? 'shown' : 'hidden'}/>
                <div className = "selectContainer">
                   <input id="time" type="time" name="appt-time" onChange={this.handleTimeChange} defaultValue="16:20"/>
                   <input id="message" type ="text" onChange={this.handleMessageChange} value = {this.state.message} placeholder = "Enter your reminder message here"/>
                   <div className = "dismissButton" onClick = {() => this.props.setReminder(this.state.reminderHour, this.state.reminderMinute, this.state.message)}>Set Reminder</div>
                <div className = "dismissButton" onClick = {this.props.dismissMessage}>Cancel</div>
                </div>

              
            </div>
        )
    }
}

export default ReminderScreen
