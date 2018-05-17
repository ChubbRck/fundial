import Matter from 'matter-js'
import Howl from 'howler'
import { randomString, getVertices, pointInPolygon, distanceBetweenPoints, angleBetweenPoints, lineIntersect, lineIntersect2, normalizeVector, magnitudeOfVec } from '../utils/functions'
import isMobile from '../utils/is-mobile'
import allEasings from '../utils/easings'
import { pointerEventToXY } from '../utils/pointerEventToXY'
import globalFontList from '../utils/fonts'

const { World, Bodies, Runner, Body, Engine, Composite, Events, Vertices } = Matter
const TWO_PI = Math.PI * 2
const path = '/'

export default class Game {
    // Globals
    userCode = null
    ctx=  null
    canvas=  null
    ALL_THINGS=  []
    ALL_SOUNDS=  []
    ALL_MATTER=  []
    ALL_SPRINGS=  []
    ALL_BACKGROUNDS=  []
    ALL_FONTS=  []
    ALPHA=  1.0
    CLEAR_BACKGROUND=  true
    SHOW_OUTLINES=  false
    SHOW_PADDED_OUTLINES=  false
    SHOW_PHYSICS_OUTLINES=  false
    BACKGROUND_COLOR=  "rgb(0,0,0)"
    FILL_COLOR=  "rgb(255,0,0)"
    FAUX_Z_INDEX=  0
    DRAW_FROM_CENTER=  true
    DRAG=  0
    GRAVITY=  0
    TOUCHX=  0
    TOUCHY=  0
    MOUSEX=  0
    MOUSEY=  0
    MOUSEVX=  0
    MOUSEVY=  0
    FAUX_VELOCLITY_MULTIPLIER=  5.0
    MAX_ANGULAR_VELOCITY=  0.1
    INTERACTING=  false
    MS_PER_FRAME= 16.67 //60fps
    ORIENTATION=  "landscape"
    PAUSE=  false
    GAME_OVER=  false
    GAME_OVER_SUCCESS= false
    GAME_OVER_STATE=  false
    GAME_DURATION=  60
    GAME_TIMER_LOCATION=  "top"
    GAME_MS=  0
    GAME_TICKS= 0
    run_game_interval=  null
    // WIDTH =  1231
    // HEIGHT =  640
    HEIGHT =  1231
    WIDTH =  640
    SHOW_BODY_WIREFRAMES=  true
    DEVICE_ACCELERATION=  {x:null, y:null, z:null}
    DEVICE_ORIENTATION=  {alpha:null, gamma:null, beta:null}
    DRAW_FROM_CENTER=  true
  
    INTERVAL_WAIT= []
    all_intervals= []
  
    audioCtx = new window.AudioContext()
    _scratchBuffer = this.audioCtx.createBuffer(1, 1, 22050)
    
    // Matter.js globals
    allBodiesComposite = Composite.create()
    engine=  null
    world=  null
  
    //misc globals found in runner js
    runner= null
    collision_run_once= false
    sliding_run_once= false

    animation_id = null
    easing_types = allEasings
    globalFontList = globalFontList
    isMobile = isMobile

    timeStart = null;

    // interaction globals
    x_dn= null;
    y_dn= null;
    x_up= null;
    y_up= null;
    x_diff= null;
    y_diff= null;
    starttime= null;
    swipe_duration_threshold = 200; //swipe needs to happen in under this time (ms) to be considered a swipe
    swipe_distance_threshold = 20; //swipe distance needs to be at least this long (pixels) to be considered a swipe
    uids_mouse_down = []; //we need to populate an array of the mousedown things in the case of a throw (where mouseup occurs outside the thing)
    thing_down = null;
    velocity_multiplier_desktop = 22; //arbitrary multiplier to make velocity match interaction velocity
    velocity_multiplier_mobile = 22;
    velocity_multiplier_desktop_physics = 22;
    velocity_multiplier_mobile_physics = 22;

    mouse_speed_time = 0;
    mouse_x_prev = 0;
    mouse_y_prev = 0;

