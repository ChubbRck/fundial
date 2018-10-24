
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
import base from '../base'
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";

import Background from '../img/51.gif';

import ReminderOverlay from './ReminderOverlay';
import ReminderScreen from './ReminderScreen';
import axios from 'axios'


let time = new Date().toLocaleString();



class UploadPage extends PureComponent {
    

    state = {
        hour: "16",
        minute:"20",
        filename: null,
        URL: null,
        isUploading: false,
        times: null
    }

    componentDidMount(){
        let current_hour = this.formatHours(new Date().getHours())
        let current_minute = this.formatMins(new Date().getMinutes())

        this.setState({hour: this.formatHours(new Date().getHours())})
        this.setState({minute: this.formatMins(new Date().getMinutes())})

        let newFilename = current_hour.toString() + current_minute.toString();
        this.setState({filename:newFilename});

        

         base.fetch(`gifs/`, {
            context: this,
            asArray: false
        }).then(data => {
            
            
         this.setState({times:data})
          
        })

        firebase
      .storage()
      .ref("gifs")
      .child(newFilename+".gif")
      .getDownloadURL()
      .then(url => this.setState({ URL: url }));
    }

    formatMins = (mins) => {
        var raw_mins = mins
        return ('0'+raw_mins).slice(-2).toString();
    }

    formatHours = (hours) => {
        var raw_hours = hours
        return ('0'+raw_hours).slice(-2).toString();
    }

    handleTimeChange = (event) => {
        
        let minutes = event.target.value.split(":")[1];
        let hours = event.target.value.split(":")[0];  

        let formatted_mins = this.formatMins(minutes)
        let formatted_hours = this.formatHours(hours)   
        let new_filename = formatted_hours+formatted_mins
      
        this.setState({hour:formatted_hours});
        this.setState({minute:formatted_mins});
        this.setState({filename:new_filename}, function(){
            
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
        });

        
    }

    updateURL = (new_url) => {
        alert("new url")
        if (new_url){
            this.setState({ URL: new_url })
        } else {
            this.setState({ URL: null})
        }
    }

    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  
    handleProgress = progress => this.setState({ progress });
  
    handleUploadError = error => {
      this.setState({ isUploading: false });
      console.error(error);
    };
  
    handleUploadSuccess = filename => {
      this.setState({ progress: 100, isUploading: false });
      firebase
      .storage()
      .ref("gifs")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ URL: url }));

      let new_data = {"test": true}
      let temp_times = this.state.times

      temp_times[filename.split(".")[0]] = true;
      base.post(`gifs/`, {
                data: temp_times
            }).then(() => {
                base.fetch(`gifs/`, {
                context: this,
                asArray: false
                }).then(data => {
            
            
                    this.setState({times:data})
          
                })
            }).catch(err => {
                console.log("ERROR!")
                console.log(err)
            });
    };

    changeTime = (timeString) => {
        let minutes = timeString.substring(2,4)
        let hours = timeString.substring(0,2) 

        let formatted_mins = this.formatMins(minutes)
        let formatted_hours = this.formatHours(hours)   
        let new_filename = formatted_hours+formatted_mins
      
        this.setState({hour:formatted_hours});
        this.setState({minute:formatted_mins});
        this.setState({filename:new_filename}, function(){
            
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
        });
    }

    listTimes = (hour) => {
        var list = []

        let formatted_mins = this.formatMins(this.state.minute)
        let formatted_hours = this.formatHours(this.state.hour)   
        let currentTime = formatted_hours+":"+formatted_mins;

        for (let i = 0; i <60; i++) {
            // check if this exists in the taken array
            let timeString = hour.toString() + this.formatMins(i).toString()
            console.log(Object.keys(this.state.times))
            console.log("looking for " + timeString)
            let result = Object.keys(this.state.times).includes(timeString);
            console.log(result)
            let isNow = '';
            if (hour.toString() + ":" + this.formatMins(i).toString() == currentTime){
                isNow = "now"
            }

            list.push(<div onClick = {() => this.changeTime(timeString)} className = {isNow + " individual-time " + result.toString()}>{hour.toString() + ":" + this.formatMins(i).toString()}</div>)
            //list.push(<div className = "individual-time">{Object.keys(this.state.times)[i]} is taken, i'm afraid.</div>)
        }

        return list;
    }

    render() {
     

        return !this.state.times ? (
                    <div>Loading...</div>
            ) : (
            <div>
            <section className = "upload">
                <h1>This is the GIPHY Fundial Upload Page!</h1>
                <div className = "mini-section">
                    <h2>First, pick a time to upload a GIF for that time!</h2>
                    <input id="time" type="time" name="appt-time" onChange={this.handleTimeChange} defaultValue="16:20" value = {this.state.hour + ":" + this.state.minute}/>
                </div>
                <div class = "mini-section">
                    <h2>Upload a GIF!</h2>
                    <FileUploader
                    accept="image/gif"
                    name="gif"
                    filename={this.state.filename}
                    storageRef={firebase.storage().ref("gifs")}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
                  />
                </div>
                <div class = "mini-section">
                {this.state.URL ? (
                    <div>
                        <h2>This is the current GIF for this time:</h2>
                        <img src = {this.state.URL}/>
                    </div>
                ) : (
                    <div>No GIF exists for this time yet! Upload one!</div>
                )}
                </div>
              </section>
              <section className = "upload">
              <h2>Here are the times for your selected hour</h2>
              <div>
            
                    {this.listTimes(this.state.hour)}
            
              </div>
                
            </section>
            </div>
        )
    }
}

export default UploadPage
