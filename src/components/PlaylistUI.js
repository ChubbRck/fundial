import React, { PureComponent } from 'react'


class PlaylistUI extends PureComponent {

	render() {
		var lives = [];
		for (var i = 0; i < this.props.lives; i++) {
  			lives.push(<div className="lives_block" data-life="1"><img className = "life" src={require("../img/lemming_life.gif")} /></div>);
		}

		return(

			<section id = "playlistUI">
				{lives}
			
			</section>
   
		)
	}
}


export default PlaylistUI;

