
import React, { PureComponent } from 'react'
// import Game from '../mg_js/game'
// // import Game from '../mg_js/game'
// import base from '../base'
// import PlaylistUI from "./PlaylistUI";
// import "../js/matter";
// import "../mg_js/_easing";
// import "../mg_js/_functions";
// import "../mg_js/_globals";
// import '../mg_js/_gamelibrary'
import Background from '../img/51.gif';

import ReminderOverlay from './ReminderOverlay';
import ReminderScreen from './ReminderScreen';
import axios from 'axios'


let time = new Date().toLocaleString();



class ClockHome extends PureComponent {
    

    state = {
        time: new Date().getMinutes(),
        reminderScreenShown: false,
        setReminderScreenShown: false,
        message:"nap time",
        reminderGif: null,
        reminders: [

            {
                "time":24,
                "message":"Take a Poop"
            },
            {
                "time":23,
                "message":"dinner"
            }

        ],

    }

    searchStickers = (message) =>{
      
  

        axios.get('http://api.giphy.com/v1/gifs/translate?s="' + message + '"&api_key=gVwh9XoTdsnErz73NttCxaUiUnWcR6G0&limit=1')
        .then(response => this.setState({reminderGif: response.data.data.images.original.url})    )
        
  
    }

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    
    dismissMessage = () => {
        this.setState({reminderScreenShown: false})
    }

    cancelReminder = () => {
        this.setState({setReminderScreenShown: false})
        var newNum = this.state.num +1;
        this.setState({num:newNum});
    }

    showSetReminderScreen = () => {

        this.setState({setReminderScreenShown: true})

    }

    setReminder = (time, message) => {
        var newReminder = {
            time:time,
            message:message
        }

        var tempReminders 
        var tempReminders = this.state.reminders;
        tempReminders.push(newReminder);
        
        this.setState({reminders:tempReminders})
        this.setState({setReminderScreenShown: false})
        var newNum = this.state.num +1;
        this.setState({num:newNum});
    }

    tick() {
        this.setState({
            time: new Date().getMinutes()
        });

        // Check for reminders
        
        var arrayLength = this.state.reminders.length;
        for (var i = 0; i < arrayLength; i++) {
            var currentReminder = this.state.reminders[i];
            console.log(currentReminder)

            // if current reminder time matches current time, fire that reminder and remove it from the array
            // console.log("curent reminder time is " + currentReminder.time + " while current real time is " + this.state.time)
            if (currentReminder.time == this.state.time){
                console.log("MATCH!")
                // alert(currentReminder.message)
                this.searchStickers(currentReminder.message)
                this.setState({message:currentReminder.message})
                this.setState({reminderScreenShown:true})
                var tempReminders = this.state.reminders;
                tempReminders.splice(i, 1);
                this.setState({reminders:tempReminders})
                break;
            }
        }
    //Do something
    }

    render() {
        const { game } = this.state
        var fileString = "/img/" + this.state.time + ".gif";
        var divStyle = {
            width: '100%',
            height: '100%',
            backgroundImage: 'url(' + fileString + ')',
            backgroundColor: "black",
            position: "absolute",
            backgroundSize: "100% 100%",
            top: 0,
            left: 0
        }

        return (
                
            <section id = "clock-container">
               
                <div>The time is {this.state.time}.</div>
                <div className = "clock-image" style={divStyle}/>
                <div onClick = {this.showSetReminderScreen} className = "setReminderButton"/>
                <ReminderOverlay shown={this.state.reminderScreenShown} gif={this.state.reminderGif} message={this.state.message} dismissMessage = {this.dismissMessage}/>
                <ReminderScreen key = {this.state.num} shown={this.state.setReminderScreenShown} dismissMessage = {this.cancelReminder} setReminder = {this.setReminder}/>
                
            </section>


        )
    }
}

export default ClockHome