    // handlers
    onMouseUp = this.mouseup.bind(this)
    onMouseDown = this.mousedown.bind(this)
    onClick = this.click.bind(this)
    onUnlock = this.unlock.bind(this)
    onDeviceMotionHandler = this.deviceMotionHandler.bind(this)
    onDeviceOrientationHandler = this.deviceOrientationHandler.bind(this)
  
    
    constructor(_canvas, _userCode, _gameTimerBar, _orientation, _parent){
      this.canvas = _canvas;
      this.gameTimerBar = _gameTimerBar;
      this.userCode = _userCode;
      this.parent = _parent;
      
      switch(_orientation){
        case "portrait":

          this.HEIGHT = 1231
          this.WIDTH =  640
        break;
        case "landscape":
          this.WIDTH =  1231
          this.HEIGHT =  640
        break;
        default:
          this.WIDTH = 1231
          this.HEIGHT = 640
        break;
      }

      this.setupCanvas(_canvas);
      this.bindEvents(_canvas);
      
     
      // Unclear what this is for
      document.addEventListener('click', this.onUnlock, true);
  
      //set up matter update
      this.runner = Runner.create();
      
      // Listen for device motion, if applicable
      if (window.DeviceMotionEvent) {
           window.addEventListener('devicemotion', this.onDeviceMotionHandler);
      }
  
      // Listen for device orientation, if applicable
      if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", this.onDeviceOrientationHandler);
      }
    }

    init() {
        // Init user code
        global.gameSetup && global.gameSetup();
      
        // Log start time
        this.timeStart = new Date();

        // Begin per frame loop
        this.animation_id = requestAnimationFrame(this.runFrame.bind(this));

    }

    destroy() {
        this.animation_id && cancelAnimationFrame(this.animation_id)
        document.removeEventListener('click', this.onUnlock, true);
        window.DeviceMotionEvent && window.removeEventListener('devicemotion', this.onDeviceMotionHandler);
        window.DeviceOrientationEvent && window.removeEventListener("deviceorientation", this.onDeviceOrientationHandler);
        this.canvas.removeEventListner('click', this.onClick)
        this.canvas.removeEventListner('mousedown', this.onMouseDown)
        this.canvas.removeEventListner('mouseup', this.onMouseUp)
        this.canvas.removeEventListner('mousemove', this.onMouseMove)
    }
    
    // Set up Canvas / Matter
    setupCanvas(canvas){
      this.ctx = canvas.getContext("2d");
      this.engine = Engine.create({
            render: {
                canvas: this.canvas,
                context: this.ctx,
                options: {
                    width: this.WIDTH,
                    height: this.HEIGHT,
                    background: this.BACKGROUND_COLOR,
                    wireframeBackground: this.BACKGROUND_COLOR,
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
  
      this.engine.world.gravity.x = 0; 
      this.engine.world.gravity.y = 0;
      this.world = this.engine.world;
  
    }
    
    // Bind touch and other interaction events to the canvas
    bindEvents(canvas){
      canvas.addEventListener('click', this.onClick)
      canvas.addEventListener('mousedown', this.onMouseDown)
      canvas.addEventListener('mouseup', this.onMouseUp)
      canvas.addEventListener('mousemove', this.onMouseMove)
      // add more... or should this be React-ified instead?
    }

    registerTouchOrClick(x,y){
      var game = this;
      const { left, top, width } = this.canvas.getBoundingClientRect()
      const scale = this.WIDTH / width
      this.x_dn = (x - left) * scale
      this.y_dn = (y - top) * scale

      this.starttime = new Date(); 

      //event MOUSE DOWN
      this.event_down(this.x_dn,this.y_dn); // !EVENT! event_down

      //determine top thing
      var top_thing = null;
      var top_z_index = 0;
      this.ALL_THINGS.forEach(function(thing,i){
        if(game.point_is_inside(thing,game.x_dn,game.y_dn)){
          if(thing.z_index > top_z_index){
            top_thing = thing;
            top_z_index = thing.z_index;
          }
        }
      });

      //event DRAG START
      if(top_thing!==null && top_thing.draggable===true){

        top_thing.dragging=true;

        this.x_diff = this.x_dn - top_thing.x;
        this.y_diff = this.y_dn - top_thing.y;

        //we need to remove all velocity on drag
        top_thing.vx = 0;
        top_thing.vy = 0;
        if(top_thing.physics===true){
          Body.setVelocity(top_thing.body, {x:0,y:0});
        }
        //TODOCHECK: Will this work?
        this.event_drag_start_thing(top_thing.uid,this.TOUCHX-this.x_diff,this.TOUCHY-this.y_diff); // !EVENT! event_drag_start_thing
      }

      //event LAUNCH uid_down
      if(top_thing!==null && top_thing.launchable===true){
        this.thing_down = top_thing;
      }else{
        this.thing_down = null;
      }

      //interacting
      this.INTERACTING = true;

      //prevent default mouse behavior how?
      //e.preventDefault();
    }
    

    mousedown(e){
      e.preventDefault();
      const { pageX, pageY } = e;
      // preventDefault();
      if(!isMobile.any()){
        console.log("mouse down")
        this.registerTouchOrClick(pageX, pageY);
      }
    }

    // TODO: mobile equivalent
    touchstart({pageX, pageY}){
      if(isMobile.any()){
        var x = pointerEventToXY(pageX);
        var y = pointerEventToXY(pageX);

        this.registerTouchOrClick(x,y);
      }
    }
   

    mouseup(e){
      e.preventDefault();
      const { pageX, pageY } = e;
      if(!isMobile.any()){
        console.log("mouse up")
        var game = this;
        const { left, top, width } = this.canvas.getBoundingClientRect()
        const scale = this.WIDTH / width
        this.x_up = (pageX - left) * scale
        this.y_up = (pageY - top) * scale

        this.TOUCHX = this.x_up;
        this.TOUCHY = this.y_up;

        var dist = Math.sqrt((this.x_dn-this.x_up)*(this.x_dn-this.x_up)+(this.y_dn-this.y_up)*(this.y_dn-this.y_up));
        var timediff = new Date()-this.starttime;
        
        //determine top thing
        var top_thing = null;
        var top_z_index = 0;
        game.ALL_THINGS.forEach(function(thing,i){
          if(game.point_is_inside(thing,game.x_up,game.y_up)){
            if(thing.z_index > top_z_index){
              top_thing = thing;
              top_z_index = thing.z_index;
            }
          }
        });

        //event TAP (CLICK)
        if(top_thing!==null && top_thing.tappable===true){
          //TODOCHECK: Do !EVENTs work?
          console.log("tappable?");
          this.event_tap_thing(top_thing.uid,this.x_up,this.y_up); // !EVENT! event_tap_thing
        }

        //event SWIPE 
        if(dist>this.swipe_distance_threshold && timediff<this.swipe_duration_threshold){ //we have a swipe

        var vx = ((this.x_up-this.x_dn) / timediff) * this.velocity_multiplier_desktop; 
        var vy = ((this.y_up-this.y_dn) / timediff) * this.velocity_multiplier_desktop;

        this.event_swipe(this.x_dn,this.y_dn,this.x_up,this.y_up,vx,vy,timediff); // !EVENT! event_swipe
      }

      //event LAUNCH
      if(this.thing_down!==null && this.thing_down.launchable===true && this.thing_down.draggable!==true){
        if(dist>this.swipe_distance_threshold && timediff<this.swipe_duration_threshold){ 
          console.log("we have a swipe"); //we have a swipe
         // this.event_launch_thing(this.thing_down.uid,vx,vy); // !EVENT! event_launch_thing
          global.event_launch_thing && global.event_launch_thing(this.thing_down.uid,vx,vy)
        }
      }

      //event LAUNCH (if also draggable)
      if(this.thing_down!==null && this.thing_down.launchable===true && this.thing_down.draggable===true){
        console.log(this.MOUSEVX+":"+this.MOUSEVY);
        if(timediff<this.swipe_duration_threshold ){
          var vx2 = ((this.x_up-this.x_dn) / timediff) * this.velocity_multiplier_desktop; 
          var vy2 = ((this.y_up-this.y_dn) / timediff) * this.velocity_multiplier_desktop;
          global.event_launch_thing && global.event_launch_thing(this.thing_down.uid,vx2,vy2); // !EVENT! event_launch_thing
        }else if(Math.abs(this.MOUSEVX)>30 || Math.abs(this.MOUSEVY)>30){ //if we drag it around for a bit THEN launch. tricky scenario.
          global.event_launch_thing && global.event_launch_thing(this.thing_down.uid,this.MOUSEVX,this.MOUSEVY); // !EVENT! event_launch_thing
        }else{
          console.log("dragging?");
        }
      }

      this.thing_down = null;

      //event DRAG
      this.ALL_THINGS.forEach(function(thing,i){
        if(thing.dragging===true){
          thing.dragging=false; 
          this.event_drag_end_thing(thing.uid,this.TOUCHX-this.x_diff,this.TOUCHY-this.y_diff); // !EVENT! event_drag_end_thing
          // if(thing.temp_fixed===true){
          //  console.log("done temp fix");
          //  thing.fV_set_static(false);
          //  thing.temp_fixed = false;
          // }
        }
      });

      //event TAP
      if(dist<this.swipe_distance_threshold){ //we have a tap?
        this.event_tap(this.x_up,this.y_up); // !EVENT! event_tap
      }

      //interacting
      this.INTERACTING = false;

    }
    };
 

    mousemove(e){
      e.preventDefault();
      const { pageX, pageY } = e;
      if(!isMobile.any()){
        console.log("mouse move")
        var game = this;
        const { left, top, width } = this.canvas.getBoundingClientRect()
        const scale = this.WIDTH / width
        var xpos = (pageX - left) * scale
        var ypos= (pageY - top) * scale

        this.MOUSEX = xpos;
        this.MOUSEY = ypos;

        var timediff = new Date()-this.mouse_speed_time;
        this.MOUSEVX = ((this.MOUSEX-this.mouse_x_prev) / timediff) * 22;
        this.MOUSEVY = ((this.MOUSEY-this.mouse_y_prev) / timediff) * 22;
        this.mouse_speed_time = new Date();
        this.mouse_x_prev = this.MOUSEX;
        this.mouse_y_prev = this.MOUSEY;
      //}

        if(this.INTERACTING===true){

          this.TOUCHX = xpos;
          this.TOUCHY = ypos;

          if(this.TOUCHX==this.x_dn && this.TOUCHY==this.y_dn){

            //do nothing, zero distance drag = weirdness & divide by zero badness

          }else{

            this.event_drag(this.TOUCHX,this.TOUCHY); // !EVENT! event_drag

            this.ALL_THINGS.forEach(function(thing,i){
              if(thing.dragging===true){
                game.event_drag_thing(thing.uid,game.TOUCHX-game.x_diff,game.TOUCHY-game.y_diff); // !EVENT! event_drag_thing
                // if(thing.fixed===false){
                //  console.log("temp fix");
                //  thing.fV_set_static(true);
                //  thing.temp_fixed = true;
                // }          
              }
            });
          }
        };  
      }
    }

      click({ pageX, pageY }) {
        const { left, top, width } = this.canvas.getBoundingClientRect()
        const scale = this.WIDTH / width
        const x = (pageX - left) * scale
        const y = (pageY - top) * scale

        global.gameClick && global.gameClick(x, y)
        global.gameTap && global.gameTap(x, y)
      }
    
    // Run the user's update method
    update(){
        global.gameUpdate && global.gameUpdate();
    }
    
    // Run the user's draw method
    draw(){
        global.gameDraw && global.gameDraw();
    }
    
    // Function to be run every frame
    runFrame(){
      if (this.PAUSE === false && this.GAME_OVER === false){
      
        this.GAME_MS = new Date() - this.timeStart; 
        
        this.update_backend();
        // User's update code
        this.update();
        this.update_draw();
        this.update_matter();
        this.clear();
        // User's draw code
        this.draw();
        this.backend_draw();
        
        // ... and... repeat! 
        this.animation_id = requestAnimationFrame(() => this.runFrame());
      }
    }
  
    clear(){
      this.ctx.globalAlpha = 1.0;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = this.BACKGROUND_COLOR;
      this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
      this.ctx.fill();	
      this.FAUX_Z_INDEX = 0;
    }
  
    unlock() {
      // Create an empty buffer.
      var source = this.audioCtx.createBufferSource();
      source.buffer = this._scratchBuffer;
      source.connect(this.audioCtx.destination);
  
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
        document.removeEventListener('click', this.onUnlock, true);
      };
    }
  
    deviceMotionHandler(evt){
        this.DEVICE_ACCELERATION.x = evt.acceleration.x;
        this.DEVICE_ACCELERATION.y = evt.acceleration.y;
        this.DEVICE_ACCELERATION.z = evt.acceleration.z;
    }
  
  
  
    deviceOrientationHandler(evt){
        // alpha: rotation around z-axis
        this.DEVICE_ORIENTATION.alpha = evt.alpha;
        // gamma: left to right
        this.DEVICE_ORIENTATION.gamma = evt.gamma;
        // beta: front back motion
        this.DEVICE_ORIENTATION.beta = evt.beta;
    }
  
    //TEMPLATE. If user deletes any of the template functions it will throw an error so let's just put these here. 
    //______________________________________________________________________ setup (called once)
    //function setup(){}
    //______________________________________________________________________ update (called perpetually)
    //function update(){}
    //______________________________________________________________________ draw (called perpetually)
    //function draw(){}
    //______________________________________________________________________ interactions
    event_down(x,y){}
    event_up(x,y){}
    event_tap(x,y){}
    event_swipe(x1,y1,x2,y2,vx,vy,time){}
    event_drag(x,y){}
    event_tilt(tilt_LR, tilt_FB, rot){}
  
    //______________________________________________________________________ interactions with things
    event_tap_thing(thing_uid,x,y){}
    event_drag_thing(thing_uid,x,y){}
    event_drag_start_thing(thing_uid,x,y){}
    event_drag_end_thing(thing_uid,x,y){}
    event_launch_thing(thing_uid,vx,vy){console.log("WHEEEEE");}
    //______________________________________________________________________ callbacks
    callback_timer(timer_uid){}
    callback_animation_done(thing_uid,animation_type){}
    callback_collision(thing1_uid,thing2_uid){}
  
  
  //========================================================================
  //________________________________________________________________________ thing
  thing(_x,_y,_width,_height,_type,_img){

    console.log('thingggg')
    
    var game = this
      //___CREATE THING 
      var Thing = {
  
          //_______________________________________
          //BASICS
          uid: randomString(10),
          type:_type, 
          x:_x,
          y:_y,
          x_prev:0,
          y_prev:0,
          width:_width,
          height:_height,
          widthO:_width, //original width
          heightO:_height, //original height
          z_index:undefined, //we have a faux z-index thing happening
          vx:0,
          vy:0,
          vm:0,//velocity magnitude
          vx_faux:0,
          vy_faux:0,
  
          //_______________________________________
          //ROTATION
          rotation:0,
          rotation_r:0,
          rotation_d:0,
          angular_velocity:0,
          max_angular_velocity: 0.1,
  
          //_______________________________________
          //PHYSICS STUFF
          body:undefined, //physics body
          fixed:false, //is fixed
          physics_padding_x:1.0,
          physics_padding_y:1.0,
          rotate_freely:false, 
          body_mass_original:undefined,
          
          //_______________________________________
          //ANI & OSC
          animations:[], //array to store all active animations
          oscillations:[], //array to store all active oscillations
  
          //_______________________________________
          //INTERACTION W/ THINGS
          tappable:false, //can be clicked
          draggable:false, //can be dragged
          dragging:false, //is currently being dragged
          launchable:false, //can be launched
  
          //_______________________________________
          //BEHAVIORS
          physics:false, //physics is enabled when true
          gravity:false, //gravity is enabled when true
          spring:false, //spring is enabled when set to spring-partner UID
          magnet:false, //magnet is enabled when true
          follow:false, //magnet is enabled when set to following UID
  
          //_______________________________________
          //GIF STUFF
          gif:false,
          gif_frames:undefined,
          gif_frame_width:undefined,
          gif_frame_height:undefined,
          gif_speed:0.7, //0-1.0, 0 for pause
          gif_on_frame:0,
          gif_playback:"forwards", //forward,backwards,wiggle
          gif_wiggle_direction:true, //toggle for wiggle direction
          gif_in:0,
          gif_out:undefined,
  
          //_______________________________________
          //OTHER
          flip_x:1,
          flip_y:1,
          padding_x:1.0, 
          padding_y:1.0, 
          faux_destroy:false,
  
  
          set_position:function(_x,_y){
              this.x = _x;
              this.y = _y;
              if(this.physics===true){
                  Body.setPosition(this.body,{x:_x,y:_y});
              }
          },
          set_x:function(_x){
              this.x = _x;
              if(this.physics===true){
                  Body.setPosition(this.body,{x:_x,y:this.y});
              }
          },
          set_y:function(_y){
              this.y = _y;
              if(this.physics===true){
                  Body.setPosition(this.body,{x:this.x,y:_y});
              }
          },
          set_size:function(_w,_h){
              if(this.physics===true){
                  //body.bounds ???
                  var body_width = this.body.vertices[0].x - this.body.vertices[1].x; //absolutely fucked once we rotate
                  var body_height = this.body.vertices[0].y - this.body.vertices[2].y;
                  var sw = _w/body_width; 
                  var sh = _h/body_height;
              }
              this.width = _w;
              this.height = _h;
              if(this.physics===true){
                  Body.scale(this.body,sw,sh);
              }
          },
          set_width:function(_w){
              this.set_size(_w,this.height);
          },
          set_height:function(_h){
              this.set_size(this.width,_h);
          },
          set_velocity:function(_vx,_vy){
              this.vx=_vx;
              this.vy=_vy;
              if(this.physics===true){
                  Body.setVelocity(this.body, {x:_vx,y:_vy});
              }
          },
          set_velocity_x:function(_vx){
              this.vx=_vx;
              if(this.physics===true){
                  Body.setVelocity(this.body, {x:_vx, y:this.vy}); // Use existing y velocity
              }
          },
          set_velocity_y:function(_vy){
              this.vy=_vy;
              if(this.physics===true){
                  Body.setVelocity(this.body, {x:this.vx, y:_vy}); // Use existing x velocity
              }
          },
            set_velocity_magnitude:function(_vm){
              var scale = _vm/this.vm;
              this.vx *= scale;
              this.vy *= scale;
              if(this.physics===true){
                  Body.setVelocity(this.body, {x:this.vx, y:this.vy});
              }
          },
          update_faux_velocity:function(){
              this.vx_faux = (this.x - this.x_prev)/game.MS_PER_FRAME;
              this.vy_faux = (this.y - this.y_prev)/game.MS_PER_FRAME;
              this.x_prev = this.x;
              this.y_prev = this.y;
  
              if(this.physics===true){
                  Body.setVelocity(this.body, {x:this.vx_faux*game.FAUX_VELOCLITY_MULTIPLIER , y:this.vy_faux*game.FAUX_VELOCLITY_MULTIPLIER});
              }
          },
          set_fixed:function(_b){
              this.fixed = _b;
              // Set velocity to 0
              this.vx = 0;
              this.vy = 0;
              if(this.physics===true){
                  Body.setVelocity(this.body, {x:0,y:0});
                  Body.setStatic(this.body, _b);
              }
          },
          // Leaving legacy set_static function so as not to break old examples/games or backend.
          set_static:function(_b){
              this.fixed = _b;
              // Set velocity to 0
              this.vx = 0;
              this.vy = 0;
              if(this.physics===true){
                  Body.setVelocity(this.body, {x:0,y:0});
                  Body.setStatic(this.body, _b);
              }
          },
          rotate:function(_r,_u){ //rotates _r relative to existing rotation
              if(_u==="r"){
                  this.rotation += _r;
              }
              if(_u==="d"){
                  this.rotation += _r*Math.PI/180;
              }
              if(this.physics===true){
                  Body.rotate(this.body, this.rotation);
              }
          },
          set_angle:function(_r,_u){ 
              if(_u==="r"){
                  this.rotation = _r;
              }
              if(_u==="d"){
                  this.rotation = _r*Math.PI/180;
              }
              if(this.physics===true){
                  Body.setAngle(this.body, this.rotation);
                  //console.log("A: "+this.body.angle);
              }
          },
          set_angular_velocity:function(_av,_u){ //deg/s or rad/s
              if(_u==="r"){
                  this.angular_velocity = _av;
              }
              if(_u==="d"){
                  this.angular_velocity = _av*Math.PI/180;
              }	   
              //this is calculated in _runner.js each frame
          },
          get_angle_d:function(){
              var rotation_d = this.rotation*180/Math.PI;
              return rotation_d;
          },
          get_angle_r:function(){
              return this.rotation;
          },
          // set_mass:function(_m){ //does mass do anything? !should add this to physics!
          // 	this.mass = _m;
          // 	if(this.physics===true){
          // 		Body.setMass(this.body, _m);
          // 	}
          // },
          set_flip:function(_x,_y){ 
              this.flip_x = _x;
              this.flip_y = _y;
          },
          set_padding:function(_px,_py){ 
              this.padding_x = 1.0 - _px;
              this.padding_y = 1.0 - _py;
          },
             set_restitution:function(_r){
                 this.restitution = _r;
                 if(this.physics===true){
                  this.body.restitution = _r;
                 }
             },
          get_vertices:function(_padding){
              return getVertices(this,"obj",_padding);
          },
          get_velocity:function(){
              if(this.physics===true){
                  return this.body.velocity;
              }else{
                  var v = {x:this.vx,y:this.vy};
                  return v;
              }
          },
          get_out_of_view:function(){
              var v = getVertices(this,"arr",false);
              var out_of_view = true;
              for(var i=0;i<v.length;i++){
                  if( pointInPolygon([v[i][0],v[i][1]], [[0,0],[game.WIDTH,0],[game.WIDTH,game.HEIGHT],[0,game.HEIGHT]]) ){ //if any point is in view then it is not out of view
                      out_of_view = false;
                      break;
                  }
              }
              if(out_of_view === true){
                  return true;
              }else{
                  return false;
              }
          },
          draw:function(){
            // console.log("drawin")
              // console.log("width: " + this.width);
              // console.log("height: " + this.height);
  
              if(this.faux_destroy===true){return;} //destroy is not really working :(
  
              game.FAUX_Z_INDEX++;
              this.z_index = game.FAUX_Z_INDEX;
  
              var draw_offset_x = 0; 
              var draw_offset_y = 0;
  
              if (game.DRAW_FROM_CENTER){
                  draw_offset_x = this.width/2;
                  draw_offset_y = this.height/2;
              }
        
              game.ctx.globalAlpha = game.ALPHA;
              game.ctx.fillStyle = game.FILL_COLOR;
              
              game.ctx.save();
  
              game.ctx.translate(this.x,this.y);
  
              game.ctx.rotate(this.rotation);
  
              game.ctx.scale(this.flip_x, this.flip_y); //can we do this with rotate????
  
  
                  //___PRIMITIVE CIRCLE
                  if(typeof _img === 'undefined' && this.type==="circle"){ 
                      game.ctx.fillStyle = game.FILL_COLOR;
                      game.ctx.beginPath();
                      game.ctx.arc(0,0,draw_offset_x,0,2*Math.PI);
                      game.ctx.closePath();
                      game.ctx.fill();
  
                  }
  
                  //___PRIMITIVE RECTANGLE
                  if(typeof _img === 'undefined' && this.type==="rectangle"){ 
                        game.ctx.fillStyle = game.FILL_COLOR;
                      game.ctx.fillRect(-(draw_offset_x), -(draw_offset_y), this.width, this.height);
  
                  }
                  
                  //___IMG or GIF
                  if(typeof _img !== 'undefined'){ 
  
                      if(this.gif===true){
                          game.ctx.drawImage(img, (this.gif_on_frame%10)*this.gif_frame_width, Math.floor(this.gif_on_frame/10)*this.gif_frame_height, this.gif_frame_width, this.gif_frame_height, 0-(draw_offset_x), 0-(draw_offset_y), this.width, this.height);
                      }else{
                          game.ctx.drawImage(img,0-(draw_offset_x),0-(draw_offset_y),this.width,this.height); //how does this know which img is for which thing since img is not stored in the obj???
                      }
  
                  }
  
                  //___OUTLINES
                  game.ctx.lineWidth = 2;
                  if(game.SHOW_OUTLINES === true && this.type==="circle"){
                      game.ctx.strokeStyle = '#FF0000';
                      game.ctx.beginPath();
                      game.ctx.arc(0,0,draw_offset_x,0,2*Math.PI);
                      game.ctx.stroke();
                  }
                  if(game.SHOW_OUTLINES === true && this.type==="rectangle"){
                      game.ctx.strokeStyle = '#FF0000';
                      game.ctx.strokeRect(-(draw_offset_x),-(draw_offset_y),this.width,this.height);
                  }
                  if(game.SHOW_PADDED_OUTLINES === true && this.type==="circle" && (this.padding_x !== 1.0 || this.padding_y !== 1.0) ){
                      game.ctx.strokeStyle = '#0000FF';
                      game.ctx.beginPath();
                      game.ctx.arc(0,0,(draw_offset_x)*this.padding_x,0,2*Math.PI);
                      game.ctx.stroke();
                  }
                  if(game.SHOW_PADDED_OUTLINES === true && this.type==="rectangle" && (this.padding_x !== 1.0 || this.padding_y !== 1.0) ){
                      game.ctx.strokeStyle = '#0000FF';
                      game.ctx.strokeRect(-((draw_offset_x)*this.padding_x),-((draw_offset_y)*this.padding_y),this.width*this.padding_x,this.height*this.padding_y);
                  }
                  if(game.SHOW_PHYSICS_OUTLINES === true){
                      if(this.physics===true){
                          var w = Math.abs(this.body.bounds.max.x - this.body.bounds.min.x); 
                          var h = Math.abs(this.body.bounds.max.y - this.body.bounds.min.y); 
                          game.ctx.strokeStyle = '#FF00FF';
                          game.ctx.strokeRect(-(draw_offset_x),-(h/2),w,h);
                      }
                  }
  
              game.ctx.restore();
  
          },
  
          draw_between_points:function(_px1,_py1,_px2,_py2,_height){
  
            if(this.faux_destroy===true){return;}
  
              game.FAUX_Z_INDEX++;
              this.z_index = game.FAUX_Z_INDEX;
  
                game.ctx.globalAlpha = this.ALPHA;
                game.ctx.fillStyle = this.FILL_COLOR; 
  
              //this.rotate_freely = true;
  
              var dist = distanceBetweenPoints(_px1,_py1,_px2,_py2);
              var angle = angleBetweenPoints(_px1,_py1,_px2,_py2);
  
              game.ctx.save();
              game.ctx.translate((_px1+_px2)/2,(_py1+_py2)/2);
              game.ctx.rotate(angle);
              if(typeof _img === 'undefined' && this.type==="rectangle"){ //primitive rectangle
                    game.ctx.fillRect(-(dist/2), -(_height/2), dist, _height);
                }
                if(typeof _img !== 'undefined' && this.type==="rectangle"){ //image
                    game.ctx.drawImage(img, -(dist/2), -(_height/2), dist, _height);
                }
              
                if(game.SHOW_OUTLINES === true){
                    game.ctx.strokeStyle="#FF0000";game.ctx.lineWidth=2;
                    game.ctx.strokeRect(-(dist/2), -(_height/2), dist, _height);
                }
  
                game.ctx.restore();
  
          //now set the body
          this.set_angle(0,"r");
          this.set_position((_px1+_px2)/2,(_py1+_py2)/2);
          this.set_size(dist,_height);
          this.set_angle(angle,"r");
  
                if(game.SHOW_PHYSICS_OUTLINES === true){
                    if(this.physics===true){
                        var w = Math.abs(this.body.bounds.max.x - this.body.bounds.min.x); 
                        var h = Math.abs(this.body.bounds.max.y - this.body.bounds.min.y); 
                        game.ctx.strokeStyle = '#FF00FF';
                        game.ctx.strokeRect(this.x-(this.width/2),this.y-(h/2),w,h);
                    }
                }
          },
      destroy:function(){
          if(this.physics===true){
              Composite.removeBody(game.world, this.body);
          }
          var this_uid = this.uid; //'this' is undefined inside of foreach :(
          game.ALL_THINGS.forEach(function(thing,i){
              if(thing.uid===this_uid){
                  game.ALL_THINGS.splice(i, 1);
                  console.log("DESTROY!");
              }
          });
          this.set_position(0,0);
          this.set_size(0,0);
          //delete this; //doesn't do shit
          this.faux_destroy = true;
        },
        set_gif_speed:function(_s){
            this.gif_speed = _s;
        },
        set_gif_frame:function(_f){
            this.gif_on_frame = _f;
        },
        set_gif_in:function(_n){
            this.gif_in = _n;
            this.gif_on_frame = _n;
        },
        set_gif_out:function(_n){
            this.gif_out = _n;
            this.gif_on_frame = _n;
        },
        set_gif_playback:function(_p){
            this.gif_playback = _p;
        },
        animate_x:false,
        animate_y:false,
        animate_position:false,
        animate_width:false,
        animate_height:false,
        animate_scale:false,
        animate_rotate:false,
        animate_circular:false
    };
  
      //___SET IMAGE IF DEFINED
      if(typeof _img !== 'undefined'){
          var arr = []
  
          if(_img.indexOf(".png")!==-1){
              _img = path + "assets/png/"+_img;
          }
          if(_img.indexOf(".gif")!==-1){ //we have a gif (sprite) 'uid_NUMFRAMES_FRAMEWIDTH_FRAMEHEIGHT_100.gif'
              _img = _img.replace(".gif", ".png");
              _img = path + "assets/sprite/"+_img;
              Thing.gif = true;
              arr = _img.split("_");
              Thing.gif_frames = arr[1];
              Thing.gif_out = Thing.gif_frames-1;
              Thing.gif_frame_width = arr[2];
              Thing.gif_frame_height = arr[3];
          }
          if(_img.indexOf(".jpg")!==-1){
              _img = path + "assets/jpg/"+_img;
          }
  
          //Probably bad to reach into the db everytime... smart assets should be saved elsewhere that's quick to retrieve. Temporarily using local storage
          if (_img.split("_")[0] == "asset" ){
              var which_asset = _img.split("_")[1]
              //TODO: Check if asset actually exists
              var sprite_array = localStorage.getItem("asset_"+which_asset+"_sprites");
              _img = path + "assets/sprite/"+sprite_array.split(",")[0] + "_100.png" // TODO: have this adjustible by a size/dimensions modifier potentially. Where does the '100' come from?
              Thing.gif = true;
              arr = _img.split("_");
              Thing.gif_frames = arr[1];
              Thing.gif_out = Thing.gif_frames-1;
              Thing.gif_frame_width = arr[2];
              Thing.gif_frame_height = arr[3];
          }
  
          var img = new Image();
          img.onload = function(){
              console.log("Asset Loaded",_img);
              if (_width == 'auto'){
                  if (Thing.gif_frame_width != undefined){
                      Thing.width = Thing.gif_frame_width;
                  } else {
                      Thing.width = img.width;
                  }
              } 
              if (_height == 'auto'){
                  if (Thing.gif_frame_height != undefined){
                      Thing.height = Thing.gif_frame_height;
                  } else {
                      Thing.height = img.height;
                  }
              }
          };
          img.src = _img;
      }
  
      //___ADD THING TO ALL THINGS FOR BACKEND
      this.ALL_THINGS.push(Thing);
  
      //___RETURN THING TO THE FRONTEND
      return Thing;
  
  }
  
    fill_color(_r,_g,_b){
        this.FILL_COLOR = "rgb("+_r+","+_g+","+_b+")";
    }
  
    alpha(_a){
        this.ALPHA = _a;
    }
    
    background_color(_r,_g,_b){
        this.BACKGROUND_COLOR = "rgb("+_r+","+_g+","+_b+")";
    }
  
    
  //========================================================================
  //________________________________________________________________________ enviornmental stuff
  env_orientation(_o){
      this.ORIENTATION = _o;
      if(this.ORIENTATION==='landscape'){
          console.log("Running LANDSCAPE");
          this.HEIGHT = 640; 
          this.WIDTH = 1234;
      }else if(this.ORIENTATION==='portrait'){
          console.log("Running PORTRAIT");
          this.HEIGHT = 1224; 
          this.WIDTH = 650;
      }else{
          console.log("!uhoh no orientation!");
      }
  }
  env_framerate(_frames_per_s){ //should be allowed to change this?
    this.MS_PER_FRAME = ((1/_frames_per_s)*1000).toFixed(2);
  }
  env_gravity(_gx,_gy){
      this.engine.world.gravity.x = _gx; 
      this.engine.world.gravity.y = _gy;
  }
  env_show_bodies(_bool){
      this.SHOW_BODY_WIREFRAMES = _bool;
  }
  env_game_duration(_duration){
      this.GAME_DURATION = _duration;
      this.GAME_MS = _duration;
  }
  env_game_timer_location(_location) {
    this.GAME_TIMER_LOCATION = _location;
  }
  env_show_outlines(_bool){
    this.SHOW_OUTLINES = _bool;
  }
  env_show_padded_outlines(_bool){
    this.SHOW_PADDED_OUTLINES = _bool;
  }
  env_show_physics_outlines(_bool){
    this.SHOW_PHYSICS_OUTLINES = _bool;
  }
  walls(_bool_top, _bool_right, _bool_bottom, _bool_left, _bounce){
      if(typeof _bounce === 'undefined'){
          _bounce = 1.0;
      }
      var wall_thickness = 40 // arbitrary
  
      if (_bool_top){
          this.WALL_TOP = this.thing(this.WIDTH/2,this.HEIGHT+wall_thickness/2,this.WIDTH,wall_thickness,"rectangle");
          this.behavior_physics(this.WALL_TOP);
          this.WALL_TOP.set_fixed(true);
          this.WALL_TOP.set_restitution(_bounce);
      }
  
      if (_bool_bottom){
        this.WALL_BOTTOM = this.thing(this.WIDTH/2,0-wall_thickness/2,this.WIDTH,wall_thickness,"rectangle");
        this.behavior_physics(this.WALL_BOTTOM);
        this.WALL_BOTTOM.set_fixed(true);
        this.WALL_BOTTOM.set_restitution(_bounce);
      }
  
      if (_bool_left){
        this.WALL_LEFT = this.thing(0-wall_thickness/2,this.HEIGHT/2,wall_thickness,this.HEIGHT,"rectangle");
        this.behavior_physics(this.WALL_LEFT);
        this.WALL_LEFT.set_fixed(true);
        this.WALL_LEFT.set_restitution(_bounce);
      }
  
      if (_bool_right){
        this.WALL_RIGHT = this.thing(this.WIDTH+wall_thickness/2,this.HEIGHT/2,wall_thickness,this.HEIGHT,"rectangle");
        this.behavior_physics(this.WALL_RIGHT);
        this.WALL_RIGHT.this.set_fixed(true);
        this.WALL_RIGHT.this.set_restitution(_bounce);
      }
  }
  
  
  
  //========================================================================
  //________________________________________________________________________ game over
  game_over(_success){
  
  
    this.all_intervals.forEach(function(interval,i){// <-- problem with timer intervals continuing after game ended
          clearInterval(interval);
      });
  
      this.PAUSE = true;
      // if(GAME_OVER_STATE===true){
      // 	_success = true;
      // }
      console.log("setting success to, "+_success);
      this.GAME_OVER_SUCCESS = _success;
      this.GAME_OVER = true;
      this.parent.gameOver(_success);
  }
  
  
  //========================================================================
  //________________________________________________________________________ timer
  
  timer(_duration){
      var game = this
      var Timer = {
  
          duration: _duration,
          uid: randomString(12),
          timer_uid: undefined,
          starttime: undefined,
          paused: false,
          paused_remaining: undefined,
          start: function(){
              if(game.GAME_MS===0){ //game has not started! we cannot start timer but we can store it.
                  game.TIMER_WAIT.push(this);
              }else{
                  this.starttime = new Date();
                  this.timer_uid = setTimeout(game.callback_timer, this.duration, this.uid);	    		
              }
          },
          get_pct: function(){if(game.GAME_MS!==0){
              var timediff = new Date()-this.starttime;
              var pct = timediff/this.duration;
              return pct;
          }},
          clear: function(){if(game.GAME_MS!==0){
              clearTimeout(this.timer_uid);
          }},
          restart: function(){if(game.GAME_MS!==0){
              this.clear();
              this.start();
          }},
          pause: function(){if(game.GAME_MS!==0){
              this.paused_remaining = parseInt((1.0 - this.get_pct()) * this.duration, 10);
              this.clear();
          }},
          resume: function(){if(game.GAME_MS!==0){
              this.starttime = new Date();
              this.timer_uid = setTimeout(game.callback_timer, this.paused_remaining, this.uid);	    		
          }}
  
      };
  
      return Timer;
  }
  
  
  //========================================================================
  //________________________________________________________________________ timer repeating
  
  timer_repeating(_duration,_startnow){
    
    var game = this
      var TimerR = {
  
          duration:_duration,
          uid:game.randomString(12),
          timer_uid:undefined,
          starttime:undefined,
          start_now:_startnow,
          start:function(){
              if(game.GAME_MS===0){ //game has not started we cannot start timer yet. let's add to cu
                  game.INTERVAL_WAIT.push(this);
              }else{
                  this.starttime = new Date();
                  this.timer_uid = setInterval(game.callback_timer, this.duration, this.uid);
                  game.all_intervals.push(this.timer_uid);
                  if(_startnow===true){ //for intervals sometimes you want to start the first one immediately
                      game.callback_timer(this.uid);
                  }
              }
          },
          get_pct:function(){if(game.GAME_MS!==0){
              var timediff = new Date()-this.starttime;
              var pct = timediff/this.duration;
              return pct;
          }},
          clear:function(){if(game.GAME_MS!==0){
              clearInterval(this.timer_uid);
          }},
          pause: function(){if(game.GAME_MS!==0){
              this.fV_clear();
          }},
          resume: function(){if(game.GAME_MS!==0){
              this.starttime = new Date();
              this.timer_uid = setInterval(game.callback_timer, this.duration, this.uid);	   
              game.all_intervals.push(this.timer_uid); 		
          }}
  
      };
  
      return TimerR;
  }
  
  
  //========================================================================
  //________________________________________________________________________ interactions
  tappable(_obj){
      if(_obj instanceof Array) {
          _obj.forEach(function(_o,i){
              _o.tappable = true;
          });
      }else{
          _obj.tappable = true;
      }
  }
  draggable(_obj){
      if(_obj instanceof Array){
          _obj.forEach(function(_o,i){
              _o.draggable = true;
          });
      }else{
          _obj.draggable = true;
      }
  }
  launchable(_obj){
      if(_obj instanceof Array){
          _obj.forEach(function(_o,i){
              _o.launchable = true;
          });
      }else{
          _obj.launchable = true;
      }
  }
  
  
  //========================================================================
  //________________________________________________________________________ create a physics body (used by physics, collision, magnet, spring)
  create_physics_body(_obj){
  
      if(_obj.physics===false){
  
          //create a body
          var body;
          if(_obj.type=="rectangle"){
              body = Bodies.rectangle(_obj.x, _obj.y, _obj.width, _obj.height);
          }
          if(_obj.type=="circle"){
              body = Bodies.circle(_obj.x, _obj.y, _obj.width/2);
          }
          body.label = _obj.uid;
          body.frictionAir = 0;
          body.friction = 0;
          body.render.lineWidth = 0;
          body.render.strokeStyle = 'transparent';
          body.render.fillStyle = 'transparent';
          //body.collisionFilter.group = -1;
          _obj.body_mass_original = body.mass;
  
  
          //console.log("MASS: "+body.mass);
  
          body.okGravity = false; //okGravity is a customization of Matter.js
  
          Composite.add(this.allBodiesComposite, [body]);
  
          World.add(this.engine.world, [body]);
  
  
  
          _obj.body = body;
  
          _obj.apply_force = function(_fx,_fy,_px,_py){
              if (typeof _px !== 'undefined'){
                  Body.applyForce(this.body, {x:_px,y:_py}, {x:_fx,y:_fy});
              }else{
                  Body.applyForce(this.body, {x:this.x,y:this.y}, {x:_fx,y:_fy});
              }
          };
  
          _obj.get_force = function(){
              return this.body.force;
          };
  
          _obj.set_gravity = function(_bool){
              body.okGravity = _bool;
          };
  
          _obj.set_density = function(_d){ 
              Body.setDensity(this.body, _d);
          };
  
          _obj.set_mass = function(_m){ 
              Body.setMass(this.body, _m);
          };
  
          _obj.set_rotate_freely = function(_b){ 
              this.rotate_freely = _b;
          };
  
          _obj.set_physics_paddding = function(_px,_py){ //does this work for circle!?!?!?!
              //0-TL
              //1-TR
              //2-BR
              //3-BL
              var vertices = this.body.vertices;
              console.log(vertices);
              var ww = Math.abs(vertices[0].x - vertices[1].x);
              var hh = Math.abs(vertices[0].y - vertices[3].y);
              var nw = (1.0-_px) * ww;
              var nh = (1.0-_py) * hh;
              var diff_x = ww-nw;
              var diff_y = hh-nh;
              var vertices2 = [
                  {x:vertices[0].x+(diff_x/2), y:vertices[0].y+(diff_y/2)}, 
                  {x:vertices[1].x-(diff_x/2), y:vertices[1].y+(diff_y/2)}, 
                  {x:vertices[2].x-(diff_x/2), y:vertices[2].y-(diff_y/2)}, 
                  {x:vertices[3].x+(diff_x/2), y:vertices[3].y-(diff_y/2)}, 
              ]
              Body.setVertices(this.body, vertices2);
          };
  
          _obj.set_air_friction = function(_af){
              this.body.frictionAir = _af;
          };
  
          _obj.gravity = false;
  
          _obj.physics = true;
  
      }
  
  }
  
  
  //========================================================================
  //________________________________________________________________________ behavior: physics
  behavior_physics(_obj){
      if(_obj instanceof Array){ //you can pass an array to physics :)
          _obj.forEach(function(_o,i){
            this.create_physics_body(_o);
          });
      }else{
        this.create_physics_body(_obj);
      }
  }
  behavior_physics_remove(_obj){
      _obj.physics = false;
  }
  
  
  //========================================================================
  //________________________________________________________________________ behavior: collision
  behavior_collision(_obj,_restitution){
  
      if(typeof _restitution === 'undefined'){
          _restitution = 1.0;
      }
  
      this.create_physics_body(_obj);
  
      _obj.behavior_collision = true;
  
      _obj['restitution'] = _restitution;
      _obj.body.restitution = _restitution;
      _obj.set_restitution = function(_r){
          this.restitution = _r;
          this.body.restitution = _r;
      };
  
      _obj.body.collisionFilter.group = 1;
      _obj.set_collision_group = function(_g){
          this.body.collisionFilter.group = _g;
      };
  
  }
  behavior_collision_remove(_obj){
      _obj.behavior_collision = true;
  }
  
  //========================================================================
  //________________________________________________________________________ behavior: spring
  behavior_spring(_obj,_ax,_ay,_k,_d,_resting){ //thing, center x archor, center y anchor, spring stiffness, damping, resting distance
  
    this.create_physics_body(_obj);
  
      _obj.spring = true;
      
      var k_map = _k.map(0,10,0,0.005);
      _obj['spring_coefficient'] = k_map;
      // _obj.fV_set_spring_k = function(_k){
      //     this.spring_coefficient = _k;
      // };
  
      var d_map = _d.map(0,10,0,0.015); //just a wild guess but let's make damping 3x the spring coefficient
      _obj['spring_damping'] = d_map;
      // _obj.fV_set_spring_d = function(_d){
      //     this.spring_damping = _d;
      // };
  
      _obj['spring_resting_dist'] = _resting;
      // _obj.fV_set_spring_resting = function(_r){
      //     this.spring_resting_dist = _r;
      // };
  
      _obj['spring_anchor_x'] = _ax;
      _obj['spring_anchor_y'] = _ay;
      _obj.set_spring_anchor = function(_ax,_ay){
          this.spring_anchor_x = _ax;
          this.spring_anchor_y = _ay;
      };
      _obj.set_spring_anchor_x = function(_ax){
          this.spring_anchor_x = _ax;
      };
      _obj.set_spring_anchor_y = function(_ay){
          this.spring_anchor_y = _ay;
      };
  
  }
  behavior_spring_remove(_obj){
      _obj.spring = false;
  }
  
  
  //========================================================================
  //________________________________________________________________________ behavior: magnet
  behavior_magnet(_obj,_force,_radius,_gradient){
  
    this.create_physics_body(_obj);
  
      _obj.magnet = true;
  
      _obj['magnet_force'] = _force;
      _obj.set_magnet_force = function(_f){
          this.magnet_force = _f;
      };
  
      _obj['magnet_radius'] = _radius;
      _obj.set_magnet_radius = function(_r){
          this.magnet_radius = _r;
      };
  
      // _obj['magnet_gradient'] = _gradient;
      // _obj.fV_set_magnet_gradient = function(_bool){
      //     this.magnet_gradient = _bool;
      // };
  
  }
  behavior_magnet_remove(_obj){
      _obj.magnet = false;
  }
  
  
  //========================================================================
  //________________________________________________________________________ behavior: follow
  behavior_follow(_obj,_objf,_speed,_distance){
  
      _obj.follow = _objf.uid;
  
      var speed_map = _speed.map(0,1,0.0,0.1);
      _obj['follow_speed'] = speed_map; 
      _obj.fV_set_follow_speed = function(_s){
          this.follow_speed = _s;
      };
  
      _obj['follow_distance'] = _distance;
      // _obj.fV_set_follow_distance = function(_d){
      //     this.follow_distance = _d;
      // };
  
  }
  behavior_follow_remove(_obj){
      _obj.follow = false;
  }
  
  
  //========================================================================
  //________________________________________________________________________ behavior: circular path
  behavior_circular_path(_obj,_cx,_cy,_radius,_speed){
  
      _obj.circular_path = true;
  
      _obj['circular_path_radius'] = _radius;
  
      _obj['circular_path_cx'] = _cx;
      _obj['circular_path_cy'] = _cy;
      _obj.set_circular_path_center = function(_cx,_cy){
          this.circular_path_cx = _cx;
          this.circular_path_cy = _cy;
      };
      _obj.set_circular_path_center_x = function(_cx){
          this.circular_path_cx = _cx;
      };
      _obj.set_circular_path_center_y = function(_cy){
          this.circular_path_cy = _cy;
      };
  
      _obj['circular_path_speed'] = _speed;
      _obj.set_circular_path_speed = function(_s){
          this.circular_path_speed = _s;
      };	
  
      _obj['circular_path_angle'] = this.angle_between_points(_cx,_cy,_obj.x,_obj.y,"r");
      _obj.set_circular_path_angle = function(_r){
           this.circular_path_angle = _r;
      };	
      _obj.get_circular_path_angle = function(){
           return this.circular_path_angle;
      };	
  
  }
  
  
  //========================================================================
  //________________________________________________________________________ animations 
  
  //________________________________________________________________________ clear existing
  clear_existing_animation(_obj,_type){
      _obj.animations.forEach(function(animate,i){	
          if(animate.type===_type){
              _obj.animations.splice(i,1);
          }
      });	
  }
  //________________________________________________________________________ animate x
  animate_x(_obj,_x,_duration, _easing){
  
    this.clear_existing_animation(_obj,"x"); // no game.?
  
      if(_obj.physics===true){_obj.set_fixed(true);} //how do we safely pause physics?
  
      _obj.animate_x = true;
  
      var end_time = Date.now() + _duration;
  
      _obj.animations.push({
          type: "x",
          final_val: _x,
          duration: _duration,
          prev_x: 0,
          end_time: end_time,
          start_val: _obj.x,
          easing: _easing || 'linear',
      });
  
  }
  //________________________________________________________________________ animate y 
  animate_y(_obj,_y,_duration,_easing){
  
    this.clear_existing_animation(_obj,"y");
  
      if(_obj.physics===true){_obj.set_fixed(true);}
  
      _obj.animate_y = true;
  
      var end_time = Date.now() + _duration;
  
      _obj.animations.push({
          type: "y",
          final_val: _y,
          duration: _duration,
          prev_y: 0,
          end_time: end_time,
          start_val: _obj.y,
          easing: _easing || 'linear',
      });
  
  }
  //________________________________________________________________________ animate position 
  animate_position(_obj,_x,_y,_duration,_easing){
  
    this.clear_existing_animation(_obj,"position");
  
      if(_obj.physics===true){_obj.set_fixed(true);} 
  
      _obj.animate_position = true;
  
      var end_time = Date.now() + _duration;
  
      _obj.animations.push({
          type:"position",
          final_val_y:_y,
          final_val_x:_x,
          duration:_duration,
          prev_x:0,
          prev_y:0,
          end_time: end_time,
          start_val_x: _obj.x,
          start_val_y: _obj.y,
          easing: _easing || 'linear',
      });
  
  }
  //________________________________________________________________________ animate width 
  animate_width(_obj,_width,_duration, _easing){
  
    this.clear_existing_animation(_obj,"width");
  
      _obj.animate_width = true;
  
      var end_time = Date.now() + _duration;
  
      _obj.animations.push({
          type: "width",
          final_val: _width,
          duration: _duration,
          end_time: end_time,
          start_val: _obj.width,
          easing: _easing || 'linear',
      });
  
  }
  //________________________________________________________________________ animate height 
  animate_height(_obj,_height,_duration, _easing){
  
    this.clear_existing_animation(_obj,"height");
  
      _obj.animate_height = true;
  
      var end_time = Date.now() + _duration;
  
      _obj.animations.push({
          type: "height",
          final_val: _height,
          duration: _duration,
          end_time: end_time,
          start_val: _obj.height,
          easing: _easing || 'linear',
      });
  
  }
  //________________________________________________________________________ animate rotate
  animate_rotate(_obj,_rotation,_units,_abs_or_rel,_duration,_easing,_mode){
  
    this.clear_existing_animation(_obj,"rotate");
  
      _obj.animate_rotate = true;
  
      if(_units==="d"){
          _rotation = _rotation*Math.PI/180;
      }
  
      var final_val, rad_diff;
      if(_abs_or_rel==="absolute"){
          final_val = _rotation; 
      }
      if(_abs_or_rel==="relative"){
          final_val = _obj.rotation + _rotation; 
      }
  
      var amount_to_rotate = final_val-_obj.rotation;
      //if >0, going cw
      //if <0, going ccw
  
      var direction = "";
  
      if(_mode==="cw"){
  
          direction = "cw";
  
          if(amount_to_rotate<0){ //uhoh
              amount_to_rotate = 2*Math.PI + amount_to_rotate;
          }
  
      }else if(_mode==="ccw"){
  
          direction = "ccw";
  
          if(amount_to_rotate>0){
              amount_to_rotate =  amount_to_rotate - 2*Math.PI;
          }
          
      }else if(_mode==="quick"){
  
          if(amount_to_rotate>Math.PI){ //uhoh
  
              direction = "ccw";
              amount_to_rotate =  amount_to_rotate - 2*Math.PI;
  
          }else if(amount_to_rotate<-Math.PI){
  
              direction = "cw";
              amount_to_rotate = 2*Math.PI + amount_to_rotate;
  
          }else if(amount_to_rotate>0){
  
              direction = "cw";
  
          }else if(amount_to_rotate<0){
  
              direction = "ccw";
  
          }else{}
  
      }else{}
  
      var end_time = Date.now() + _duration;
  
      _obj.animations.push({
          type: "rotate",
          final_val: final_val,
          amount_to_rotate:  amount_to_rotate,
          duration: _duration,
          end_time: end_time,
          start_val: _obj.rotation,
          direction: direction,
          easing: _easing || 'linear',
      });
  
  }
  //________________________________________________________________________ animate scale 
  animate_scale(_obj,_scale,_duration,_easing){ 
  
    this.clear_existing_animation(_obj,"scale");
  
      _obj.animate_scale = true;
  
      var new_h = _scale*_obj.height;
      var new_w = _scale*_obj.width;
  
      var end_time = Date.now() + _duration; 
  
      _obj.animations.push({
          type: "scale",
          final_val_h: new_h,
          final_val_w: new_w,
          duration: _duration,
          end_time: end_time,
          start_val_w: _obj.width,
          start_val_h: _obj.height,
          easing: _easing || 'linear',
      });
  
  }
  //________________________________________________________________________ animation stop
  animation_stop(_obj,_type){
      _obj.animations.forEach(function(animate,i){	
          if(animate.type===_type){
              _obj.animations.splice(i,1);
              console.log("animation stopped");
          }
      });
  }
  
  
  //========================================================================
  //________________________________________________________________________ oscillations
  
  //________________________________________________________________________ clear existing oscillation
  clear_existing_oscillation(_obj,_type){
      _obj.oscillations.forEach(function(oscillate,i){	
          if(oscillate.type===_type){
              _obj.oscillations.splice(i,1);
              console.log("oscillation cleared");
          }
      });	
  }
  //________________________________________________________________________ oscillate x
  oscillate_x(_obj,_amplitude,_duration){
  
    this.clear_existing_oscillation(_obj,"x");
  
      var end_time = Date.now() + _duration;
  
      _obj.oscillations.push({
          type: "x",
          start_x: _obj.x,
          amplitude: _amplitude,
          duration: _duration,
          prev_x: 0,
          end_time: end_time,
      });
  
  }
  //________________________________________________________________________ oscillate y
  oscillate_y(_obj,_amplitude,_duration){
  
    this.clear_existing_oscillation(_obj,"y");
  
      var end_time = Date.now() + _duration;
  
      _obj.oscillations.push({
          type: "y",
          start_y: _obj.y,
          amplitude: _amplitude,
          duration: _duration,
          prev_y: 0,
          end_time: end_time,
      });
  
  }
  //________________________________________________________________________ oscillate width
  oscillate_width(_obj,_amplitude,_duration){
  
    this.clear_existing_oscillation(_obj,"width");
  
      var end_time = Date.now() + _duration;
  
      _obj.oscillations.push({
          type: "width",
          start_width: _obj.width,
          amplitude: _amplitude,
          duration: _duration,
          end_time: end_time,
      });
  
  }
  //________________________________________________________________________ oscillate height
  oscillate_height(_obj,_amplitude,_duration){
  
    this.clear_existing_oscillation(_obj,"height");
  
      var end_time = Date.now() + _duration;
  
      _obj.oscillations.push({
          type: "height",
          start_height: _obj.height,
          amplitude: _amplitude,
          duration: _duration,
          end_time: end_time,
      });
  
  }
  //________________________________________________________________________ oscillate scale
  oscillate_scale(_obj,_amplitude,_duration){
  
    this.clear_existing_oscillation(_obj,"scale");
  
      var end_time = Date.now() + _duration;
  
      _obj.oscillations.push({
          type: "scale",
          start_width: _obj.width,
          start_height: _obj.height,
          amplitude: _amplitude,
          duration: _duration,
          end_time: end_time,
      });
  
  }
  //________________________________________________________________________ oscillation stop
  oscillation_stop(_obj,_type){
      _obj.oscillations.forEach(function(oscillate,i){	
          if(oscillate.type===_type){
              _obj.oscillations.splice(i,1);
          }
      });
  }
  
  
  //========================================================================
  //________________________________________________________________________ sound
  sound(_file) {
      var game = this
      var sound = {};
  
      if(_file !== undefined || _file !== null) {
          sound = new Howl({
            src: [path + 'assets/mp3/' + _file],
            autoplay: false,
            loop: false,
            volume: 0.7,
            rate: 1.0,
            onend: function(){}
          });
      }
  
      var Sound = {
          uid:game.randomString(12),
          fV_play: function() {
              sound.play();
          },
          fV_stop: function() {
              sound.stop();
          },
          fV_pause: function() {
              sound.pause();
          },
          fV_rate: function(_r) { //0.5-4 according to howler.js
              sound.rate(_r);
          },
          fV_volume: function(_v) {
              // Define boundary [0-1]
              var volume = Math.min(_v, 1.0);
              volume = Math.max(volume, 0.0);
              sound.volume(volume);
          }
      };
  
      this.ALL_SOUNDS.push(Sound);
  
      return Sound;
  }
  stop_all_sounds() {
      for (var i = 0; i < this.ALL_SOUNDS.length; i++) {
        this.ALL_SOUNDS[i].fV_stop();
      }
  }
  
  
  //========================================================================
  //________________________________________________________________________ blip
  blip(_freq, _dur, _vol) {
      var game = this
      var Blip = {
          dur: _dur,
          vol: _vol,
          freq: _freq,
          play: function() {
              // create Oscillator node
              var oscillator = game.audioCtx.createOscillator(); //TODO: Audioctx?
              oscillator.type = 'sine';
              oscillator.frequency.value = this.freq; // value in hertz
  
              // create Gain (volume) node
              var gain = game.audioCtx.createGain();
              gain.gain.value = this.vol || 0.5;
  
              oscillator.connect(gain);
              gain.connect(game.audioCtx.destination);
  
              //oscillator.connect(audioCtx.destination);
  
              oscillator.start();
  
              window.setTimeout(function() {
                  gain.gain.value = 0;
                  oscillator.stop();
                  oscillator.disconnect();
              }, this.dur);
          },
          fV_set_frequency(_f) {
              this.freq = _f;
          }
      };
  
      return Blip;
  }
  
  
  //========================================================================
  //________________________________________________________________________ line
  line(_x1, _y1, _x2, _y2, _weight) {
      var game = this
    var Line = {
      x1: _x1,
      y1: _y1,
      x2: _x2,
      y2: _y2,
      weight: _weight,
      cap:"round",
      //color: '#000',
      draw: function() {
        game.ctx.beginPath();
        game.ctx.moveTo(this.x1, this.y1);
        game.ctx.lineTo(this.x2, this.y2);
        game.ctx.lineCap = this.cap;
        game.ctx.lineWidth = this.weight;
        game.ctx.globalAlpha = game.ALPHA;
        game.ctx.strokeStyle = game.FILL_COLOR;
        game.ctx.stroke();
      },
      set_weight: function(_weight) {
        this.weight = _weight;
      },
      set_position: function(_x1, _y1, _x2, _y2) {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
      },
      set_start_point: function(_x1, _y1) {
        this.x1 = _x1;
        this.y1 = _y1;
      },
      set_end_point: function(_x2, _y2) {
        this.x2 = _x2;
        this.y2 = _y2;
      },
      set_cap: function(_cap) {
        this.cap = _cap;
      }
      // fV_setColor: function(_color) {
      //   this.color = _color;
      // }
    };
  
    return Line;
  }
  
  
  //========================================================================
  //________________________________________________________________________ text
  text(_x, _y, _font, _size, _string) {
      var game = this
      var Text = {
          x: _x,
          y: _y,
          font: _font,
          size: _size,
          string: _string,
          maxWidth: null,
          alignment: 'center',
          draw: function() {
              game.ctx.globalAlpha = game.ALPHA;
              game.ctx.fillStyle = game.FILL_COLOR;
              game.ctx.textBaseline = 'middle';
              game.ctx.textAlign = this.alignment;
              game.ctx.font = this.size + 'px ' + this._get_font(this.font);
  
              if (this.maxWidth) {
                  this._wrap_text();
              } else {
                  game.ctx.fillText(this.string, this.x, this.y);
              }
          },
          set_position: function(_x,_y){
              this.x = _x;
              this.y = _y;
          },
          set_size: function(_s){
              this.size = _s;
          },
          set_message: function(_string) {
              this.string = _string;
          },
          set_max_width: function(_maxWidth) {
              this.maxWidth = _maxWidth;
          },
          set_alignment: function(_alignment) {
              this.alignment = _alignment;
          },
          set_font: function(_font) {
              this.font = _font;
  
              game.ALL_FONTS.push(this.font);
          },
          _wrap_text: function() {
              var words = this.string.split(' ');
              var line = '';
              var x = this.x;
              var y = this.y;
  
              for(var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = game.ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > this.maxWidth && n > 0) {
                  game.ctx.fillText(line, x, y);
                  line = words[n] + ' ';
                  y += (this.size + 4);
                }
                else {
                  line = testLine;
                }
              }
              game.ctx.fillText(line, x, y);
          },
          _get_font: function(font) {
              const fontObj = game.globalFontList[font];
  
              if (fontObj) {
                  return fontObj.style;
              } else {
                  console.warn('Selected font was not found. Using generic font instead.');
                  return ('Arial');
              }
          }
      };
  
      this.ALL_FONTS.push(Text.font);
  
      return Text;
  }
  
  
  //========================================================================
  //________________________________________________________________________ repeating background 
  repeating_background(_x,_y,_width,_height,_orientation,_speed,_img) {
      if(_img.indexOf(".jpg")!==-1) {
          _img = path + "assets/jpg/"+_img;
      } else if(_img.indexOf(".png")!==-1) {
          _img = path + "assets/png/"+_img;
      } else {
          console.error('Repeating background has incorrect filetype');
      }
  
      var img = new Image();
      img.src = _img;
      
      var game = this
      var RepeatingBackground = {
          uid: game.randomString(12),
          x: _x,
          y: _y,
          posX: 0,
          posY: 0,
          width: _width,
          height: _height,
          orientation: _orientation,
          speed: _speed,
          img: img,
          draw: false,
          fV_draw: function(){
               if (this.orientation === 'horizontal'){
                   if (this.width < game.WIDTH) {
                       for (var i = 0; i <= game.WIDTH*2 + this.width; i+= this.width) {
                          game.ctx.drawImage(this.img, this.x + this.posX + i, this.y);
                          game.ctx.drawImage(this.img, this.x + this.posX - i - this.width, this.y);
                       }
  
                       this.posX += this.speed;
  
                      if ((this.posX + this.width) >= game.WIDTH) {
                          this.posX = game.WIDTH % this.width;
                      } else if (this.posX <= -game.WIDTH) {
                          this.posX = -(game.WIDTH % this.width);
                      }
                   } else {
                       game.ctx.drawImage(this.img, this.x + this.posX, this.y);
                       game.ctx.drawImage(this.img, this.x + this.posX + this.width, this.y);
                      game.ctx.drawImage(this.img, this.x + this.posX - this.width, this.y);
  
                      this.posX += this.speed;
  
                      if (this.posX >= this.width) {
                          this.posX = 0;
                      } else if (this.posX <= -this.width) {
                          this.posX = 0;
                      }
                   }
               } else if (this.orientation === 'vertical') {
                   if (this.height < game.HEIGHT) {
                       for (var i = 0; i <= game.HEIGHT*2 + this.height; i+= this.height) {
                          game.ctx.drawImage(this.img, this.x, this.y + this.posY + i);
                          game.ctx.drawImage(this.img, this.x, this.y + this.posY - i);
                      }
  
                      this.posY += this.speed;
  
                      if ((this.posY + this.height) >= game.HEIGHT) {
                          this.posY = game.HEIGHT % this.height;
                      } else if (this.posY <= -game.HEIGHT) {
                          this.posY = -(game.HEIGHT % this.height);
                      }
                   } else {
                       game.ctx.drawImage(this.img, this.x, this.y + this.posY);
                       game.ctx.drawImage(this.img, this.x, this.y + this.posY + this.height);
                      game.ctx.drawImage(this.img, this.x, this.y + this.posY - this.height);
  
                      this.posY += this.speed;
  
                      if (this.posY > this.height) {
                          this.posY = 0;
                      } else if (this.posY < -this.height) {
                          this.posY = 0;
                      }
                   }
               } else {
                   console.error('Repeatable background has incorrect orientation.');
               }
          },
          set_speed: function(_speed) {
              this.speed = _speed;
          },
          destroy: function() {
              game.ALL_BACKGROUNDS.forEach(function(bg, i){
                  if(bg.uid === this.uid){
                      game.ALL_BACKGROUNDS.splice(i, 1);
                  }
              }.bind(this));
          }
      };
  
      this.ALL_BACKGROUNDS.push(RepeatingBackground);
  
      return RepeatingBackground;
  }
  
  
  
  
  
  
  
  
  
  //======================================================================== The Goods AKA Math
  
  //________________________________________________________________________ fV_random
  random(_min,_max){
      return Math.floor(Math.random()*(_max-_min+1)+_min);
  }
  
  //________________________________________________________________________ radians and degrees convert
  d_to_r(_d){
      return (_d*((2*Math.PI)/360));
  }
  r_to_d(_r){
      return (_r*(360/(2*Math.PI)));
  }
  
  //________________________________________________________________________ fV_coincide
  coincide(_obj1,_obj2){
      var obj1_pts = this.getVertices(_obj1,"obj",true);
      var obj2_pts = this.getVertices(_obj2,"obj",true);
      var coincide = this.doPolygonsIntersect(obj1_pts,obj2_pts);
      return coincide;
  
  }
  //________________________________________________________________________ fV_encapsulate
  encapsulate(_obj1,_obj2){  //_obj1 encapsulated by _obj2
  
      var obj1_pts = getVertices(_obj1,"obj",true);
      
      for(var i=0;i<obj1_pts.length;i++){
          if(this.point_is_inside(_obj2,obj1_pts[i].x,obj1_pts[i].y)===false){
              return false;
          }
      }
      
      return true;
  
  }
  //________________________________________________________________________ fV_angle_between_points
  angle_between_points(_p1x,_p1y,_p2x,_p2y,_units,_mode){
      
      var a = this.roundToTwo(this.angleBetweenPoints(_p1x,_p1y,_p2x,_p2y));
  
      if(_units==="d"){
          a = a * (180/Math.PI);
      }
  
      if(_mode==="cw" && a<0){
          if(_units==="d"){
              a = 360 + a;
          }else{
              a = 2*Math.PI + a;
          }
      }
  
      if(_mode==="ccw" && a>0){
          if(_units==="d"){
              a = a - 360;
          }else{
              a = a - 2*Math.PI;
          }
      }
  
      return a;
      
  }
  
  //________________________________________________________________________ INTERSECTING LINES
  //________________________________________________________________________ takes points, returns point of intersection
  intersecting_linespts_point(_l1x1,_l1y1,_l1x2,_l1y2, _l2x1,_l2y1,_l2x2,_l2y2){
      var intersect_point = lineIntersect2(_l1x1,_l1y1,_l1x2,_l1y2, _l2x1,_l2y1,_l2x2,_l2y2);
      if(intersect_point){
          return intersect_point;
      }else{
          return false;
      }
  }
  //________________________________________________________________________ takes points, returns true/false
  intersecting_linespts(_l1x1,_l1y1,_l1x2,_l1y2, _l2x1,_l2y1,_l2x2,_l2y2){
      return lineIntersect(_l1x1,_l1y1,_l1x2,_l1y2, _l2x1,_l2y1,_l2x2,_l2y2);
  }
  //________________________________________________________________________ takes lines, returns true/false
  intersecting_lines(_line1,_line2){
      return lineIntersect(_line1.x1,_line1.y1,_line1.x2,_line1.y2, _line2.x1,_line2.y1,_line2.x2,_line2.y2);
  }
  //________________________________________________________________________ takes lines, returns point of intersect
  intersecting_lines_point(_line1,_line2){
      var intersect_point = lineIntersect2(_line1.x1,_line1.y1,_line1.x2,_line1.y2, _line2.x1,_line2.y1,_line2.x2,_line2.y2);
      if(intersect_point){
          return intersect_point;
      }else{
          return false;
      }
  }
  
  //! very very very slow !
  //________________________________________________________________________ line_intersects_thing  
  line_intersects_thing(_thing,_line){
  
      var vertices = getVertices(_thing,"obj",true); //_data_type can be "obj" or "arr", _padding is true/false
  
      console.log(vertices);
  
      var count;
      if(_thing.type==="rectangle"){
          count = 4;
      }
      if(_thing.type==="circle"){
          count = 8;
      }
  
      //check each edge of the rectangle
      for(var i=0;i<count;i++){
          var next = i+1; if(next===count){next=0;}
          var intersect = this.intersecting_linespts(_line.x1,_line.y1,_line.x2,_line.y2, vertices[i].x, vertices[i].y, vertices[next].x, vertices[next].y);
          if(intersect===true){ //if we intersect with any of the four edges of the rectangle, return true
              return true;
          }
      }
      return false; //no intersection, return false
  
  }
  
  //________________________________________________________________________ angle_between_points
  distance_between_points(_p1x,_p1y,_p2x,_p2y){
      return distanceBetweenPoints(_p1x,_p1y,_p2x,_p2y);
  }
  
  
  //========================================================================
  //________________________________________________________________________ point_is_inside
  point_is_inside(_obj,_x,_y){
  
      if(_obj.physics===true){
  
          if(Vertices.contains(_obj.body.vertices, {x:_x,y:_y})){
              return true;
          }else{
              return false;
          }
  
      }else{
  
          //!!!should we include padding???
  
          if(_obj.type==="rectangle"){
              var v = getVertices(_obj,"arr",true);
              if(pointInPolygon([_x,_y], v)){
                  return true;
              }else{
                  return false;
              }
          }
  
          //!!! doesn't work for padding
          if(_obj.type==="circle"){
              var dist = Math.sqrt((_x-_obj.x)*(_x-_obj.x) + (_y-_obj.y)*(_y-_obj.y));
              if(dist<(_obj.width/2)){
                  return true;
              }else{
                  return false;
              }
          }
  
      }
  
  }
  
  //======================================================================== Accelerometer / Device Movement
  //________________________________________________________________________ get_device_acceleration_magnitude
  get_device_acceleration_magnitude(){
      var magnitude = Math.sqrt((this.DEVICE_ACCELERATION.x * this.DEVICE_ACCELERATION.x) + (this.DEVICE_ACCELERATION.y * this.DEVICE_ACCELERATION.y) + (this.DEVICE_ACCELERATION.z * this.DEVICE_ACCELERATION.z)) 
      return magnitude;
  }
  
  //========================================================================
  //________________________________________________________________________ log
  log_this(_type,_msg){
      console.log(_msg);
  }
    //interactions
    
    //runner
    update_backend(){
  
        var game = this
      //_______________________________________________________________
      //_______________________________________________________________ gif update frame
      game.GAME_TICKS++;
  
  
  
      var current_time = Date.now();
  
      game.ALL_THINGS.forEach(function(thing,i){
  
          if(thing.gif===true){
  
              //so we can update every 1,2,3,4,5,6,7,8,9,10 ticks
              if(thing.gif_speed>0 && thing.gif_speed<=1.0){ 
  
                  if((game.GAME_TICKS%(11-(Math.round(thing.gif_speed*10))))===0){
                      if(thing.gif_playback==="forwards"){
                          thing.gif_on_frame++;
                          if(thing.gif_on_frame>thing.gif_out){
                              thing.gif_on_frame=thing.gif_in;
                          }
                      }
                      if(thing.gif_playback==="backwards"){
                          thing.gif_on_frame--;
                          if(thing.gif_on_frame<thing.gif_in){
                              thing.gif_on_frame=thing.gif_out;
                          }					
                      }
                      if(thing.gif_playback==="wiggle"){
  
                          if(thing.gif_wiggle_direction===true){
                              thing.gif_on_frame++;
                              if(thing.gif_on_frame>=thing.gif_out){
                                  thing.gif_wiggle_direction = false;
                              }							
                          }else{
                              thing.gif_on_frame--;
                              if(thing.gif_on_frame<=thing.gif_in){
                                  thing.gif_wiggle_direction = true;
                              }							
                          }
                          //console.log(thing.gif_on_frame);
                      }
                  }
  
              }else{ //0, pause
                  //console.log("gifpause",thing.gif_speed);
              }
  
          }
  
      });
  
  
      //_______________________________________________________________
      //_______________________________________________________________ matter bodies
      game.ALL_THINGS.forEach(function(thing,i){
  
          //__________________________________________________________ show or hide 
          if(thing.physics===true){
              if(game.SHOW_BODY_WIREFRAMES===false){
                  thing.body.render.visible = false;
              }else{
                  thing.body.render.visible = true;
              }
          }
  
  
      });
  
  
      //_______________________________________________________________
      //_______________________________________________________________ velocity (non physics)
      game.ALL_THINGS.forEach(function(thing,i){
          if(thing.physics===false){
              thing.x += thing.vx*1;
              thing.y += thing.vy*1;
          }
      });
  
      //_______________________________________________________________
      //_______________________________________________________________ angular roatation (non physics)
      game.ALL_THINGS.forEach(function(thing,i){
          if(thing.angular_velocity!==0){
              var rotation_per_frame = thing.angular_velocity/60.0; //we are running ~60fps
              thing.rotation += rotation_per_frame;
  
          }
      });
  
      //_______________________________________________________________
      //_______________________________________________________________ behavior: follow
      game.ALL_THINGS.forEach(function(thing,i){
  
          if(thing.follow!==false){ //check if following
  
              game.ALL_THINGS.forEach(function(thing_following,i){ //loop through all things again
  
                  if(thing.follow===thing_following.uid){ //check if this is the thing we are following
  
                      var dist = game.distanceBetweenPoints(thing.x,thing.y,thing_following.x,thing_following.y);
  
                      if(dist > thing.follow_distance){ //only update position if our distance is greater than the follow distance
  
                          var xx = thing.x + ( (thing_following.x-thing.x) * thing.follow_speed );
                          var yy = thing.y + ( (thing_following.y-thing.y) * thing.follow_speed );
  
                          thing.set_position(xx,yy);
  
                          //!important
                          thing.update_faux_velocity();
  
                      }
  
                  }
  
              });
          }
  
      });
  
  
      //_______________________________________________________________
      //_______________________________________________________________ behavior: circular path
      game.ALL_THINGS.forEach(function(thing,i){
  
          if(thing.circular_path===true){ //check if circular path
  
              thing.circular_path_angle += thing.circular_path_speed;
  
              //let's keep it positive
              if(thing.circular_path_angle<0){
                  thing.circular_path_angle = (2*Math.PI) + thing.circular_path_angle;
              }
  
              //let's keep it under 2pi
              if(thing.circular_path_angle>2*Math.PI){
                  thing.circular_path_angle -= 2*Math.PI;
              }
  
              var xx = thing.circular_path_cx + ( Math.cos(thing.circular_path_angle)*thing.circular_path_radius );
              var yy = thing.circular_path_cy + ( Math.sin(thing.circular_path_angle)*thing.circular_path_radius );
  
              thing.set_position(xx,yy);
  
              //!important
              thing.update_faux_velocity();
  
          }
  
      });
  
      //_______________________________________________________________
      //_______________________________________________________________ animations
  
      function get_rate(end_time, duration, easing) {
          easing = easing || 'linear';
          var remaining_time = end_time - current_time;
          var easingEq = game.easing_types[easing];
          var pct = 1 - remaining_time / duration;
          return easingEq(pct);
      }
  
      game.ALL_THINGS.forEach(function(thing,i){
  
          thing.animations.forEach(function(animation,ii){
  
              //__________________________________________________________ animation x
              if(animation.type==="x"){ 
  
                  var rate = get_rate(animation.end_time, animation.duration, animation.easing);
  
                  var xx = animation.start_val + (rate * (animation.final_val - animation.start_val));
  
                  thing.set_x(xx);
                  
                  if (rate >= 0.999) {
                      var xx = animation.final_val;
                      thing.set_x(xx);
                      thing.animations.splice(ii,1);
                      thing.animate_x = false;
                      game.callback_animation_done(thing.uid,"x");
                  }
  
                  //!important
                  thing.update_faux_velocity();
  
              }
              //__________________________________________________________ animation y
              if(animation.type==="y"){ 
  
                  var rate = get_rate(animation.end_time, animation.duration, animation.easing);
  
                  var yy = animation.start_val + (rate * (animation.final_val - animation.start_val));
  
                  thing.set_y(yy);
  
                  if (rate >= 0.999) {
                      var yy = animation.final_val;
                      thing.set_y(yy);
                      thing.animations.splice(ii,1);
                      thing.animate_y = false;
                      game.callback_animation_done(thing.uid,"y");
                  }
  
                  //!important
                  thing.update_faux_velocity();
  
              }
              //__________________________________________________________ animation position
              if(animation.type==="position"){
  
                  var rate = get_rate(animation.end_time, animation.duration, animation.easing);
  
                  var yy = animation.start_val_y + (rate * (animation.final_val_y - animation.start_val_y));
                  var xx = animation.start_val_x + (rate * (animation.final_val_x - animation.start_val_x));
  
                  thing.set_position(xx,yy);
  
                  if (rate >= 0.999) {
                      var yy = animation.final_val_y;
                      var xx = animation.final_val_x;
                      thing.set_position(xx,yy);
                      thing.animations.splice(ii,1);
                      thing.animate_position = false;
                      game.callback_animation_done(thing.uid,"position");
                  }
  
                  //!important
                  thing.update_faux_velocity();
  
              }
              //__________________________________________________________ animation width
              if(animation.type==="width"){ 
  
                  var rate = get_rate(animation.end_time, animation.duration, animation.easing);
  
                  var ww = animation.start_val + (rate * (animation.final_val - animation.start_val));
  
                  thing.set_width(ww);
  
                  if (rate >= 0.999) {
                      var ww = animation.final_val;
                      thing.set_width(ww);
                      thing.animations.splice(ii,1);
                      thing.animate_width = false;
                      game.callback_animation_done(thing.uid,"width");
                  }
  
              }
              //__________________________________________________________ animation height
              if(animation.type==="height"){ 
  
                  var rate = get_rate(animation.end_time, animation.duration, animation.easing);
  
                  var hh = animation.start_val + (rate * (animation.final_val - animation.start_val));
  
                  thing.set_height(hh);
  
                  if (rate >= 0.999) {
                      var hh = animation.final_val;
                      thing.set_height(hh);
                      thing.animations.splice(ii,1);
                      thing.animate_height = false;
                      game.callback_animation_done(thing.uid,"height");
                  }
  
  
  
              }
              //__________________________________________________________ animation rotate
              if(animation.type==="rotate"){ 
  
                  var rate = get_rate(animation.end_time, animation.duration, animation.easing);
  
                  var rr = animation.start_val + (rate * animation.amount_to_rotate);
  
                  thing.set_angle(rr,"r");
  
                  if (rate >= 0.999) {
                      var rr = animation.final_val; //causing jerk with some easing 
                      thing.set_angle(rr,"r");
                      thing.animations.splice(ii,1);
                      thing.animate_rotation = false;
                      game.callback_animation_done(thing.uid,"rotation");
                  }
  
              }
              //__________________________________________________________ animation scale
              if(animation.type==="scale"){ 
  
                  var rate = get_rate(animation.end_time, animation.duration, animation.easing);
  
                  var hh = animation.start_val_h + (rate * (animation.final_val_w - animation.start_val_h));
                  var ww = animation.start_val_w + (rate * (animation.final_val_h - animation.start_val_w));
  
                  thing.set_size(ww,hh);
  
                  if (rate >= 0.999) {
                      var hh = animation.final_val_h;
                      var ww = animation.final_val_w;
                      thing.set_size(ww,hh);
                      thing.rotation = animation.final_val;
                      thing.animations.splice(ii,1);
                      thing.animate_rotation = false;
                      game.callback_animation_done(thing.uid,"rotation");
                  }
              }
  
  
  
  
  
          });
  
      });
  
      //_______________________________________________________________
      //_______________________________________________________________oscillations
      game.ALL_THINGS.forEach(function(thing,i){
  
          thing.oscillations.forEach(function(oscillation,ii){
  
              //__________________________________________________________ oscillate x
              if(oscillation.type==="x"){ 
  
                  var rate = get_rate(oscillation.end_time, oscillation.duration);
                  var xx = oscillation.start_x + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
                  thing.set_x(xx);
  
              }
              //__________________________________________________________ oscillate y
              if(oscillation.type==="y"){ 
  
                  var rate = get_rate(oscillation.end_time, oscillation.duration);
                  var yy = oscillation.start_y + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
                  thing.set_y(yy);
              }
              //__________________________________________________________ oscillate width
              if(oscillation.type==="width"){ 
  
                  var rate = get_rate(oscillation.end_time, oscillation.duration);
                  var ww = oscillation.start_width + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
                  thing.set_width(ww);
  
              }
              //__________________________________________________________ oscillate height
              if(oscillation.type==="height"){ 
  
                  var rate = get_rate(oscillation.end_time, oscillation.duration);
                  var hh = oscillation.start_height + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
                  thing.set_height(hh);
  
              }
              //__________________________________________________________ oscillate scale
              if(oscillation.type==="scale"){ 
  
                  var rate = get_rate(oscillation.end_time, oscillation.duration);
                  var hh = oscillation.start_height + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
                  var ww = oscillation.start_width + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
                  thing.set_size(ww,hh);
  
              }
  
              //!important
              thing.update_faux_velocity();
  
          });
  
      });
  
  }
    
    update_draw(){
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
      //game.ctx.fillStyle = "rgb(250,10,10)"
      this.ctx.fillStyle = this.BACKGROUND_COLOR;
      this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
      this.ctx.fill();
      console.log("Game still running, asshole")
  }
  
  
  
  update_matter(){ 
  
  
    var game = this
      //__________________________________________________________
      //__________________________________________________________ bodies
      Runner.tick(game.runner, game.engine, game.MS_PER_FRAME);
  
  
      //__________________________________________________________
      //__________________________________________________________ spring
      game.ALL_THINGS.forEach(function(thing,i){
          if(thing.physics===true && thing.spring===true){
  
              if(thing.dragging===true){
  
                  thing.set_mass(Infinity);
  
              }else{
  
                  //uhoh fucks up physic collisions !!!
                  thing.set_mass(thing.body_mass_original);
  
                  //dist
                  var dist = distanceBetweenPoints(thing.x,thing.y,thing.spring_anchor_x,thing.spring_anchor_y);
  
                  //console.log(thing.spring_anchor_x+":"+thing.spring_anchor_y);
  
                  //console.log(dist);
  
                  //if it gets really close we will just give it a push (away) with multiplier.
                  //trying to prevent spring 'flipping'
                  //we could change the divider of 10 for different results.
                  var multiplier = 1;
                  if(dist < thing.spring_resting_dist/10){
                      multiplier = ((thing.spring_resting_dist/10) - dist);
                  }
  
                  //normalized
                  var dn = normalizeVector(thing.x-thing.spring_anchor_x, thing.y-thing.spring_anchor_y);
  
                  //spring force
                  var fx = ((dist-thing.spring_resting_dist)*dn.x) * thing.spring_coefficient * -1 * multiplier;
                  var fy = ((dist-thing.spring_resting_dist)*dn.y) * thing.spring_coefficient * -1 * multiplier;
  
                  //damping force
                  //this is damping on ALL MOTION.
                  var fdx = thing.body.velocity.x * thing.spring_damping;
                  var fdy = thing.body.velocity.y * thing.spring_damping;			
  
                  //result force
                  var frx = fx - fdx;
                  var fry = fy - fdy;
  
                  //console.log(frx+":"+fry);
  
                  if(Math.abs(frx)>0.001 || Math.abs(fry)>0.001){
                      Body.applyForce(thing.body, {x:thing.x,y:thing.y}, {x:frx,y:fry});
                  }
                  // if(thing.dragging===true){
                  // 	Matter.Body.setVelocity(thing.body, {x:0,y:0});
                  // }
  
              }
  
          }
      });
  
      //__________________________________________________________
      //__________________________________________________________ magnet
      game.ALL_THINGS.forEach(function(thing1,i){
  
          if(thing1.physics===true && thing1.magnet===true){
  
              game.ALL_THINGS.forEach(function(thing2,i){
  
                  if(thing2.physics===true && thing2.magnet===true){	
  
                      //both thing1 and thing2 are magnets. let's see what force thing2 exerts on thing1
  
                      if(thing2.magnet_force!==0){ //thing2 has a force to exert
  
                          if(thing1.fixed===false){ //thing1 is not fixed
  
                              var dist = distanceBetweenPoints(thing1.x,thing1.y,thing2.x,thing2.y);
  
                              if(dist<thing2.magnet_radius){
  
                                  //normalized vector between two things (preserve direction)
                                  var vnx = (thing1.x - thing2.x) / dist;
                                  var vny = (thing1.y - thing2.y) / dist;
  
                                  //force magnet
                                  var force_map;
                                  if(thing2.magnet_force>0){ //positive force
                                      force_map = thing2.magnet_force.map(0,.1,0,.01);
                                  }else{ //negative force
                                      force_map = thing2.magnet_force.map(0,-.1,0,-.01);
                                  }
                                  var fmx = force_map * vnx;
                                  var fmy = force_map * vny;
  
                                  if(thing2.magnet_gradient===true){
                                      var pct = 1.0 - (dist/thing2.magnet_radius);
                                      fmx *= pct;
                                      fmy *= pct;
                                  }
  
                                  //apply force to body
                                  Body.applyForce(thing1.body, {x:thing1.x,y:thing1.y}, {x:fmx,y:fmy});
  
                              }
  
                          }
  
                      }
  
                  }
              });		
  
          }
      });
  
      //__________________________________________________________
      //__________________________________________________________ bodies position and velocity
      game.ALL_THINGS.forEach(function(thing,i){
          if(thing.physics===true){
              thing.x = thing.body.position.x;
              thing.y = thing.body.position.y;
              // thing.vx = parseFloat(roundToX(thing.body.velocity.x,1));
              // thing.vy = parseFloat(roundToX(thing.body.velocity.y,1));
              // thing.vm = parseFloat(roundToX(magnitudeOfVec(thing.vx,thing.vy),1));
              // thing.rotation = parseFloat(roundToX(thing.body.angle,2));
              thing.vx = thing.body.velocity.x;
              thing.vy = thing.body.velocity.y;
              thing.vm = magnitudeOfVec(thing.vx,thing.vy);
              //console.log(thing.body.angle);
              //for some reason thing.body.angle is returning NaN
              if(thing.rotate_freely===true){
                  thing.rotation = thing.body.angle;
              }
          }
      });
  
      //__________________________________________________________
      //__________________________________________________________ rotation
      game.ALL_THINGS.forEach(function(thing,i){
          if(thing.physics===true && thing.rotate_freely===false){ //prevent roation
              Body.setInertia(thing.body, Infinity);
              //thing.rotation = 0;
              //Body.setAngle(thing.body, 0);
              //Body.setAngle(thing.body, thing.rotation);			
          }
          if(thing.physics===true && thing.angular_velocity!==0){ //angular velocity
              var rotation_per_frame = thing.angular_velocity/60.0; //we are running ~60fps
              thing.rotation += rotation_per_frame;
              Body.setAngle(thing.body, thing.rotation);			
          }
          if(thing.physics===true && thing.rotate_freely===true){ //rotate freely, MAX_ANGULAR_VELOCITY
              //Body.setInertia(thing.body, 0.1);//what is the default value?
              if(thing.body.angularVelocity>game.MAX_ANGULAR_VELOCITY){
                  Body.setAngularVelocity(thing.body, game.MAX_ANGULAR_VELOCITY);
              }
              if(thing.body.angularVelocity<(game.MAX_ANGULAR_VELOCITY*-1)){
                  Body.setAngularVelocity(thing.body, game.MAX_ANGULAR_VELOCITY*-1);
              }
          }
      });
  
      //__________________________________________________________
      //__________________________________________________________ collision callback
      game.collision_run_once = false;
      Events.on(game.engine, 'collisionStart', function(event) {        
          if(game.collision_run_once===false){ //if we don't do this it is called about 2000 times per loop...
              var pairs = event.pairs;
              for (var i = 0; i < pairs.length; i++) {
                  var pair = pairs[i];
                  var velocity_mag_sum = (pair.bodyA.speed + pair.bodyB.speed).toFixed(2);
                  game.callback_collision(pair.bodyA.label,pair.bodyB.label,velocity_mag_sum);
              }
              game.collision_run_once = true;
          }
      });
  
      //__________________________________________________________
      //__________________________________________________________ sliding callback
      // sliding_run_once = false;
      //    Events.on(engine, 'collisionActive', function(event) {        
      //        if(sliding_run_once===false){ //if we don't do this it is called about 2000 times per loop...
      //         var pairs = event.pairs;
      //         for (var i = 0; i < pairs.length; i++) {
      //             var pair = pairs[i];
      //             callback_sliding(pair.bodyA.label,pair.bodyB.label);
      //         }
      //         sliding_run_once = true;
      //     }
      //    });
  
      //__________________________________________________________
      //__________________________________________________________ max velocity
      var velocity_max = 50;
      game.ALL_THINGS.forEach(function(thing,i){
          if(thing.physics===true){
              if(thing.body.speed>velocity_max){
                  var scale = velocity_max/thing.body.speed;
                  var new_speed_x = thing.body.velocity.x * scale;
                  var new_speed_y = thing.body.velocity.y * scale;
                  Body.setVelocity(thing.body, {x:new_speed_x,y:new_speed_y});
              }
          }
      });
  }
  
    backend_draw(){
      
      var game = this
      var wX = game.GAME_MS / (game.GAME_DURATION*1000);
      
      if(wX>=1.0){
        game.game_over(global.GAME_OVER_STATE);
        // game.game_over(true);
      } else{
          var pct = wX * 100;
          var hue = 120 - pct * 1.2;
  
          var timerWidth = game.WIDTH;
    
        //  game.gameTimerBar.style.width = timerWidth-(timerWidth*wX) + 'px';
          game.gameTimerBar.style.width = (100-pct) + '%';
          game.gameTimerBar.style.background = 'hsl(' + hue + ', 90%, 50%)';
      }
    }
  }