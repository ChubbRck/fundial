
import React, { PureComponent } from 'react'
// import base from '../base'
import GameView from './GameView'




class EditorSimulatorPane extends PureComponent {

    state = {
       plays: 0
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
    }


    playNext = () =>{
        console.log("game replayed!")
        var newPlays = this.state.plays + 1;
        this.setState({ plays: newPlays })
    }

    render() {
    	return(
            <div className="content_page" id="content_simulation">

                    <div className="rel">
                        <div className="simulator_head">
                            <img className="sim_button" id="sim_button_stop" data-tid="stop" src="img/stop_1.png" width="30"/>   
                            <img className="sim_button" id="sim_button_reload" data-tid="reload" src="img/reload_1.png"  width="30"/>
                            <div className="simulator_scale">
                                <div className="scale_neg">-</div>
                                <div className="scale_val">0.7</div>
                                <div className="scale_plus">+</div>
                            </div>      
                        </div>
                      
                        <div className="simulator_game">
                            <span className="simulator_game_name"><i>BLANK</i></span>
                            &nbsp;&nbsp;&nbsp; <span className="simulator_game_url"></span>
                            &nbsp;&nbsp;&nbsp; <span><a href="#" className="screencap">Screen Grab</a></span>
                        </div>
                        <div className="simulator_center xycenter">
                          <GameView key = {this.state.plays} playNext = {this.playNext} gameObj = {this.props.game} />
                        </div>

                    </div>

                </div>

        )
    }
}

export default EditorSimulatorPane;