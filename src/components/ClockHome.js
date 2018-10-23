
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
import firebase from "firebase";
import ReminderOverlay from './ReminderOverlay';
import ReminderScreen from './ReminderScreen';
import axios from 'axios'


let time = new Date().toLocaleString();



class ClockHome extends PureComponent {
    

    state = {
        hour: null,
        minute: null,
        reminderScreenShown: false,
        setReminderScreenShown: false,
        message:"nap time",
        URL: null,
        reminderGif: null,
        reminders: [
            {
                "hour":14,
                "minute":52,
                "message":"Take a Poop"
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

        this.setState({hour: this.formatHours(new Date().getHours())})
        this.setState({minute: this.formatMins(new Date().getMinutes())})
        var new_filename = this.formatHours(new Date().getHours()).toString() +this.formatMins(new Date().getMinutes()).toString();
          firebase
            .storage()
            .ref("gifs")
            .child(new_filename+".gif")
            .getDownloadURL()
            .then((url) => {
                this.setState({URL:url}) 
            }).catch((error) => {
                //handle error
                this.setState({ URL: null})
            });
    
    }

    formatMins = (mins) => {
        var raw_mins = mins
        return ('0'+raw_mins).slice(-2).toString();
    }

    formatHours = (hours) => {
        var raw_hours = hours
        return ('0'+raw_hours).slice(-2).toString();
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

    setReminder = (hour, minute, message) => {
        var newReminder = {
            hour:hour,
            minute:minute,
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

    doesFileExist = (path) => {
        try {
            return require(`${path}`);
        } catch (err) {
            return false;
        }
    }

    formatHour = () => {
        var formattedHour = ((parseInt(this.state.hour) + 11) % 12 + 1);
      
        return formattedHour;
    }

    getSuffix = () => {
        if (this.state.hour > 12) {
            return "PM"
        } else{
            return "AM"
        }
    }

    tick() {
        if (this.formatMins(new Date().getMinutes()) !== this.state.minute){
            //update!
            this.setState({hour: this.formatHours(new Date().getHours())})
            this.setState({minute: this.formatMins(new Date().getMinutes())})

             var new_filename = this.formatHours(new Date().getHours()).toString() +this.formatMins(new Date().getMinutes()).toString();
              firebase
                .storage()
                .ref("gifs")
                .child(new_filename+".gif")
                .getDownloadURL()
                .then((url) => {
                    this.setState({URL:url}) 
                }).catch((error) => {
                    //handle error
                    this.setState({ URL: null})
                });
    

                 // Check for reminders
        
            var arrayLength = this.state.reminders.length;
            for (var i = 0; i < arrayLength; i++) {
                var currentReminder = this.state.reminders[i];
                console.log(currentReminder)

                // if current reminder time matches current time, fire that reminder and remove it from the array
                // console.log("curent reminder time is " + currentReminder.time + " while current real time is " + this.state.time)
                if (currentReminder.minute == this.state.minute && currentReminder.hour == this.state.hour){
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



        }
        

   
    //Do something
    }

    render() {
        const { game } = this.state
        var timeNow = this.state.hour + ":" + this.state.minute;
        var formattedHour = ((parseInt(this.state.hours) + 11) % 12 + 1);
        var suffix;

        var fileString = "/img/" + this.state.hour + "/" + this.state.minute + ".gif";
        var divStyle = {
            width: '100%',
            height: '100%',
            backgroundImage: 'url(' + this.state.URL + ')',
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
                {this.state.URL ? '' : <div className ='noGifWarning'><span className = 'plainTime'>{this.formatHour(this.state.hour)}:{this.state.minute} {this.getSuffix()}</span><div>There's no GIF for this time yet!<br/>Want to make one?<br/>Go <a href = "/upload">here to contribute!</a></div></div>}
                <div onClick = {this.showSetReminderScreen} className = "setReminderButton"/>
                <ReminderOverlay shown={this.state.reminderScreenShown} gif={this.state.reminderGif} message={this.state.message} dismissMessage = {this.dismissMessage}/>
                <ReminderScreen key = {this.state.num} shown={this.state.setReminderScreenShown} dismissMessage = {this.cancelReminder} setReminder = {this.setReminder}/>
            </section>
        )
    }
}

export default ClockHome
