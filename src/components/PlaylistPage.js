
import React, { PureComponent } from 'react'
import base from '../base'
import GameView from './GameView'
import Header from "./Header";
import ShareSidebar from "./ShareSidebar";
import AuthorSidebar from "./AuthorSidebar";
import PlaylistUI from "./PlaylistUI";


class PlaylistPage extends PureComponent {

    state = {
        gameTitle: 'Da Best Game',
        gameAuthor: 'Nick Satan',
        game: null,
        plays: 0,
        currentGame: 0
        
    }

    componentDidMount() {
        this.ref = base.syncState(`playlists/${this.props.match.params.playlistId}/`, {
            context: this,
            state: 'playlist',
            then: () => {
                const {
                    games: games,
                    lives: lives
                } = this.state
                console.log(this.state.playlist)
                this.changeGame(this.state.playlist.games[0])
            }

        })
    }

    componentWillUnmount() {
        base.removeBinding(this.ref)
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

    playNext = (_success) => {
        if (_success){
            if (this.state.currentGame + 1 == this.state.playlist.games.length){
                //playlist is finished
            } else {
                this.state.currentGame += 1;
                this.changeGame(this.state.playlist.games[this.state.currentGame]);
                var newPlays = this.state.plays + 1;
                this.setState({ plays: newPlays })
            }
        } else {
           
            this.state.playlist.lives -=1;
            if (this.state.playlist.lives == 0){
                window.location.reload()
            } else {
                var newPlays = this.state.plays + 1;
                this.setState({ plays: newPlays })
            }
          
        }
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
                    <span className = "gameTitle">Playlist title by GIPHY | Game {parseInt(this.state.currentGame) + 1} of {this.state.playlist.games.length}</span>
                    <span className = "gameTitle">{this.state.game.name} by {this.state.game.user}</span>
                    <GameView key = {this.state.plays} gameObj = {this.state.game} playNext = {this.playNext} changeGame = {this.changeGame} isPlaylist = {true} lives = {this.state.playlist.lives} />
                    <ShareSidebar />
                  
                </div>
            </div>

    	);

    }
}

export default PlaylistPage;