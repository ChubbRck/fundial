
import React, { PureComponent } from 'react'
import base from '../base'
// import GameView from './GameView'
import Header from "./Header";
import EditorSidebar from "./EditorSidebar";
import EditorFooter from "./EditorFooter";
import EditorAssetPane from "./EditorAssetPane"
import EditorGettingStartedPane from "./EditorGettingStartedPane"
import EditorCodePane from "./EditorCodePane"
import EditorDocsPane from "./EditorDocsPane"
import EditorExamplesPane from "./EditorExamplesPane"
import EditorSimulatorPane from "./EditorSimulatorPane"
import EditorGamesPane from "./EditorGamesPane"
import Splitter from "./Splitter"


class CreatePage extends PureComponent {

    state = {
        gameTitle: 'Da Best Game',
        gameAuthor: 'Nick Satan',
        loadedGame: null,
        currentGame: null,
        pane: "assets"
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
        this.loadGame("LC-HGA9us7qDDVysSfg")
    }
    
    updateCurrentCode = (newCode) => {
        this.state.currentGame.code = newCode

        //TODO: Trigger 'unsaved' message here
    }

    loadGame = (uid) => {
        this.ref = base.syncState(`games/-${uid}/`, {
            context: this,
            state: 'loadedGame',
            then: () => {
                const {
                    loadedGame: { uid, code, username, name, user, orientation, assets}
                } = this.state
                this.setState({currentGame:Object.assign({}, this.state.loadedGame)}); 
            }
        })
    }

    changePane = (whichPane) =>{
        this.setState({ pane: whichPane })
    }

    render() {
        return !this.state.currentGame ? (
            <div>Loading</div>
    	) : (
    		<div>
                <Header tagline = "Login info here?" />
                <div id = "pane-container">
                    <EditorCodePane game = {this.state.loadedGame} updateCurrentCode = {this.updateCurrentCode}/>
                    <Splitter />
                    {(() => {
                        switch(this.state.pane) {
                            case 'getting-started':
                                return <EditorGettingStartedPane />;
                            case 'assets':
                                return <EditorAssetPane game = {this.state.currentGame} />;
                            case 'docs':
                                return <EditorDocsPane />;
                            case 'examples':
                                return <EditorExamplesPane />;
                            case 'simulator':
                                return <EditorSimulatorPane game = {this.state.currentGame} />;
                            case 'games':
                                return <EditorGamesPane />;
                            default:
                                return null;
                        }
                    })()}


                  
                    
                    
                  
                </div>
                <EditorSidebar changePane = {this.changePane} />
                <EditorFooter />
    		</div>
    	);
    }
}

export default CreatePage;