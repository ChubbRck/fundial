

var ALL_THINGS = [];
var ALL_SOUNDS = [];
var ALL_MATTER = [];
var ALL_SPRINGS = [];
var ALL_BACKGROUNDS = [];
var ALL_FONTS = [];

var ALPHA = 1.0;

var CLEAR_BACKGROUND = true;

var SHOW_OUTLINES = false;
var SHOW_PADDED_OUTLINES = false;
var SHOW_PHYSICS_OUTLINES = false;

var BACKGROUND_COLOR = "rgb(10,10,10)";

var FILL_COLOR = "rgb(255,0,0)";

var FAUX_Z_INDEX = 0;

var DRAW_FROM_CENTER = true;

var DRAG = 0;
var GRAVITY = 0;

var TOUCHX = 0; 
var TOUCHY = 0;
var MOUSEX = 0;
var MOUSEY = 0;
var MOUSEVX = 0;
var MOUSEVY = 0;

var FAUX_VELOCLITY_MULTIPLIER = 5.0;

var MAX_ANGULAR_VELOCITY = 0.1;

var INTERACTING = false;

var MS_PER_FRAME = 16.67; //60fps

var ORIENTATION = "landscape";

var PAUSE = true;

var GAME_OVER = false;
var GAME_OVER_SUCCESS;
var GAME_OVER_STATE = false;

var GAME_DURATION;
var GAME_TIMER_LOCATION = "top";
var GAME_MS = 0;

var GAME_TICKS = 0;
var run_game_interval;

var WIDTH = G_WIDTH;
var HEIGHT = G_HEIGHT;

var SHOW_BODY_WIREFRAMES = true;

var TWO_PI = Math.PI * 2;

var DEVICE_ACCELERATION = {x:null, y:null, z:null}
var DEVICE_ORIENTATION = {alpha:null, gamma:null, beta:null}

//CANVAS
var c_fV = document.getElementById("csim");
var ctx_fV = c_fV.getContext("2d");

// TIMER
var gameTimer = document.querySelector('.game-timer');
var gameTimerInner = document.querySelector('.game-timer-inner');

// AUDIO
// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var _scratchBuffer = audioCtx.createBuffer(1, 1, 22050);

// Call this method on touch start to create and play a buffer,
// then check if the audio actually played to determine if
// audio has now been unlocked on iOS, Android, etc.
var unlock = function() {
  // Create an empty buffer.
  var source = audioCtx.createBufferSource();
  source.buffer = _scratchBuffer;
  source.connect(audioCtx.destination);

  // Play the empty buffer.
  if (typeof source.start === 'undefined') {
    source.noteOn(0);
  } else {
    source.start(0);
  }

  // Setup a timeout to check that we are unlocked on the next event loop.
  source.onended = function() {
    source.disconnect(0);

    // Remove the touch start listener.
    document.removeEventListener('click', unlock, true);
  };
};

// Setup a touch start listener to attempt an unlock in.
document.addEventListener('click', unlock, true);

// FONTS
var globalFontList = {
	'abril': {
		link: '<link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet">',
		style: 'Abril Fatface',
	},
	'arvo': {
		link: '<link href="https://fonts.googleapis.com/css?family=Arvo:700" rel="stylesheet">',
		style: 'Arvo',
	},
	'bungee': {
		link: '<link href="https://fonts.googleapis.com/css?family=Bungee" rel="stylesheet">',
		style: 'Bungee',
	},
	'corben': {
		link: '<link href="https://fonts.googleapis.com/css?family=Corben:700" rel="stylesheet">',
		style: 'Corben',
	},
	'oswald': {
		link: '<link href="https://fonts.googleapis.com/css?family=Oswald:700" rel="stylesheet">',
		style: 'Oswald',
	},
	'playfair': {
		link: '<link href="https://fonts.googleapis.com/css?family=Playfair+Display+SC:700" rel="stylesheet">',
		style: 'Playfair Display SC',
	},
	'roboto': {
		link: '<link href="https://fonts.googleapis.com/css?family=Roboto+Mono:700" rel="stylesheet">',
		style: 'Roboto Mono',
	},
	'rubik': {
		link: '<link href="https://fonts.googleapis.com/css?family=Rubik+Mono+One" rel="stylesheet">',
		style: 'Rubik Mono One',
	},
};

// DEVICE MOTION
if (window.DeviceMotionEvent) {
	window.addEventListener('devicemotion', deviceMotionHandler);
}

function deviceMotionHandler(evt){
	DEVICE_ACCELERATION.x = evt.acceleration.x;
	DEVICE_ACCELERATION.y = evt.acceleration.y;
	DEVICE_ACCELERATION.z = evt.acceleration.z;
}

//DEVICE ORIENTATION
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationHandler);
}

function deviceOrientationHandler(evt){
	// alpha: rotation around z-axis
	DEVICE_ORIENTATION.alpha = event.alpha;
    // gamma: left to right
    DEVICE_ORIENTATION.gamma = event.gamma;
    // beta: front back motion
    DEVICE_ORIENTATION.beta = event.beta;
}

//TEMPLATE. If user deletes any of the template functions it will throw an error so let's just put these here. 
//______________________________________________________________________ setup (called once)
//function setup(){}
//______________________________________________________________________ update (called perpetually)
//function update(){}
//______________________________________________________________________ draw (called perpetually)
//function draw(){}
//______________________________________________________________________ interactions
function event_down(x,y){}
function event_up(x,y){}
function event_tap(x,y){}
function event_swipe(x1,y1,x2,y2,vx,vy,time){}
function event_drag(x,y){}
function event_tilt(tilt_LR, tilt_FB, rot){}

//______________________________________________________________________ interactions with things
function event_tap_thing(thing_uid,x,y){}
function event_drag_thing(thing_uid,x,y){}
function event_drag_start_thing(thing_uid,x,y){}
function event_drag_end_thing(thing_uid,x,y){}
function event_launch_thing(thing_uid,vx,vy){}
//______________________________________________________________________ callbacks
function callback_timer(timer_uid){}
function callback_animation_done(thing_uid,animation_type){}
function callback_collision(thing1_uid,thing2_uid){}

//GLOBAL MATTER PHYSICS
var World = Matter.World;
var Bodies = Matter.Bodies;
var Runner = Matter.Runner;
var Body = Matter.Body;
var Engine = Matter.Engine;
var Composite = Matter.Composite;
var Events = Matter.Events;
var allBodiesComposite = Composite.create(); 
var engine;
var world;

(function() {
	c_fV = document.getElementById("csim");
	ctx_fV = c_fV.getContext("2d");
	engine = Engine.create({
		render: {
			element: document.body,
			canvas: c_fV,
			context: ctx_fV,
			options: {
				width: WIDTH,
				height: HEIGHT,
				background: BACKGROUND_COLOR,
				wireframeBackground: BACKGROUND_COLOR,
				hasBounds: false,
				enabled: true,
				wireframes: false,
				showSleeping: true,
				showDebug: false,
				showBroadphase: false,
				showBounds: false,
				showVelocity: false,
				showCollisions: false,
				showAxes: false,
				showPositions: false,
				showAngleIndicator: false,
				showIds: false,
				showShadows: false
			}
		}
	});
	engine.world.gravity.x = 0; 
	engine.world.gravity.y = 0;
	world = engine.world; //wtf is world!?!?!?!?

	console.log(engine);
})();






var STATS = true;
$("document").ready(function(){
	if (STATS){
		stats = new Stats();
		stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild( stats.dom );
	}
});

