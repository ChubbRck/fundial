
import React, { PureComponent } from 'react'
// import base from '../base'





class SearchResultsTray extends PureComponent {

    state = {
       plays: 0
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
    }
    
    dragStart = (e) => {
        
         e.dataTransfer.setData('text/plain', e.currentTarget.getAttribute('src'));
         console.log("draggg!")
    }

    render() {
        var namesList;

        if (this.props.results){
            namesList = this.props.results.map(function(name){ 
                return <li>{name}</li>;
            })
        }
    	return(
            <div class = {`search_results_tray ${this.props.results ? 'active' : ''}`}>
            
                {this.props.results ? (
                    this.props.results.map((sticker, index) => (
                        <div className = 'search-result'><img onDragStart={this.dragStart} draggable = 'true' autoplay = 'true' data-gif_id = {sticker.id} className = 'search-result-image' src ={sticker.images.fixed_height_small.webp}/></div>
                        
                
                    ))
                ) : (
                  ''
                )}
            
            
            
            </div>

        )
    }
}

export default SearchResultsTray;