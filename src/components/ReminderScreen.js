
import React, { PureComponent } from 'react'



let time = new Date().toLocaleString();



class ReminderScreen extends PureComponent {
    

    state = {
        message: '20',
        reminderTime: null
    

    }

    componentDidMount() {
    
    }

    componentWillUnmount() {
       
    }
    
    handleTimeChange = (event) => {
        var minutes = event.target.value.split(":")[1];
        this.setState({reminderTime:minutes});
    }
    
    handleMessageChange = (event) => {
        this.setState({message: event.target.value});
    }

    render() {
        const { game } = this.state
        var fileString = "/img/22.gif";
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
            
            <div id = "overlayContainer" className = {this.props.shown ? 'shown' : 'hidden'}>
                <div className = "clock-image" style={divStyle} />
                <div id = "darkOverlay" className = {this.props.shown ? 'shown' : 'hidden'}/>
                <div className = "selectContainer">
                   <input id="time" type="time" name="appt-time" onChange={this.handleTimeChange} defaultValue="16:20"/>
                   <input id="message" type ="text" onChange={this.handleMessageChange} value = {this.state.message} placeholder = "Enter your reminder message here"/>
                   <div class = "button" onClick = {() => this.props.setReminder(this.state.reminderTime, this.state.message)}>Set Reminder</div>
                </div>

                <div className = "dismissButton" onClick = {this.props.dismissMessage}/>
            </div>
        )
    }
}

export default ReminderScreen
