
import React, { PureComponent } from 'react'
// import base from '../base'
// import GameView from './GameView'




class EditorExamplesPane extends PureComponent {

    state = {
       
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
    }


    render() {
    	return(
           <div className="content_page" id="content_examples">

                        <ul className="doc_side">

                            <li className="learn_jump" id="ljdraw">&#10095; Draw</li>
                            <li className="learn_jump" id="ljgifcontrol">&#10095; GIF Control</li>
                            <li className="learn_jump" id="ljrotation">&#10095; Rotation</li>
                            <li className="learn_jump" id="ljenvironmental">&#10095; Environmental</li>
                            <li className="learn_jump" id="ljinteractions">&#10095; Interactions</li>
                            <li className="learn_jump" id="ljinteractionsthings">&#10095; Interactions w/ Things</li>
                            <li className="learn_jump" id="ljlines">&#10095; Lines</li>
                            <li className="learn_jump" id="ljgameover">&#10095; Game Over</li>
                            <li className="learn_jump" id="ljtimer">&#10095; Timers</li>
                            <li className="learn_jump" id="ljrbackgrounds">&#10095; Repeated Backgrounds</li>
                            <li className="learn_jump" id="ljanimations">&#10095; Animations</li>
                            <li className="learn_jump" id="ljoscillations">&#10095; Oscillations</li>
                            <li className="learn_jump" id="ljsound">&#10095; Sound</li>
                            <li className="learn_jump" id="ljgravity">&#10095; Behavior: Physics</li>
                            <li className="learn_jump" id="ljcollision">&#10095; Behavior: Collision</li>
                            <li className="learn_jump" id="ljmagnet">&#10095; Behavior: Magnet</li>
                            <li className="learn_jump" id="ljspring">&#10095; Behavior: Spring</li>
                            <li className="learn_jump" id="ljcircular">&#10095; Behavior: Circular Path</li>
                            <li className="learn_jump" id="ljfollow">&#10095; Behavior: Follow</li>
                            <li className="learn_jump" id="ljtext">&#10095; Text</li>
                            <li className="learn_jump" id="ljmath">&#10095; The Goods (AKA Math)</li>

                            

                        </ul>

                        <div className="learn_grid">
                            <div className="learn_row" id="learn_ljdraw">
                                <div className="learn_title">DRAW</div>
                                <div className="learn_title_sub">Learn how to draw primitives, images and GIFs.</div>
                                <div className="learns_draw learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljgifcontrol">
                                <div className="learn_title">GIF CONTROL</div>
                                <div className="learn_title_sub">Learn how to control GIFs: speed, playback mode, in/out frames, and play/pause.</div>
                                <div className="learns_gif_control learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljrotation">
                                <div className="learn_title">ROTATION</div>
                                <div className="learn_title_sub">Learn absolute/relative rotation, angular velocity, and rotate to angle between points.</div>
                                <div className="learns_rotation learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljenvironmental">
                                <div className="learn_title">ENVIRONMENTAL</div>
                                <div className="learn_title_sub">Learn various environmental settings such as display outlines, oritentation change, timer position, and game duration.</div>
                                <div className="learns_environmental learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljinteractions">
                                <div className="learn_title">INTERACTIONS</div>
                                <div className="learn_title_sub">Learn tap, swipe, and drag interactions.</div>
                                <div className="learns_interactions learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljinteractionsthings">
                                <div className="learn_title">INTERACTIONS W/ THINGS</div>
                                <div className="learn_title_sub">Learn to make things clickable, draggable, and throwable.</div>
                                <div className="learns_interactions_w_things learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljlines">
                                <div className="learn_title">LINES</div>
                                <div className="learn_title_sub">Learn how to draw lines both static and with interactions.</div>
                                <div className="learns_lines learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljgameover">
                                <div className="learn_title">GAME OVER</div>
                                <div className="learn_title_sub">Learn how to end a game, with a success or fail.</div>
                                <div className="learns_game_over learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljtimer">
                                <div className="learn_title">TIMERS</div>
                                <div className="learn_title_sub">Learn how to set a basic or repeating timer as well as many additional timer tricks.</div>
                                <div className="learns_timers learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljrbackgrounds">
                                <div className="learn_title">REPEATING BACKGROUNDS</div>
                                <div className="learn_title_sub">Learn how to draw both horizontal and vertical repeating backgrounds.</div>
                                <div className="learns_repeating_backgrounds learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljanimations">
                                <div className="learn_title">ANIMATIONS</div>
                                <div className="learn_title_sub">Learn how to move, scale, and rotate things with animation.</div>
                                <div className="learns_animations learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljoscillations">
                                <div className="learn_title">OSCILLATIONS</div>
                                <div className="learns_oscillations learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljsound">
                                <div className="learn_title">SOUNDS</div>
                                <div className="learn_title_sub">Learn how to play both MP3 sounds as well as blip sounds.</div>
                                <div className="learns_sounds learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljgravity">
                                <div className="learn_title">BEHAVIOR: PHYSICS</div>
                                <div className="learn_title_sub">Learn how to control gravity as well as apply forces to things.</div>
                                <div className="learns_physics learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljcollision">
                                <div className="learn_title">BEHAVIOR: COLLISIONS</div>
                                <div className="learn_title_sub">Learn how to create physic bodies that collide and bounce off eachother.</div>
                                <div className="learns_collision learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljmagnet">
                                <div className="learn_title">BEHAVIOR: MAGNET</div>
                                <div className="learn_title_sub">Learn how to create physics bodies that attract and repel eachother.</div>
                                <div className="learns_magnet learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljspring">
                                <div className="learn_title">BEHAVIOR: SPRING</div>
                                <div className="learn_title_sub">Learn how to create physics bodies that act as springs.</div>
                                <div className="learns_spring learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljfollow">
                                <div className="learn_title">BEHAVIOR: FOLLOW</div>
                                <div className="learn_title_sub">Learn how to create things that can follow other things.</div>
                                <div className="learns_follow learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljcircular">
                                <div className="learn_title">BEHAVIOR: CIRCULAR</div>
                                <div className="learn_title_sub">Learn how to create things that move along a circular path.</div>
                                <div className="learns_circular_path learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljtext">
                                <div className="learn_title">TEXT</div>
                                <div className="learn_title_sub">Learn how to draw text of various fonts, sizes, alignments, and colors.</div>
                                <div className="learns_text learns"></div>
                            </div>
                            <div className="learn_row" id="learn_ljmath">
                                <div className="learn_title">THE GOODS (AKA MATH)</div>
                                <div className="learn_title_sub">Learn some of the most useful functions for game development.</div>
                                <div className="learns_the_goods learns"></div>
                            </div>
                        </div>

                       

                    </div>
        )
    }
}

export default EditorExamplesPane;