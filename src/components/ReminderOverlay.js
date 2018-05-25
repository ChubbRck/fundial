
import React, { PureComponent } from 'react'
import axios from 'axios'
import Sound from 'react-sound'


let time = new Date().toLocaleString();



class ReminderOverlay extends PureComponent {

    state = {
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        reminderScreenShown: false,
        reminders: [],
        searchResults: null,
        playSound: false

    }

    componentWillReceiveProps() {
        
    this.searchStickers()
    setTimeout(()=>{
            // Add your logic for the transition
            this.props.dismissMessage(); // what to push here?
        }, 15000);
        
    this.setState({playSound:true})
    }

    componentWillUnmount() {
       
    }
    
    isIOS = () =>{
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        //alert(iOS)
        return iOS
    }
    searchStickers = (e) =>{
      
        axios.get('http://api.giphy.com/v1/gifs/translate?s="' + this.props.message + '"&api_key=gVwh9XoTdsnErz73NttCxaUiUnWcR6G0&limit=1')
        .then(response => this.setState({searchResults: response.data.data})    )
        console.log(this.state.searchResults)
    }

    render() {
        const { game } = this.state
        var fileString = "/img/4/22.gif"; //TODO: Change this
        var divStyle = {
            width: '100%',
            height: '100%',
            backgroundImage: 'url(' + this.props.gif + ')',
            backgroundColor: "black",
            position: "absolute",
            backgroundSize: "100% 100%",
            top: 0,
            left: 0,
            zIndex: 899
        }

        return (
           
            <div id = "overlayContainer" className = {this.props.shown ? 'shown' : 'hidden'}>
                 <Sound
                    url="/img/sound.wav"
                  playStatus={(this.props.shown && !this.isIOS()) ? Sound.status.PLAYING : Sound.status.STOPPED}
            />
                <div className = "clock-image" style={divStyle} />
                <div id = "darkOverlay" className = {this.props.shown ? 'shown' : 'hidden'}/>
                <div className = "messages">
                    <span className = "dontForget">Don't Forget:</span>
                    <span className = "reminderMessage">{this.props.message}</span>
                    <div className = "dismissButton" onClick = {this.props.dismissMessage}>Dismiss</div>

                </div>
               
            </div>

        )
    }
}

export default ReminderOverlay
