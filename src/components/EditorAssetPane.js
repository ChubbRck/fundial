
import React, { PureComponent } from 'react'
import axios from 'axios'
// import base from '../base'
import SearchResultsTray from './SearchResultsTray'
import SmartAsset from './SmartAsset'




class EditorAssetPane extends PureComponent {

    searchInput = React.createRef();

    state = {
       searchResults: null
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
       
        

    }

    preventDefault = (e) => {
        e.preventDefault();
    }

    drop = (e) =>{
        e.preventDefault();
        alert("DROPPED MOFO!")
        var newSrc = e.dataTransfer.getData('text/plain');
        e.currentTarget.innerHTML ="<img draggable = 'true' src = '" + newSrc + "'>"

        //TODO update current game state assets object
    }
    searchStickers = (e) =>{
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        console.log(this.searchInput)
        var searchTerm = this.searchInput.value.value;


        axios.get('http://api.giphy.com/v1/stickers/search?q="' + searchTerm + '"&api_key=gVwh9XoTdsnErz73NttCxaUiUnWcR6G0&limit=15')
        .then(response => this.setState({searchResults: response.data.data})    )
        // var xhr = $.get("http://api.giphy.com/v1/stickers/search?q="+searchTerm+"&api_key=gVwh9XoTdsnErz73NttCxaUiUnWcR6G0&limit=15");
        // xhr.done(function(data) { 
        //     console.log("success got data", data); 
        //     //clear the results tray
        //     $(".search_results_tray").html("");
        //     //iterate through the data and append to the search_results_tray div
        //     $(".search_results_tray").addClass('active');
        //     $.each(data.data, function(index) {
        //         console.log(data.data[index].images.fixed_height.url);
        //         $(".search_results_tray").append("<div class = 'search-result'><img autoplay = 'true' data-gif_id ='"+data.data[index].id+"' class = 'search-result-image' src ='" +data.data[index].images.fixed_height_small.webp + "'></img></div>");
        //         // console.log(data[index].data.images.fixed_height_still);
                
        //     });
        // });
    }

    render() {
    	return(
            <div className="content_page" id="content_assets">
                <div className = "pane-container">
                    <form id="giphy_search_form">
                        <input ref={this.searchInput} type = "text" className ="asset_giphy_search_input" placeholder="Search GIPHY!"/><a onClick = {this.searchStickers} className = "search_button"><img src =  {require("../img/search-logo.gif")}/></a>
                            
               
                    </form>
                    
                    <SearchResultsTray results = {this.state.searchResults}/>

          
                    <div className="asset_linkrow add_tool">
                        
                    </div>
            
                    
                    <h3>THIS GAME'S ASSETS</h3>
                    <div className = "smart-asset-tray">
                        <SmartAsset id = {0} asset = {this.props.game.assets[0]}/>
                        <SmartAsset id = {1} />
                        <SmartAsset id = {2} />
                        <SmartAsset id = {3} />
                        <SmartAsset id = {4} />
                        <SmartAsset id = {5} />
                        <SmartAsset id = {6} />
                        <SmartAsset id = {7} />
                      
                    </div>
                
                 
                    <h3>MY ASSETS</h3>  
                    <div className = "my-assets-container">
                        <div className="assets_filters">    
                            <div className="assets_filter_label">FILTERS:</div> 
                            <div className="assets_filter assets_filter_sel" data-filter="all">All</div>    
                            <div className="assets_filter" data-filter="jpg">JPG</div>  
                            <div className="assets_filter" data-filter="png">PNG</div>  
                            <div className="assets_filter" data-filter="gif">GIF</div>  
                            <div className="assets_filter" data-filter="mp3">MP3</div>  
                        </div>
                        <div className="loaded_assets">
                        
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditorAssetPane;