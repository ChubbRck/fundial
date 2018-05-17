
import React, { PureComponent } from 'react'
import Game from '../mg_js/game'
// import Game from '../mg_js/game'
import base from '../base'
import PlaylistUI from "./PlaylistUI";
// import "../js/matter";
// import "../mg_js/_easing";
// import "../mg_js/_functions";
// import "../mg_js/_globals";
// import '../mg_js/_gamelibrary'

const formatId = id => id.replace(/[^\w\s!?]/g, '')
const globalFunctions = [
    'fV_thing',
    'fV_fill_color',
    'fV_env_orientation',
    'fV_env_game_duration',
    'fV_env_game_timer_location',
    'fV_behavior_physics',
    'fV_env_gravity',
    'fV_background_color',
    'fV_line',
    'fV_alpha',
    'fV_behavior_collision',
    'fV_oscillate_x',
    'fV_oscillate_y',
    'fV_launchable'
]

const addScript = (id, code) => {
    const script = document.createElement('script')
    const game = `window.${id}`
    script.type = 'text/javascript'
    script.id = id

    let replacedCode = code
        .replace(/WIDTH/g, `${game}.WIDTH`)
        .replace(/HEIGHT/g, `${game}.HEIGHT`)
        .replace(/function update/g, ';window.gameUpdate = function')
        .replace(/function draw/g, ';window.gameDraw = function')
        .replace(/function click/g, ';window.gameClick = function')
        .replace(/function setup/g, ';window.gameSetup = function')
        .replace(/function event_tap/g, ';window.gameTap = function')
        .replace(/function event_launch_thing/g, ';window.event_launch_thing = function')

    globalFunctions.forEach(string => {
        const regex = new RegExp(string, 'g')
        replacedCode = replacedCode.replace(regex, `${game}.${string.replace('fV_', '')}`)
    })

    script.innerHTML = replacedCode.replace(/fV_/g, '')

    console.log(replacedCode.replace(/fV_/g, ''))

    document.head.appendChild(script)
}

const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

const removeScript = (uid) => {



    var element = document.getElementById(uid);
    element.parentNode.removeChild(element);
}


const activateFullScreen = () => {
    console.log("TOGGLIN!")

 
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    // cancelFullScreen.call(doc);
  }
}


class GameView extends PureComponent {
    

    state = {
        gameTitle: 'Da Best Game',
        gameAuthor: 'Nick Satan',
        game: null,
        begun: false,
        ended: false,
        gameClass: null,
        nextGame: null,
        won: false,
        lost: false,
    }

    componentWillMount(){
        this.setState({game: this.props.gameObj})
    }

    componentDidMount() {
        this.beginGame = this.beginGame.bind(this)
        const id = formatId(this.state.game.uid)
        const code = this.state.game.code
        const gameClass = new Game(this.canvas, code, this.timerBar, this.state.game.orientation, this)
        window[id] = gameClass
        addScript(id, code)
        this.setState({gameClass:gameClass});   
    }

    componentWillUnmount() {
        removeScript(formatId(this.state.game.uid))
        // base.removeBinding(this.ref)
    }

    
    beginGame(){
        if (isMobileDevice()){
            activateFullScreen()
        }
        
        this.setState({ begun: true })
        this.setState({ ended: false })
        //init game here
        // this.props.replayGame();
        this.state.gameClass.init() 
        console.log("searching for element with id " + formatId(this.state.game.uid) )
        var element = document.getElementById(formatId(this.state.game.uid));
        console.log(element)
    }

    gameOver(_success){
        if (_success){
            this.setState({ ended: true });
            this.setState({ won: true });


        }else{
            this.setState({ ended: true });
            this.setState({ lost: true });
        }

    }

    testAlert(){
        alert("WOAH")
    }

    render() {
        const { game } = this.state
        return (
                
                <div className={`gameView ${this.state.game.orientation}`}>
              
                    {this.props.isPlaylist &&
                        <PlaylistUI lives = {this.props.lives}/>
                    }

                    <div className="gameContainer">
                        <div onClick = {this.beginGame.bind(this)} className = {`overlay beginOverlay ${this.state.begun ? 'begun' : 'shown'}`}>
                            <span>CLICK TO BEGIN!</span>
                        </div>
                        <div onClick = {() => this.props.playNext(false)} className = {`overlay gameOverOverlay ${this.state.lost ? 'ended' : 'not-over-yet'} `}>
                            <span>YOU LOSE, BUD</span>
                        </div>
                        <div onClick = {() => this.props.playNext(true)} className = {`overlay gameOverOverlay ${this.state.won ? 'ended' : 'not-over-yet'} `}>
                            <span>WELL DONE CHAMPION!</span>
                        </div>
                        <div id="timerBar" ref={c => (this.timerBar = c)} />
                        <canvas ref={c => (this.canvas = c)} />
                        {/* <Game code={game.code} width={200} height={200} /> */}
                    </div>
                </div>
            


        )
    }
}

export default GameView
