
import React, { PureComponent } from 'react'
import axios from 'axios'
// import base from '../base'
import SearchResultsTray from './SearchResultsTray'




class SmartAsset extends PureComponent {

    state = {
       empty: true,
       draggedOver: false,
       id: null,
       gif_id: null,
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
        this.setState({id: this.props.id})
    }

    preventDefault = (e) => {
        e.preventDefault();
    }

    dragOver = (e) => {
        e.preventDefault();
        this.setState({ draggedOver: true })
    }

    dragLeave = (e) => {
        e.preventDefault();
        this.setState({ draggedOver: false })
    }

    drop = (e) =>{ 
      e.preventDefault();
        var newSrc = e.dataTransfer.getData('text/plain');
       e.currentTarget.innerHTML ="<img draggable = 'true' src = '" + newSrc + "'>"
       this.setState({ empty: false })
       this.setState({ draggedOver: false })
       this.setState({ gif_id: "xTiTnqUxyWbsAXq7Ju"})
        //TODO update current game state assets object
    }
    render() {
    	return(
            <div onDragOver={this.dragOver} onDragLeave = {this.dragLeave} onDrop={this.drop} className = {`smart-asset ${this.props.asset ? 'occupied' : 'empty'} ${this.state.draggedOver ? 'dragover' : 'not-dragged-over'}`}>

            </div>
        )
    }
}

export default SmartAsset;