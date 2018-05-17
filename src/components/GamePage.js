
import React, { PureComponent } from 'react'
import base from '../base'
import GameView from './GameView'
import Header from "./Header";
import ShareSidebar from "./ShareSidebar";
import AuthorSidebar from "./AuthorSidebar";



class GamePage extends PureComponent {

    state = {
        gameTitle: 'Da Best Game',
        gameAuthor: 'Nick Satan',
        game: null,
        plays: 0
        
    }

    componentDidMount() {
        this.ref = base.syncState(`games/-${this.props.match.params.gameId}/`, {
            context: this,
            state: 'game',
            then: () => {
                const {
                    game: { uid, code, username, name, user, orientation}
                } = this.state
            }
        })
    }




     componentWillUnmount() {
        base.removeBinding(this.ref)
    }

    playNext = (_success) =>{
        console.log("game replayed!")
        var newPlays = this.state.plays + 1;
        this.setState({ plays: newPlays })
    }

    changeGame = (uid) => {
        console.log("changing games!")
        this.ref = base.syncState(`games/-${uid}/`, {
            context: this,
            state: 'game',
            then: () => {
                const {
                    game: { uid, code, username, name, user, orientation}
                } = this.state
                var newPlays = this.state.plays + 1;
                this.setState({ plays: newPlays })
            }
        })

     
    }

    render() {

        const { game } = this.state
        return !game ? (
            <div>Loading</div>
        ) : (

    	
    		<div>	
    			<Header tagline = "Login info here?" />
                <div className = "pageContainer">
                    <AuthorSidebar username = {this.state.game.username} user = {this.state.game.user} gameTitle = {this.state.game.name} />
                    <span className = "gameTitle">{this.state.game.name} by {this.state.game.user}</span>
                    <GameView key = {this.state.plays} gameObj = {this.state.game} playNext = {this.playNext} changeGame = {this.changeGame} />
                    <ShareSidebar />
                    <span className = "newGamePrompt" onClick = {() => this.changeGame("LC-HGA9us7qDDVysSfg")}>Play a different game, chum?</span>
                </div>
            </div>

    	);

    }
}

export default GamePage;