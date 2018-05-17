
import React, { PureComponent } from 'react'
// import base from '../base'
// import GameView from './GameView'




class EditorDocsPane extends PureComponent {

    state = {
       
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
    }


    render() {
    	return(
        <div className="content_page" id="content_documentation">

						<ul className="doc_side">

						
							<li className="doc_jump" id="jtemplate">Template</li>
							<li className="doc_jump" id="jthing">Thing</li>
							<li className="doc_jump" id="jdraw">Draw</li>
							<li className="doc_jump" id="jgifcontrol">GIF Control</li>
							<li className="doc_jump" id="jrotation">Rotation</li>
							<li className="doc_jump" id="jenvironmental">Environmental</li>
							<li className="doc_jump" id="jinteractions">Interactions</li>
							<li className="doc_jump" id="jinteractionsthings">Interactions w/ Things</li>
							<li className="doc_jump" id="jlines">Lines</li>
							<li className="doc_jump" id="jgameover">Game Over</li>
							<li className="doc_jump" id="jtimer">Timers</li>
							<li className="doc_jump" id="jrbackgrounds">Repeated Backgrounds</li>
							<li className="doc_jump" id="janimations">Animations</li>
							<li className="doc_jump" id="joscillations">Oscillations</li>
							<li className="doc_jump" id="jsound">Sound</li>
							<li className="doc_jump" id="jgravity">Behavior: Physics</li>
							<li className="doc_jump" id="jcollision">Behavior: Collision</li>
							<li className="doc_jump" id="jmagnet">Behavior: Magnet</li>
							<li className="doc_jump" id="jspring">Behavior: Spring</li>
							<li className="doc_jump" id="jcircular">Behavior: Circular Path</li>
							<li className="doc_jump" id="jfollow">Behavior: Follow</li>
							<li className="doc_jump" id="jtext">Text</li>
							<li className="doc_jump" id="jmath">The Goods (AKA Math)</li>
							<li className="doc_jump" id="jglobals">Globals</li>
							<li className="doc_jump" id="jcallbacks">Callbacks</li>
							<li className="doc_jump" id="jaccelerometer">Device Accelerometer</li>
						</ul>

						






<div className="doc_block jtemplate">
	<div className="doc_row" id="j_jtemplate">
		<span className="doc_section_title">
		Template
		</span>
	</div>

	<div className="doc_list_top">
		Below is the template (boilerplate) code for fV. 
		This is what you will see each time you begin a new game.
		Feel free to delete the code you don't need, just don't delete what is white.
	</div>

	<div className="doc_pad">

		<div>
		<span>//_____________________________________________ variables</span><br/>
		<span>// define all your variables here</span><br/><br/>
		<span>//_____________________________________________ setup (called once)</span><br/>
		<span>

		{`function setup(){`}<br/>
		{`fV_env_orientation("landscape");`} <span>//landscape or portrait</span><br/>
		{`fV_env_game_duration(25);`} <span>//5,15,25</span><br/>
		{`fV_env_game_timer_location("top");`} <span>//top or bottom</span><br/>
		{`}`}</span><br/><br/>
		<span>//_____________________________________________ update (called perpetually)</span><br/>
		<span>function update(){}</span><br/><br/>
		<span>//_____________________________________________ draw (called perpetually)</span><br/>
		<span>function draw(){}</span><br/><br/>
		<span>//_____________________________________________ interactions (called as events)</span><br/>
		function event_tap(x,y){}<br/>
		function event_swipe(x1,y1,x2,y2,vx,vy,time){}<br/>
		function event_drag(x,y){}<br/>
		<span>// more interactions available in the docs</span><br/><br/>
		<span>//_____________________________________________ interactions with things (called as events)</span><br/>
		function event_tap_thing(thing_uid,x,y){}<br/>
		function event_drag_thing(thing_uid,x,y){}<br/>
		function event_launch_thing(thing_uid,vx,vy){}<br/>
		<span>// more interactions with things available in the docs</span><br/><br/>
		<span>//_____________________________________________ callbacks</span><br/>
		function callback_timer(timer_uid){}<br/>
		function callback_animation_done(thing_uid){}<br/>
		<span>// more callbacks available in the docs</span><br/>
		</div>

		<div className="doc_list"><span className="bbb">Variables</span>&nbsp; Define all your variables here. Do NOT include any code or function calls here.</div>
		<div className="doc_list"><span className="bbb">Setup</span> (called once). Specify your environmental stuff and various setup code.</div>
		<div className="doc_list"><span className="bbb">Update</span> (called perpetually). All your calculations, checks, code, etc. that need to run each loop should be done here.</div>
		<div className="doc_list"><span className="bbb">Draw</span> (called perpetually). Draw everything here. Draw layering is top to bottom (last thing drawn is ontop).</div>
		<div className="doc_list"><span className="bbb">Interactions</span> (called as events). Called when interactions occurs.</div>
		<div className="doc_list"><span className="bbb">Interactions With Things</span> (called as events). Called when interaction with a thing occurs.</div>
		<div className="doc_list"><span className="bbb">Callbacks</span>&nbsp; Various helpful callback functions. Many more can be found in the documentation.</div>

	</div>
</div>






<div className="doc_block jthing">

	<div className="doc_row" id="j_jthing">
		<span className="doc_section_title">
			Thing
		</span> 
	</div>

	<div className="doc_list_top">Things are the core of fV.</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create</span>&nbsp; A thing can be created either as a primitive shape, a static image, or an animated GIF. A thing can take the shape of either a rectangle or a circle.</div>
			<div className="doc_list_sub">A thing (primitive rectangle)</div>
			<pre>var myThing = fV_thing(_x,_y,_width,_height,"rectangle");</pre>
			<div className="doc_list_sub">A thing (image as rectangle). Set _width or _height to "auto" to use an image's native dimensions.</div>
			<pre>var myThing = fV_thing(_x,_y,_width,_height,"rectangle","somefile.png");</pre>
			<div className="doc_list_sub">A thing (image as circle). Circles will use _width to define diameter (set _height to whatever).</div>
			<pre>var myThing = fV_thing(_x,_y,_width,_height,"circle","somefile.png");</pre>
			<div className="doc_list_sub">A thing (GIF as rectangle). Set _width or _height to "auto" to use an image's native dimensions.</div>
			<pre>var myThing = fV_thing(_x,_y,_width,_height,"rectangle","somefile.gif");</pre>

			<div className="doc_list"><span className="bbb">Set Position</span>&nbsp;</div>
			<pre>myThing.fV_set_position(_x,_y);</pre>
			<pre>myThing.fV_set_x(_x);</pre>
			<pre>myThing.fV_set_y(_y);</pre>
			
			<div className="doc_list"><span className="bbb">Set Size</span>&nbsp;</div>
			<pre>myThing.fV_set_size(_width,_height);</pre>
			<pre>myThing.fV_set_width(_width);</pre>
			<pre>myThing.fV_set_height(_height);</pre>
			

			
			<div className="doc_list"><span className="bbb">Set Velocity</span>&nbsp;</div>
			<pre>myThing.fV_set_velocity(_vx,_vy);</pre>
			<pre>myThing.fV_set_velocity_x(_vx);</pre>
			<pre>myThing.fV_set_velocity_y(_vy);</pre>
			<pre>myThing.fV_set_velocity_magnitue(_vm);</pre>

			<div className="doc_list"><span className="bbb">Set Rotation</span>&nbsp; (More details in rotation section)</div>
			<pre>myThing.fV_rotate(_r,_u);</pre>
			<pre>myThing.fV_set_angle(_r,_u);</pre>
			<pre>myThing.fV_set_angular_velocity(_av,_u);</pre>
			
			<div className="doc_list"><span className="bbb">Set Flip</span>&nbsp; Things will go wacky if you combine flip with rotate (I think...)</div>
			<pre>myThing.fV_set_flip(_x,_y);</pre>

			<div className="doc_list"><span className="bbb">Set Coincide Padding</span>&nbsp; _px and _py are the percent value of padding used for many math calculations [0.0-1.0]. If _px is set to 0.20 the width used for calculations is 20% less than the original width. For circles you only have to set _px, leave _py at 0.</div>
			<pre>myThing.fV_set_padding(_px,_py);</pre>

			<div className="doc_list"><span className="bbb">Update Faux Velocity</span>&nbsp; If you are moving something manually it wont have a velocity. That is not good! Call this function in update to give your thing a velocity. You may need this velocity for collisions to behave realistically. </div>
			<pre>myThing.fV_update_faux_velocity();</pre>

			<div className="doc_list"><span className="bbb">Destroy</span>&nbsp; It is good practice to destroy things when they go offscreen.</div>
			<pre>myThing.fV_destroy();</pre>

			<div className="doc_list"><span className="bbb">Vertices</span>&nbsp; Returns an array of objects. Rectangles have 4 vertices and circles have 8. _padding [true/false] if you want to include coincide padding.</div>
			<pre>myThing.fV_get_vertices(_use_padding);</pre>

			<div className="doc_list"><span className="bbb">Out Of View</span>&nbsp; Returns true if thing is out of the games view window.</div>
			<pre>myThing.fV_get_out_of_view();</pre>

			<div className="doc_list"><span className="bbb">Getters</span>&nbsp; You can access a things variables with basic dot notation. NEVER use dot notation to set values.</div>
			<pre>myThing.x</pre>
			<pre>myThing.y</pre>
			<pre>myThing.width</pre>
			<pre>myThing.height</pre>
			<pre>myThing.rotation_d</pre>
			<pre>myThing.rotation_r</pre>
			<pre>myThing.angular_velocity</pre>
			<pre>myThing.vx</pre>
			<pre>myThing.vy</pre>
			<pre>myThing.vm</pre>

	</div>
</div>






<div className="doc_block jdraw">
	<div className="doc_row" id="j_jdraw">
		<span className="doc_section_title">
			Draw
		</span>
	</div>

	<div className="doc_list_top">Use these inside the draw() loop to draw things or specify colors and transparency.</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Draw A Thing</span>&nbsp; Will draw at _x,_y,_width,_height as set by user or as calculated by the backend.</div>
		<pre>myThing.fV_draw();</pre>

		<div className="doc_list"><span className="bbb">Fill Color</span>&nbsp; Sets the fill color for a primitive (rectangle, circle) shape, text, or line.</div>
		<pre>fV_fill_color(_r,_g,_b);</pre>

		<div className="doc_list"><span className="bbb">Background Color</span>&nbsp; Fills the background with color.</div>
		<pre>fV_background_color(_r,_g,_b);</pre>

		<div className="doc_list"><span className="bbb">Transparency</span>&nbsp; Sets the transpareny of everything drawn thereafter.</div>
		<pre>fV_alpha(_a);</pre>

		<div className="doc_list"><span className="bbb">Draw Between Points</span>&nbsp; Will draw a rectangle between two points. An easy alternative to drawing a rectangle then trying to rotate it.</div>
		<pre>myThing.fV_draw_between_points(_px1,_py1,_px2,_py2,_height);</pre>
		
	</div>



</div>






<div className="doc_block jgifcontrol">
	<div className="doc_row" id="j_jgifcontrol">
		<span className="doc_section_title">
			GIF Control
		</span>
	</div>

	<div className="doc_list_top">If your thing is a GIF, use these controls!</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Set Speed</span>&nbsp; [-1.0 to 1.0]. A speed of 0 is pause.</div>
		<pre>myThing.fV_set_gif_speed(_s);</pre>

		<div className="doc_list"><span className="bbb">Set Frame</span>&nbsp; Set the frame.</div>
		<pre>myThing.fV_set_gif_frame(_f);</pre>

		<div className="doc_list"><span className="bbb">Set In/Out</span>&nbsp; Set the in-frame and out-frame.</div>
		<pre>myThing.fV_set_gif_in(_i);</pre>
		<pre>myThing.fV_set_gif_out(_o);</pre>

		<div className="doc_list"><span className="bbb">Set Playback</span>&nbsp; _p can be ['forwards', 'backwards', 'wiggle'].</div>
		<pre>myThing.fV_set_gif_playback(_p);</pre>

	</div>

</div>






<div className="doc_block jrotation">
	<div className="doc_row" id="j_jrotation">
		<span className="doc_section_title">
			Rotation
		</span>
	</div>

	<div className="doc_list_top">Rotate things in many different ways either with radians or degrees.</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Set Angle</span>&nbsp; Rotate to an absolute position. _unit is "d" for dregrees and "r" for radians.</div>
		<pre>myThing.fV_set_angle(_val,_unit);</pre>

		<div className="doc_list"><span className="bbb">Rotate</span>&nbsp; Rotate relative to existing rotation. _unit is "d" for dregrees and "r" for radians.</div>
		<pre>myThing.fV_rotate(_val,_unit);</pre>

		<div className="doc_list"><span className="bbb">Set Angular Velocity</span>&nbsp; Rotate at a constant speed. _unit is "d" for dregrees and "r" for radians.</div>
		<pre>myThing.fV_set_angular_velocity(_val,_unit);</pre>

		<div className="doc_list"><span className="bbb">Get Angle</span>&nbsp; In dergees</div>
		<pre>myThing.fV_get_angle_d();</pre>

		<div className="doc_list"><span className="bbb">Get Angle</span>&nbsp; In radians</div>
		<pre>myThing.fV_get_angle_r();</pre>

		<div className="doc_list"><span className="bbb">Radians/Degrees Convert</span>&nbsp; Convert radians to degrees or degrees to radians.</div>
		<pre>r_to_d(_r);</pre>
		<pre>d_to_r(_d);</pre>

		<div className="doc_list"><span className="bbb">Max Angular Velocity</span>&nbsp; [?-?] When using physics and collisions things may tend to rotate wildly, so it can be useful to set a max angular velocity.</div>
		<pre>myThing.fV_set_max_angular_velocity(_val);</pre>

	</div>


</div>






<div className="doc_block jenvironmental">
	<div className="doc_row" id="j_jenvironmental">
		<span className="doc_section_title">
			Environmental
		</span>
	</div>

	<div className="doc_list_top">Put these in the setup() part of the template.</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Orientation</span>&nbsp; Must be included and _orientation can be ["landscape" or "portrait"]</div>
		<pre>fV_env_orientation(_orientation);</pre>

		<div className="doc_list"><span className="bbb">Duration</span>&nbsp; Seconds the gameplay lasts. Must be include and be one of the following: [5, 15, 25]. "Infinity" can be used for publication to Learn.</div>
		<pre>fV_env_game_duration(_duration);</pre>

		<div className="doc_list"><span className="bbb">Timer Location</span>&nbsp; _tb can be ["top" or "bottom"].</div>
		<pre>fV_env_game_timer_location(_tb);</pre>

		<div className="doc_list"><span className="bbb">Show Outlines</span>&nbsp; If _bool is true, will draw a RED rectangle around every 'thing'. Default is false.</div>
		<pre>fV_env_show_outlines(_bool);</pre>

		<div className="doc_list"><span className="bbb">Show Padded Outlines</span>&nbsp; If _bool is true, will draw a BLUE rectangle around every 'thing' in which coincide padding is set. Default is false.</div>
		<pre>fV_env_show_padded_outlines(_bool);</pre>

		<div className="doc_list"><span className="bbb">Show Physics Outlines</span>&nbsp; If _bool is true, will draw a PURPLE rectangle around every 'thing' which has gravity or collision enabled. Default is false. Helpful for debugging and physics.</div>
		<pre>fV_env_show_physics_outlines(_bool);</pre>

		<div className="doc_list"><span className="bbb">Environmental Gravity</span>&nbsp; Gravity works on things with physics behavior. If _gy is set to 1 this is typical gravitational behavior.</div>
		<pre>fV_env_gravity(_gx,_gy);</pre>

		<div className="doc_list"><span className="bbb">Screen Boundaries As Walls</span>&nbsp; Optional helper to set the bounds of the screen as physics 'walls'. An optional parameter to specify the restitution (bounce) of the walls exists. If no bounce argument is supplied, 1.0 (full bounce) is the default. To change the properties of walls or check for collisions individually, use the WALL_TOP, WALL_RIGHT, WALL_LEFT, and WALL_BOTTOM globals, respectively.</div>
		<pre>fV_walls(_bool_top,_bool_right,_bool_bottom,_bool_left,_bounce);</pre>

	</div>

</div>






<div className="doc_block jinteractions">
	<div className="doc_row" id="j_jinteractions">
		<span className="doc_section_title">
			Interactions
		</span> 
	</div>

	<div className="doc_list_top">It's all about interaction! Use these for any interaction that is not attached to an individual thing.</div>

	<div className="doc_pad">

		<div className="doc_list_sub"><span className="bbb">Tap</span>&nbsp; Finger tap.</div>
		<pre>event_tap(x,y){}</pre>

		<div className="doc_list_sub"><span className="bbb">Swipe</span>&nbsp; vx and vy are the velocity of the swipe. Time is the duration of the swipe interaction. </div>
		<pre>event_swipe(x1,y1,x2,y2,vx,vy,time){}</pre>

		<div className="doc_list_sub"><span className="bbb">Drag</span>&nbsp; Finger is being dragged.</div>
		<pre>event_drag(x,y){}</pre>

		<div className="doc_list_sub"><span className="bbb">Down</span>&nbsp; Finger is down.</div>
		<pre>event_down(x,y){}</pre>

		<div className="doc_list_sub"><span className="bbb">Up</span>&nbsp; Finger is up.</div>
		<pre>event_up(x,y){}</pre>

		<div className="doc_list_sub"><span className="bbb">Trigger Up</span>&nbsp; Sometimes it is useful to trigger finger up.</div>
		<pre>trigger_up();</pre>

	</div>

</div>






<div className="doc_block jinteractionsthings">
	<div className="doc_row" id="j_jinteractionsthings">
		<span className="doc_section_title">
			Interaction With Things
		</span> 
	</div>

	<div className="doc_list_top">Make a thing tappable, draggable, or launchable.</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Tappable</span>&nbsp; Make a thing tappable. Can pass a single thing or an array of things.</div>
		<pre>fV_tappable(myThing);</pre>
		<pre>fV_tappable([myThing1,myThing2,myThing3,...]);</pre>
		<div className="doc_list_sub">Tappable Event. Called every time thing is tapped. Unique id passed to identify which thing.</div>
		<pre>function event_tap_thing(thing_uid,x,y){}</pre>

		<div className="doc_list"><span className="bbb">Draggable</span>&nbsp; Make a thing draggable.</div>
		<pre>fV_draggable(myThing);</pre>
		<pre>fV_draggable([myThing1,myThing2,myThing3,...]);</pre>
		<div className="doc_list_sub">Draggable Events. Unique id passed to identify which thing. Note that drag_start and drag_end are not included in the template by default.</div>
		<pre>function event_drag_thing(thing_uid,x,y){}</pre>
		<pre>function event_drag_start_thing(thing_uid,x,y){}</pre>
		<pre>function event_drag_end_thing(thing_uid,x,y){}</pre>

		<div className="doc_list"><span className="bbb">Launchable</span>&nbsp; Make a thing launchable.</div>
		<pre>fV_launchable(myThing);</pre>
		<pre>fV_launchable([myThing1,myThing2,myThing3,...]);</pre>
		<div className="doc_list_sub">Launch Event. Called every time thing is launched. Unique id passed to identify which thing.</div>
		<pre>function event_launch_thing(thing_uid,vx,vy){}</pre>

	</div>


</div>






<div className="doc_block jtimer">
	<div className="doc_row" id="j_jtimer">
		<span className="doc_section_title">
			Timers
		</span> 
	</div>

	<div className="doc_list_top">Set a timer or repeating timer. A timer will cause callback_timer() to be called after a specific duration.</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create Basic Timer</span>&nbsp; Create a basic timer.</div>
		<pre>myTimer = fV_timer(_duration);</pre>
		
		<div className="doc_list"><span className="bbb">Create Repeating Timer</span>&nbsp; Create a repeating timer.</div>
		<pre>myTimer = fV_timer_repeating(_duration,true);</pre>

		<div className="doc_list"><span className="bbb">Start</span>&nbsp; Start the timer. Important!</div>
		<pre>myTimer.fV_start();</pre>

		<div className="doc_list"><span className="bbb">Get Progress</span>&nbsp; Get the timer progress.</div>
		<pre>myTimer.fV_get_pct();</pre>

		<div className="doc_list"><span className="bbb">Clear</span>&nbsp; Clear the timer.</div>
		<pre>myTimer.fV_clear();</pre>

		<div className="doc_list"><span className="bbb">Pause/Resume</span>&nbsp; Pause the timer. Resume the timer after pause.</div>
		<pre>myTimer.fV_pause();</pre>
		<pre>myTimer.fV_resume();</pre>

		<div className="doc_list"><span className="bbb">Restart</span>&nbsp; Basic timers can be restarted.</div>
		<pre>myTimer.fV_restart();</pre>

		<div className="doc_list"><span className="bbb">Callback Done</span>&nbsp; A callback event when the timer completes (included in template). Compare timer_uid with myTimer.uid to see which timer has ended.</div>
		<pre>function callback_timer(timer_uid){}</pre>

	</div>

</div>






<div className="doc_block jgameover">
	<div className="doc_row" id="j_jgameover">
		<span className="doc_section_title">
			Game Over
		</span> 
	</div>

	<div className="doc_list_top">Games durations can be set to be 5, 10, or 15 seconds. You can win or loose the game at any moment. fV_game_over(GAME_OVER_STATE) is automatically called when time is up.</div>

	<div className="doc_pad">
		<div className="doc_list"><span className="bbb">Game Over</span>&nbsp; _success can be [true or false]. Call this to end the game with success or fail.</div>
		<pre>fV_game_over(_success);</pre>
	</div>

	<div className="doc_pad">
		<div className="doc_list"><span className="bbb">Game Over State</span>&nbsp; In some cases you can succeed at a game by simply not dying. For this, set GAME_OVER_STATE to true. GAME_OVER_STATE is false by default.</div>
		<pre>GAME_OVER_STATE = true;</pre>
	</div>

</div>






<div className="doc_block jlines">
	<div className="doc_row" id="j_jlines">
		<span className="doc_section_title">
			Lines
		</span> 
	</div>

	<div className="doc_list_top">
		Lines are purely visual. They cannot add interactions or behaviors attached to them. 
		If you need lines that have interactions or behaviors, just create a thing that is a primitive rectangle.
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create</span>&nbsp; Create a line between two points. _weight defines the thickness of the line.</div>
		<pre>var myLine = fV_line(_x1,_y1,_x2,_y2,_weight);</pre>

		<div className="doc_list"><span className="bbb">Draw</span>.</div>
		<pre>myLine.fV_draw();</pre>

		<div className="doc_list"><span className="bbb">Set Weight</span>&nbsp; Set line thickness.</div>
		<pre>myLine.fV_set_weight(_weight);</pre>

		<div className="doc_list"><span className="bbb">Set Position</span>&nbsp; Set both points of the line.</div>
		<pre>myLine.fV_set_position(_x1,_y1,_x2,_y2);</pre>

		<div className="doc_list"><span className="bbb">Set Start Point</span>&nbsp; Set only the starting point of the line.</div>
		<pre>myLine.fV_set_start_point(_x1,_y1);</pre>

		<div className="doc_list"><span className="bbb">Set End Point</span>&nbsp; Set only the ending point of the line.</div>
		<pre>myLine.fV_set_end_point(_x2,_y2);</pre>

		<div className="doc_list"><span className="bbb">Getters</span>&nbsp; Get points.</div>
		<pre>myLine.x1</pre>
		<pre>myLine.y1</pre>
		<pre>myLine.x2</pre>
		<pre>myLine.y2</pre>

	</div>

</div>






<div className="doc_block jrbackgrounds">
	<div className="doc_row" id="j_jrbackgrounds">
		<span className="doc_section_title">
			Repeating Backgrounds
		</span> 
	</div>

	<div className="doc_list_top">
		Seamless scrolling backgrounds. Add multiples if you want that cliche parallax effect. 
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create</span>&nbsp; _orientation can be ["horizontal" or "vertical"]. _speed can be positive or negative [?-?]. _width and _height are the amount of space that the image will take. the images themselves use their own dimenions. Note, only JPG and PNG allowed.</div>
		<pre>myBackground = fV_repeating_background(_x,_y,_width,_height,_orientation,_speed,_img);'</pre>

		<div className="doc_list"><span className="bbb">Draw</span>&nbsp; You will likely want to draw backgrounds first so they are on the backmost layer. </div>
		<pre>myBackground.fV_draw();</pre>

		<div className="doc_list"><span className="bbb">Set Speed</span>&nbsp;  _speed can be positive or negative [?-?] (0 is pause). </div>
		<pre>myBackground.fV_set_speed(_s);</pre>

		<div className="doc_list"><span className="bbb">Destroy</span>.</div>
		<pre>myBackground.destroy();</pre>

	</div>
</div>






<div className="doc_block janimations">
	<div className="doc_row" id="j_janimations">
		<span className="doc_section_title">
			Animations
		</span>
	</div>

	<div className="doc_list_top">
		Animate things: x, y, position, width, height, scale, radius, rotation. callback_animation_done() will be called when animation completes. 
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Animate x</span>.</div>
		<pre>fV_animate_x(_thing,_x,_duration,_easing);</pre>

		<div className="doc_list"><span className="bbb">Animate y</span>.</div>
		<pre>fV_animate_y(_thing,_y,_duration,_easing);</pre>

		<div className="doc_list"><span className="bbb">Animate Position</span>.</div>
		<pre>fV_animate_position(_thing,_x,_y,_duration,_easing);</pre>

		<div className="doc_list"><span className="bbb">Animate Width (or Radius)</span>.</div>
		<pre>fV_animate_width(_thing,_width,_duration,_easing);</pre>

		<div className="doc_list"><span className="bbb">Animate Height</span>.</div>
		<pre>fV_animate_height(_thing,_height,_duration,_easing);</pre>

		<div className="doc_list"><span className="bbb">Animate Scale</span>&nbsp; Scale to a factor relative of the current size. For example if _scale is 3.0, the thing will be three times the current size.</div>
		<pre>fV_animate_scale(_thing,_scale,_duration,_easing);</pre>

		<div className="doc_list"><span className="bbb">Animate Rotate</span>&nbsp; _rotation [?-?]. _units should be ["d" or "r"]. _abs_or_rel should be ["asbolute" or "relative"]. _direction is optional and can be ["cw", "ccw", "quick"] clockwise, counter clockwise, or quickest. Default is quickest.</div>
		<pre>fV_animate_rotate(_obj,_rotation,_units,_abs_or_rel,_duration,_easing,_direction[optional]);</pre>

		<div className="doc_list"><span className="bbb">Animation Done</span>&nbsp; Called each time an animation is complete. animation_type can be "x", "y", "position", "width", "height", "scale", "rotate".</div>
		<pre>function callback_animation_done(thing_uid,animation_type){}</pre>

	</div>

	
</div>






<div className="doc_block joscillations">
	<div className="doc_row" id="j_joscillations">
		<span className="doc_section_title">
			Oscillations 
		</span>
	</div>

	<div className="doc_list_top">
		Oscillate things: x, y, position, width, height, scale, circular path.
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Oscillate X</span>.</div>
		<pre>fV_oscillate_x(_thing,_amplitue,_duration);</pre>

		<div className="doc_list"><span className="bbb">Oscillate Y</span>.</div>
		<pre>fV_oscillate_y(_thing,_amplitue,_duration);'</pre>

		<div className="doc_list"><span className="bbb">Oscillate Width (or Radius)</span>&nbsp; Note, width will not go negative.</div>
		<pre>fV_oscillate_width(_thing,_amplitue,_duration);</pre>

		<div className="doc_list"><span className="bbb">Oscillate Height</span>&nbsp; Note, height will not go negative.</div>
		<pre>fV_oscillate_height(_thing,_amplitue,_duration);</pre>

		<div className="doc_list"><span className="bbb">Oscillate Scale</span>&nbsp; Note, scale will not go negative. _amplitude is [?-?]</div>
		<pre>fV_oscillate_scale(_thing,_amplitue,_duration);'></pre>

	</div>
</div>










<div className="doc_block jsound">
	<div className="doc_row" id="j_jsound">
		<span className="doc_section_title">
			Sounds
		</span> 
	</div>

	<div className="doc_list_top">
		Use MP3s or basic blip oscillators to generate sounds. 
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create MP3 Sound</span>.</div>
		<pre>var mySound = fV_sound("somefile.mp3");</pre>

		<div className="doc_list"><span className="bbb">Play MP3 Sound</span>.</div>
		<pre>mySound.fV_play();</pre>

		<div className="doc_list"><span className="bbb">Stop MP3 Sound</span>.</div>
		<pre>mySound.fV_stop();</pre>

		<div className="doc_list"><span className="bbb">Pause MP3 Sound</span>.</div>
		<pre>mySound.fV_pause();</pre>

		<div className="doc_list"><span className="bbb">Volume MP3 Sound</span>&nbsp; _volume [0.1 to 1.0]</div>
		<pre>mySound.fV_volume(_volume);</pre>

		<div className="doc_list"><span className="bbb">Create Blip Sound</span>&nbsp; _freq is the frequency [100 to 1000]. _duration [50 to 1000]. _volume [0.1 to 1.0]</div>
		<pre>var myBlip = fV_blip(_freq,_duration,_volume);</pre>

		<div className="doc_list"><span className="bbb">Change frequency of Blip Sound</span>.</div>
		<pre>myBlip.fV_set_frequency(_freq);</pre>

		<div className="doc_list"><span className="bbb">Play Blip Sound</span>.</div>
		<pre>myBlip.fV_play();</pre>

		<div className="doc_list"><span className="bbb">Stop All Sounds</span>&nbsp; Stops every MP3 and blip sound.</div>
		<pre>fV_stop_all_sounds();</pre>

	</div>
</div>






<div className="doc_block jgravity">
	<div className="doc_row" id="j_jgravity">
		<span className="doc_section_title">
			Behavior: Physics
		</span> 
	</div>

	<div className="doc_list_top">
		With physics behavior you can apply gravity, forces and air friction to things. 
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Enable Physics</span>&nbsp; You can pass a single thing or an array of things.</div>
		<pre>fV_behavior_physics(_thing);</pre>
		<pre>fV_behavior_physics([_thing1,_thing2,_thing3]);</pre>

		<div className="doc_list"><span className="bbb">Set Gravity</span>&nbsp; Gravity is disabled by default. Set _bool to true to enable gravity on the thing.</div>
		<pre>myThing.fV_gravity(_bool);</pre>

		<div className="doc_list"><span className="bbb">Environmental Gravity</span>&nbsp; If _gy is set to 1 this is typical gravity.</div>
		<pre>fV_env_gravity(_gx,_gy);</pre>

		<div className="doc_list"><span className="bbb">Set Air Friction</span>&nbsp; How much resistance from air. [0-1.0]. Default is 0, meaning there is no air friction.</div>
		<pre>myThing.fV_set_air_friction(_af);</pre>

		<div className="doc_list"><span className="bbb">Set Force</span>&nbsp; Apply a force to a thing.</div>
		<pre>myThing.fV_apply_force(_fx,_fy);</pre>

		<div className="doc_list"><span className="bbb">Get Force</span>&nbsp; Get the force.</div>
		<pre>myThing.fV_get_force();</pre>
		
	
		<pre>myThing.fV_set_mass(_m);'> -</pre>

		<div className="doc_list"><span className="bbb">Set Physics Padding</span>&nbsp; Redefine the physics body to a reduced _x percent and _y percent [0.01-0.50]. If _x is set to 0.15 you will have 15% padding in the x dimension. Run fV_env_show_physics_outlines(true); to see the new body outline.</div>
		<pre>myThing.fV_set_physics_paddding(_x,_y);</pre>

		<div className="doc_list"><span className="bbb">Set Fixed</span>&nbsp; Set to _true to prevent things from moving around due to various forces/collisions. If set to true things can still be moved manually.</div>
		<pre>myThing.fV_set_fixed(_bool);</pre>

		<div className="doc_list"><span className="bbb">Set Rotate Freely</span>&nbsp; Can be [true/false]. Set to _false if you want to prevent body from rotating.</div>
		<pre>myThing.fV_set_rotate_freely(_bool);</pre>

		<div className="doc_list"><span className="bbb">Remove Physics</span>&nbsp; </div>
		<pre>fV_behavior_physics_remove(_thing);</pre>

		<div className="doc_list"><span className="bbb">Getters</span>&nbsp; Get forces: x, y and magnitude.</div>
		<pre>myThing.fx</pre>
		<pre>myThing.fy</pre>
		<pre>myThing.fm</pre>
-->
	</div>
</div>






<div className="doc_block jcollision">
	<div className="doc_row" id="j_jcollision">
		<span className="doc_section_title">
			Behavior: Collision
		</span> 
	</div>

	<div className="doc_list_top">
		Collision will create things that collide and deflect with real world physics. 
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create Collision</span>&nbsp; _restitution [0.0-1.0] is the amount of energy maintained during a collision. If set to 1.0 zero energy will be lost. ** Remember when you add collision behavior you also add physics behavior (above). **</div>
		<pre>fV_behavior_collision(_thing,_restitution);</pre>

		<div className="doc_list"><span className="bbb">Callback Collision</span>&nbsp; Automatically called when two things collide</div>
		<pre>function callback_collision(thing1_uid,thing2_uid){}</pre>

		<div className="doc_list"><span className="bbb">Set Restitution</span>&nbsp; Set restitution (how much it bounces) [0-1.0]. Default is 1.0, meaning it looses zero energy on bounce.</div>
		<pre>myThing.fV_set_restitution(_r);</pre>

		<div className="doc_list"><span className="bbb">Set Collision Group</span>&nbsp; _g is an integer that defines the collision group of the thing. Default collision group is 1. </div>
		<pre>myThing.fV_set_collision_group(_g);</pre>

		<div className="doc_list"><span className="bbb">Remove Collision</span>&nbsp; </div>
		<pre>fV_behavior_collision_remove(_thing);</pre>

	</div>

</div>







<div className="doc_block jmagnet">
	<div className="doc_row" id="j_jmagnet">
		<span className="doc_section_title">
			Behavior: Magnet
		</span> 
	</div>

	<div className="doc_list_top">
		Magnets will push or pull other things at a specified radius. 
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create Magnet</span>&nbsp; _force is positive for push [1 to 100]. _force is negative for pull [-1 to -100]. _force is zero for things that experience magnetic force but do not exert it [0]. _radius is the active magnetic field [>0]. _gradient is [true/false] and defines if the magnetic strength acts as a gradient (usually left true). ** Remember when you add magnet behavior you also add physics behavior (above). **</div>
		<pre>fV_behavior_magnet(_thing,_force,_radius,_gradient);</pre>

		<div className="doc_list"><span className="bbb">Set Magnet Force</span>&nbsp;</div>
		<pre>myThing.fV_set_magnet_force(_f);</pre>

		<div className="doc_list"><span className="bbb">Set Magnet Radius</span>&nbsp;</div>
		<pre>myThing.fV_set_magnet_radius(_r);</pre>

		<div className="doc_list"><span className="bbb">Remove Magnet</span>&nbsp;</div>
		<pre>fV_behavior_collision_remove(_thing);</pre>

	</div>
</div>






<div className="doc_block jspring">
	<div className="doc_row" id="j_jspring">
		<span className="doc_section_title">
			Behavior: Spring
		</span> 
	</div>

	<div className="doc_list_top">
		Turn a thing into a spring with a specified anchor point, stiffness, damping, and resting length. 
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create Spring</span> _ax and _ay is the anchor position of the spring. _k is the stiffness [1-10]. _d is the damping [1-10]. _resting is the distance at which the spring is at rest. ** Remember when you add spring behavior you also add physics behavior (above). **</div>
		<pre>fV_behavior_spring(_thing,_ax,_ay,_k,_d,_resting);</pre>

		<div className="doc_list"><span className="bbb">Set Anchor Poisiton</span>&nbsp;</div>
		<pre>myThing.fV_set_spring_anchor(_ax,_ay);</pre>
		<pre>myThing.fV_set_spring_anchor_x(_ax);</pre>
		<pre>myThing.fV_set_spring_anchor_y(_ay);</pre>

		<div className="doc_list"><span className="bbb">Remove Spring</span>&nbsp; </div>
		<pre>fV_behavior_spring_remove(_thing);</pre>

	</div>
</div>




<div className="doc_block jcircular">
	<div className="doc_row" id="j_jcircular">
		<span className="doc_section_title">
			Behavior: Circular Path
		</span> 
	</div>

	<div className="doc_list_top">
		Thing will move around a circual path specified by the direction, speed, and center position.
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create Circual Path</span> _cx and _cy are the center of the circle. _speed is in rad/s and positive for clockwise and negative for counterclockwise [?].</div>
		<pre>fV_behavior_circular_path(_thing,_cx,_cy,_speed);</pre>

		<div className="doc_list"><span className="bbb">Set Center Poisiton</span>&nbsp;</div>
		<pre>myThing.fV_set_circular_path_center(_cx,_cy);</pre>
		<pre>myThing.fV_set_circular_path_center_x(_cx);</pre>
		<pre>myThing.fV_set_circular_path_center_y(_cy);</pre>

		<div className="doc_list"><span className="bbb">Set Speed</span>&nbsp; _s is in rad/s and positive for clockwise and negative for counterclockwise [any value]. </div>
		<pre>myThing.fV_set_circular_path_speed(_s);</pre>

		<div className="doc_list"><span className="bbb">Set Angle</span>&nbsp; Set the angle in radians. </div>
		<pre>myThing.fV_set_circular_path_angle(_a);</pre>

		<div className="doc_list"><span className="bbb">Get Angle</span>&nbsp; Get the angle in radians. </div>
		<pre>myThing.fV_get_circular_path_angle();</pre>

		<div className="doc_list"><span className="bbb">Remove Circular Path</span>&nbsp; </div>
		<pre>fV_behavior_circular_path_remove(_thing);</pre>

	</div>
</div>




<div className="doc_block jfollow">
	<div className="doc_row" id="j_jfollow">
		<span className="doc_section_title">
			Behavior: Follow
		</span> 
	</div>

	<div className="doc_list_top">
		Follow will cause one thing to follow another thing.
	</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create Follower</span> _thing will following _thingf. _speed should be [0.0 to 1.0]. _distance is the distance between _thing and _thingf when following.</div>
		<pre>fV_behavior_follow(_thing,_thingf,_speed,_distance);</pre>

		<div className="doc_list"><span className="bbb">Set Speed</span>&nbsp; _s should be [0.0 to 1.0]. </div>
		<pre>myThing.fV_set_follow_speed(_s);</pre>

		<div className="doc_list"><span className="bbb">Remove Follow</span>&nbsp; </div>
		<pre>fV_behavior_follow_remove(_thing);'></pre>

	</div>
</div>











<div className="doc_block jtext">
	<div className="doc_row" id="j_jtext">
		<span className="doc_section_title">
			Text
		</span> 
	</div>

	<div className="doc_list_top">Just some basic font. We recommend to use text sparingly in microgames.</div>

	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Create</span>&nbsp; Draws a string of text. _size is in pixels. Font options are listed below. Note that fV_fill_color() will define color of text.</div>
		<pre>var myText = fV_text(_x,_y,_font,_size,_string);</pre>

		<div className="doc_list"><span className="bbb">Draw</span>.</div>
		<pre>myText.fV_draw(); </pre>

		<div className="doc_list"><span className="bbb">Set Message</span>&nbsp;</div>
		<pre>myText.fV_set_message(_string); </pre>

		<div className="doc_list"><span className="bbb">Set Size</span>&nbsp;</div>
		<pre>myText.fV_set_size(_s); </pre>

		<div className="doc_list"><span className="bbb">Set Position</span>&nbsp;</div>
		<pre>myText.fV_set_position(_x,_y); </pre>

		<div className="doc_list"><span className="bbb">Set Max Width</span>&nbsp; If this is set, the text will wrap according to this number.</div>
		<pre>myText.fV_set_max_width(_w); </pre>

		<div className="doc_list"><span className="bbb">Set Alignment</span>&nbsp; _a can be ['start','end','left','center','right']. Default is 'center'.</div>
		<pre>myText.fV_set_alignment(_a); </pre>

		<div className="doc_list"><span className="bbb">Font options</span>&nbsp;</div>
		<div className="doc_list_sub"><span className="bbb">"abril": </span>&nbsp; <span className="font_example">Jeff Goldblum is my friend.</span></div>
		<div className="doc_list_sub"><span className="bbb">"arvo": </span>&nbsp; <span className="font_example">Jeff Goldblum is my friend.</span></div>
		<div className="doc_list_sub"><span className="bbb">"bungee": </span>&nbsp; <span className="font_example">Jeff Goldblum is my friend.</span></div>
		<div className="doc_list_sub"><span className="bbb">"corben": </span>&nbsp; <span className="font_example">Jeff Goldblum is my friend.</span></div>
		<div className="doc_list_sub"><span className="bbb">"oswald": </span>&nbsp; <span className="font_example">Jeff Goldblum is my friend.</span></div>
		<div className="doc_list_sub"><span className="bbb">"playfair": </span>&nbsp; <span className="font_example">Jeff Goldblum is my friend.</span></div>
		<div className="doc_list_sub"><span className="bbb">"roboto": </span>&nbsp; <span className="font_example">Jeff Goldblum is my friend.</span></div>
		<div className="doc_list_sub"><span className="bbb">"rubik": </span>&nbsp; <span className="font_example">Jeff Goldblum is my friend.</span></div>
	</div>

</div>





<div className="doc_block jmath">
	<div className="doc_row" id="j_jmath">
		<span className="doc_section_title">
			The Goods
		</span> 
	</div>
	<div className="doc_list_top">
		Some of the most useful functions for game developers. 
	</div>
	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Vertices</span>&nbsp; Returns an array of objects. Rectangles have 4 vertices and circles have 8. _padding [true/false] if you want to include coincide padding.</div>
		<pre>myThing.fV_get_vertices(_padding);</pre>

		<div className="doc_list"><span className="bbb">Coincide</span>&nbsp; Returns true if two things coincide</div>
		<pre>fV_coincide(_thing1,_thing2);</pre>

		<div className="doc_list"><span className="bbb">Set Coincide Padding</span>&nbsp; Set coincide padding (0-1.0). If you pass 0.2 to _top, coincide calculations will be generous by 20% of the height. If you pass (0.25,0.25,0.25,0.25) this would be equivalent to a generosity of 50%.</div>
		<pre>myThing.fV_set_coincide_padding(_top,_right,_bottom,_left);</pre>

		<div className="doc_list"><span className="bbb">Encapsulate</span>&nbsp; Returns true if _thing1 is encapsulated by _thing2.</div>
		<pre>fV_encapsulate(_thing1,_thing2);</pre>

		<div className="doc_list"><span className="bbb">Point Inside</span>&nbsp; Returns true if point is inside thing</div>
		<pre>fV_point_is_inside(_thing,_x,_y);</pre>

		<div className="doc_list"><span className="bbb">Distance Between Points</span></div>
		<pre>fV_distance_between_points(_p1x,_p1y,_p2x,_p2y);</pre>
		
				<div className="doc_list"><span className="bbb">Radians/Degrees Convert</span>&nbsp; Convert radians to degrees and degrees to radians.</div>
		<pre>r_to_d(_r);</pre>
		<pre>d_to_r(_d);</pre>

		<div className="doc_list"><span className="bbb">Angle Between Points</span>&nbsp; _units is "r" for radians and "d" for degrees. </div>
		<pre>fV_angle_between_points(_p1x,_p1y,_p2x,_p2y,_units);</pre>

		<div className="doc_list"><span className="bbb">Line Intersecting Thing</span>&nbsp; Returns true if line intersects thing, else false.</div>
		<pre>fV_line_intersects_thing(_thing,_line);</pre>
		
		<div className="doc_list"><span className="bbb">Intersecting Lines</span>&nbsp; Returns true if lines intersect, else false.</div>
		<pre>fV_intersecting_lines(_line1,_line2);</pre>
		<pre>fV_intersecting_linespts(_l1x1,_l1y1,_l1x2,_l1y2,_l2x1,_l2y1,_l2x2,_l2y2);</pre>

		<div className="doc_list"><span className="bbb">Intersecting Lines Point</span>&nbsp; If lines intersect returns point of intersection as object {`{x:x,y:y}`}, else false.</div>
		<pre>fV_intersecting_lines_point(_line1,_line2);</pre>
		<pre>fV_intersecting_linespts_point(_l1x1,_l1y1,_l1x2,_l1y2,_l2x1,_l2y1,_l2x2,_l2y2);</pre>

		<div className="doc_list"><span className="bbb">Magnitude Vector</span>&nbsp; Returns the magnitude vector as an object {`{x:mx,y:my}`}</div>
		<pre>fV_magnitude(_vx,_vy);</pre>

		<div className="doc_list"><span className="bbb">Random Number</span>&nbsp; Returns a random number between range (inclusive).</div>
		<pre>fV_random(_min,_max);</pre>

	</div>
</div>





<div className="doc_block jglobals">
	<div className="doc_row" id="j_jglobals">
		<span className="doc_section_title">
		Globals
		</span>
	</div>
	<div className="doc_list_top">
		Global variables that you can use in your code.
	</div>
	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Time</span>&nbsp; The number of milliseconds since the start.</div>
		<pre>GAME_MS</pre>

		<div className="doc_list"><span className="bbb">Frames</span>&nbsp; The number of frames since the start. Ideally runs at 60FPS (60 ticks per second).</div>
		<pre>GAME_TICKS</pre>

		<div className="doc_list"><span className="bbb">Width & Height</span>&nbsp; Size of the game window.</div>
		<pre>WIDTH</pre>
		<pre>HEIGHT</pre>

		<div className="doc_list"><span className="bbb">Drawing From The Center</span>&nbsp; By default Things draw from their center point. Change this global to false to draw from the top left corner.</div>
		<pre>DRAW_FROM_CENTER</pre>

		<div className="doc_list"><span className="bbb">Mouse Position</span>&nbsp; Useful during desktop development and testing but clearly no values returned on mobile.</div>
		<pre>MOUSEX</pre>
		<pre>MOUSEY</pre>

		<div className="doc_list"><span className="bbb">Device Accelerometer</span>&nbsp; Readings from a mobile device's accelerometer. If not applicable, these values will return null.</div>
		<pre>DEVICE_ACCELERATION.x</pre>
		<pre>DEVICE_ACCELERATION.y</pre>
		<pre>DEVICE_ACCELERATION.z</pre>

		<div className="doc_list"><span className="bbb">Device Gyroscope</span>&nbsp; Readings from a mobile device's gyroscope. If not applicable, these values will return null. Alpha refers to a device's rotation around its z-axis whereas Gamma refers to left-to-right rotation and Beta is front-to-back rotation.</div>
		<pre>DEVICE_GYROSCOPE.alpha</pre>
		<pre>DEVICE_GYROSCOPE.gamma</pre>
		<pre>DEVICE_ACCELERATION.z</pre>

		<div className="doc_list"><span className="bbb">Screen Boundaries</span>&nbsp; Once activated with fV_walls(), you can access the bounds of your device's screen as physics objects. This is useful if you want to check for collision against a particular wall, for instance.</div>
		<pre>WALL_BOTTOM</pre>
		<pre>WALL_TOP</pre>
		<pre>WALL_LEFT</pre>
		<pre>WALL_RIGHT</pre>

	</div>
</div>





<div className="doc_block jcallbacks">
	<div className="doc_row" id="j_jcallbacks">
		<span className="doc_section_title">
			Callbacks
		</span>
	</div>
	<div className="doc_list_top">
		All callback functions that are called automatically by the fV backend.
	</div>
	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Timer</span>&nbsp; Called when a timer goes off (INCLUDED IN TEMPLATE).</div>
		<pre>callback_timer(timer_uid){}</pre>

		<div className="doc_list"><span className="bbb">Collision</span>&nbsp; Called when two physics bodies collide (INCLUDED IN TEMPLATE).</div>
		<pre>callback_collision(thing1_uid,thing2_uid){}</pre>

		<div className="doc_list"><span className="bbb">Animation Done</span>&nbsp; Called when an animation completes (INCLUDED IN TEMPLATE).</div>
		<pre>callback_animation_done(thing_uid,animation_type){}</pre>

	</div>
</div>



<div className="doc_block jaccelerometer">
	<div className="doc_row" id="j_jaccelerometer">
		<span className="doc_section_title">
			Device Accelerometer
		</span>
	</div>
	<div className="doc_list_top">
		Functions that return information about a mobile device's accelerometer, when applicable. Note that you can read a device's individual x, y, and z accelerometer values by accessing the DEVICE_ACCELERATION global.
	</div>
	<div className="doc_pad">

		<div className="doc_list"><span className="bbb">Get Device Acceleration Magnitude</span>&nbsp; Returns the magnitude of a device's acceleration.</div>
		<pre>fV_get_device_acceleration_magnitude();</pre>
	</div>
</div>








					</div>
        )
    }
}

export default EditorDocsPane;

