
import React, { PureComponent } from 'react'
import axios from 'axios'


let time = new Date().toLocaleString();



class ReminderOverlay extends PureComponent {
    

    state = {
        time: new Date().getMinutes(),
        reminderScreenShown: false,
        reminders: [],
        searchResults: null

    }

    componentWillReceiveProps() {
        
    this.searchStickers()
        
    
    }

    componentWillUnmount() {
       
    }
  
    searchStickers = (e) =>{
      
  

        axios.get('http://api.giphy.com/v1/gifs/translate?s="' + this.props.message + '"&api_key=gVwh9XoTdsnErz73NttCxaUiUnWcR6G0&limit=1')
        .then(response => this.setState({searchResults: response.data.data})    )
        console.log(this.state.searchResults)
  
    }

    render() {
        const { game } = this.state
        var fileString = "/img/22.gif";
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
                <div className = "clock-image" style={divStyle} />
                <div id = "darkOverlay" className = {this.props.shown ? 'shown' : 'hidden'}/>
                <span className = "reminderMessage">{this.props.message}</span>
                <div className = "dismissButton" onClick = {this.props.dismissMessage}/>
            </div>

        )
    }
}

export default ReminderOverlay
