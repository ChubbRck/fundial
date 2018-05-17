
import React, { PureComponent } from 'react'

class Splitter extends PureComponent {

    state = {
       empty: true,
       draggedOver: false
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
        this.searchInput = React.createRef();
        

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

        //TODO update current game state assets object
    }
    render() {
    	return(
            <div className = "splitter"></div>
        )
    }
}

export default Splitter;