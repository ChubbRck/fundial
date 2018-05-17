
import React, { PureComponent } from 'react'
// import base from '../base'
// import GameView from './GameView'




class EditorGettingStartedPane extends PureComponent {

    state = {
       
    }

    componentDidMount() {
    	// const { params } = this.props.match
    	// alert(params.gameId)
    }


    render() {
    	return(
           <div className="content_page" id = "content_getting_started">
						<div className = "pane-container">
							<h1>Welcome to GIPHY Gamemaka!</h1>

							<img src = {require("../img/getting-started.gif")}/><p><b>GIPHY Gamemaka</b> is a one-stop shop for making quick microgames using GIPHY’s vast sticker and GIF library to share with your friends and the world… all in your web browser!</p>

							<p>If you're a developer, you should at feel right at home with our Javascript-based microgame library, but if you're not a developer, fear not! You can still remix and tweak existing games to make and share your own creations to your heart's content. It's easy and fun to remix games with Stickers and GIFs from GIPHY so give it a try! We've loaded up your browser with the code to a simple game called XXXX (that's that stuff on the left side of the screen). Try clicking the  <a href = "" id = "simulation">RUN</a> button on the right pane. When you're done, click <a href = "" id = "getting_started">LEARN</a> to get back here and we'll show you how to remix XXXX to be your own!</p>

							<p>Or… if you want to jump right to remixing, try clicking the  <a href = "" id = "assets">ASSETS</a> tab on the toolbar to your right. You'll see a whole bunch of Stickers and GIFs we've plopped in your assets to get you started, including the GIFs and Stickers from XXXX under <b>This Game's Assets</b>! Try dragging and dropping GIFs and Stickers from your assets to replace the assets for XXXX. When you're done, click <a href = "" id = "simulation">RUN</a> on the toolbar. Congratulations, you've just made your first game!</p>

							<p>While it’s easy to remix games, GIPHY Gamemaka also has the power to allow you to make and share your own microgames from scratch! Try checking out our examples in the <a href = "" id = "examples">EXAMPLES</a> section or combing through the <a href = "" id = "docs">DOCS</a> for a feel of some of the features you can put into your own games. If you want step-by-step help making your first game from scratch, read on!</p>

							<h2>The Anatomy of a GIPHY Game</h2>

							<p>Every GIPHY Game consists of what we like to call <b>Things</b>. Things can be images, shapes, GIFs or Stickers and they can be drawn on screen, respond to touches and swipes, and even be given physics properties and collide with each other! In most code <a href = "" id = "examples">EXAMPLES</a> you'll see lines that look like this:</p>

							<pre>var MyThing = fV_thing(200,300,80,80,"rectangle","asset_0");</pre>

							<p>This line means we're creating a new Thing, we're calling it 'MyThing', and we’re providing information about where it will exist on screen (at the coordinates 200,300 on the screen), at what size it will exist (80 pixels by 80 pixels), what shape it will take for physics collisions (a rectangle), and what asset we'd like to use from our library (in this case, “asset_0”, which we can mix and match in the <a href = "" id = "assets">ASSETS</a> tab.).</p>

							<p>Once you've created a thing, you'll probably want to draw that thing on screen!  Every GIPHY Game will have three functions built in, <code>setup()</code>, <code>update()</code> and <code>draw()</code>. <a href = "" id = "code-reset">Click here</a> to have your code replaced with a blank template with only these functions. <code>setup()</code> gives you a place to create all the Things you need for your game and initialize any variables you might use later. <code>update()</code> is a function that will be called every frame (30 times a second), so it's a good place for you to *update* Things based on events that have happened in your game. <code>draw()</code> is a function where you'll actually draw all your Things to the screen (or not), as well as fill colors and other shapes.</p> 

							<p>Let's try creating a Thing and making it respond to being tapped on. First, write the following line at the very top of your code.</p>

							<pre>var myThing = fV_thing(WIDTH/2,HEIGHT/2,100,100,"rectangle","asset_0");</pre>

							<p>Next, we're going to make your Thing tappable! Create the following setup function.</p>

							<pre>{`
function setup(){
	fV_tappable(myThing)
	fV_behavior_physics(myThing);
	myThing.fV_gravity(true); 
	fV_walls(true,true,true,true)
}`}</pre>

							<p>In the setup loop we made our Thing tappable, added physics properties to it, told it to respond to gravitational forces, and used a helper function called <code>fV_walls()</code> that turns the screen boundaries into physics walls.</p>

							<p>GIPHY Gamemaka has a whole host of special functions you can add to handle events in your game. In this case, we have a function that tells your game what to do when the screen is tapped. Add this to your code to give your Thing a velocity when the screen is tapped:</p>

							<pre>{`
function event_tap(x,y){
	myThing.fV_set_velocity(5,5);
}`}</pre>

							<p>Next, to make our Thing draw to the screen, add the following code to the draw loop:</p>

							<pre>
							{`
function draw(){
	myThing.fV_draw();
}`}</pre>
							<p>All that's left to do is assign a GIF or Sticker to our Thing! Click the <a href = "" id = "assets">ASSETS</a> tab on the right and drag an asset to the asset_0 slot. When you're done, click the <a href = "" id = "run">RUN</a> tab to preview your Thing in action!</p>

							<h2>What else can I do with GIPHY Gamemaka?</h2>

							<p>Now that you know how to create Things and draw them onscreen, you can peruse our <a href = "" id = "docs">DOCS</a> for instructions on how to give them more <a href = "" id = "jgravity" className = "doc_anchor_link">physics properties</a>, <a href = "" id = "jgravity" className = "doc_anchor_link">check for when they collide with each other</a>, <a href = "" id = "jgravity" className = "doc_anchor_link">make them draggable and launchable</a>, and <a href = "" id = "jgravity" className = "doc_anchor_link">play sounds</a>, among many other things. Try taking a look at our <a href = "" id = "examples">EXAMPLES</a> for an idea of what GIPHY Gamemaka can do! Clicking on any example will clone the example code to your editor where you can tweak and test and make it your own.</p>

							<h2>Publishing and sharing your games</h2>

							<p>Instructions for publishin' and sharin' go here!</p>

						</div>
					</div>
        )
    }
}

export default EditorGettingStartedPane;

