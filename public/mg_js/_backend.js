
path = "/"; 

//========================================================================
//________________________________________________________________________ thing
function fV_thing(_x,_y,_width,_height,_type,_img){

	//___CREATE THING 
	var Thing = {

		//_______________________________________
		//BASICS
		uid:randomString(12),
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


	    fV_set_position:function(_x,_y){
	    	this.x = _x;
	    	this.y = _y;
	    	if(this.physics===true){
	    		Body.setPosition(this.body,{x:_x,y:_y});
	    	}
	    },
	    fV_set_x:function(_x){
	    	this.x = _x;
	    	if(this.physics===true){
	    		Body.setPosition(this.body,{x:_x,y:this.y});
	    	}
	    },
	    fV_set_y:function(_y){
	    	this.y = _y;
	    	if(this.physics===true){
	    		Body.setPosition(this.body,{x:this.x,y:_y});
	    	}
	    },
	    fV_set_size:function(_w,_h){
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
	    fV_set_width:function(_w){
	    	this.fV_set_size(_w,this.height);
	    },
	    fV_set_height:function(_h){
	    	this.fV_set_size(this.width,_h);
	    },
	    fV_set_velocity:function(_vx,_vy){
	    	this.vx=_vx;
	    	this.vy=_vy;
	    	if(this.physics===true){
	    		Body.setVelocity(this.body, {x:_vx,y:_vy});
	    	}
	    },
	    fV_set_velocity_x:function(_vx){
	    	this.vx=_vx;
	    	if(this.physics===true){
	    		Body.setVelocity(this.body, {x:_vx, y:this.vy}); // Use existing y velocity
	    	}
	    },
	    fV_set_velocity_y:function(_vy){
	    	this.vy=_vy;
	    	if(this.physics===true){
	    		Body.setVelocity(this.body, {x:this.vx, y:_vy}); // Use existing x velocity
	    	}
	    },
		fV_set_velocity_magnitude:function(_vm){
	    	var scale = _vm/this.vm;
	    	this.vx *= scale;
	    	this.vy *= scale;
	    	if(this.physics===true){
	    		Body.setVelocity(this.body, {x:this.vx, y:this.vy});
	    	}
	    },
	    fV_update_faux_velocity:function(){
	    	this.vx_faux = (this.x - this.x_prev)/MS_PER_FRAME;
	    	this.vy_faux = (this.y - this.y_prev)/MS_PER_FRAME;
	    	this.x_prev = this.x;
	    	this.y_prev = this.y;

	    	if(this.physics===true){
	    		Body.setVelocity(this.body, {x:this.vx_faux*FAUX_VELOCLITY_MULTIPLIER , y:this.vy_faux*FAUX_VELOCLITY_MULTIPLIER});
	    	}
	    },
	    fV_set_fixed:function(_b){
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
	    fV_set_static:function(_b){
	    	this.fixed = _b;
	    	// Set velocity to 0
	    	this.vx = 0;
	    	this.vy = 0;
	    	if(this.physics===true){
	    		Body.setVelocity(this.body, {x:0,y:0});
	    		Body.setStatic(this.body, _b);
	    	}
	    },
	    fV_rotate:function(_r,_u){ //rotates _r relative to existing rotation
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
	    fV_set_angle:function(_r,_u){ 
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
	    fV_set_angular_velocity:function(_av,_u){ //deg/s or rad/s
	    	if(_u==="r"){
	    		this.angular_velocity = _av;
	    	}
	    	if(_u==="d"){
	    		this.angular_velocity = _av*Math.PI/180;
	    	}	   
	    	//this is calculated in _runner.js each frame
	    },
	    fV_get_angle_d:function(){
	    	var rotation_d = this.rotation*180/Math.PI;
	    	return rotation_d;
	    },
	    fV_get_angle_r:function(){
	    	return this.rotation;
	    },
	    // fV_set_mass:function(_m){ //does mass do anything? !should add this to physics!
	    // 	this.mass = _m;
	    // 	if(this.physics===true){
	    // 		Body.setMass(this.body, _m);
	    // 	}
	    // },
	    fV_set_flip:function(_x,_y){ 
	    	this.flip_x = _x;
	    	this.flip_y = _y;
	    },
	    fV_set_padding:function(_px,_py){ 
	    	this.padding_x = 1.0 - _px;
	    	this.padding_y = 1.0 - _py;
	    },
	   	fV_set_restitution:function(_r){
	   		this.restitution = _r;
	   		if(this.physics===true){
	    		this.body.restitution = _r;
	   		}
	   	},
	    fV_get_vertices:function(_padding){
	    	return getVertices(this,"obj",_padding);
	    },
	    fV_get_velocity:function(){
	    	if(this.physics===true){
	    		return this.body.velocity;
	    	}else{
	    		var v = {x:this.vx,y:this.vy};
	    		return v;
	    	}
	    },
	    fV_get_out_of_view:function(){
			var v = getVertices(this,"arr",false);
			var out_of_view = true;
			for(var i=0;i<v.length;i++){
				if( pointInPolygon([v[i][0],v[i][1]], [[0,0],[WIDTH,0],[WIDTH,HEIGHT],[0,HEIGHT]]) ){ //if any point is in view then it is not out of view
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
	    fV_draw:function(){
	    	// console.log("width: " + this.width);
	    	// console.log("height: " + this.height);

	    	if(this.faux_destroy===true){return;} //destroy is not really working :(

	    	FAUX_Z_INDEX++;
	    	this.z_index = FAUX_Z_INDEX;

	    	var draw_offset_x = 0;
	    	var draw_offset_y = 0;

	    	if (DRAW_FROM_CENTER){
	    		draw_offset_x = this.width/2;
	    		draw_offset_y = this.height/2;
	    	}

			ctx_fV.globalAlpha = ALPHA;
			ctx_fV.fillStyle = FILL_COLOR;
			
    		ctx_fV.save();

    		ctx_fV.translate(this.x,this.y);

    		ctx_fV.rotate(this.rotation);

    		ctx_fV.scale(this.flip_x, this.flip_y); //can we do this with rotate????


	    		//___PRIMITIVE CIRCLE
				if(typeof _img === 'undefined' && this.type==="circle"){ 
					
					ctx_fV.beginPath();
					ctx_fV.arc(0,0,draw_offset_x,0,2*Math.PI);
					ctx_fV.closePath();
					ctx_fV.fill();

				}

				//___PRIMITIVE RECTANGLE
				if(typeof _img === 'undefined' && this.type==="rectangle"){ 

					ctx_fV.fillRect(-(draw_offset_x), -(draw_offset_y), this.width, this.height);

				}
				
				//___IMG or GIF
				if(typeof _img !== 'undefined'){ 

					if(this.gif===true){
						ctx_fV.drawImage(img, (this.gif_on_frame%10)*this.gif_frame_width, Math.floor(this.gif_on_frame/10)*this.gif_frame_height, this.gif_frame_width, this.gif_frame_height, 0-(draw_offset_x), 0-(draw_offset_y), this.width, this.height);
					}else{
						ctx_fV.drawImage(img,0-(draw_offset_x),0-(draw_offset_y),this.width,this.height); //how does this know which img is for which thing since img is not stored in the obj???
					}

				}

				//___OUTLINES
				ctx_fV.lineWidth = 2;
				if(SHOW_OUTLINES === true && this.type==="circle"){
					ctx_fV.strokeStyle = '#FF0000';
					ctx_fV.beginPath();
					ctx_fV.arc(0,0,draw_offset_x,0,2*Math.PI);
					ctx_fV.stroke();
				}
				if(SHOW_OUTLINES === true && this.type==="rectangle"){
					ctx_fV.strokeStyle = '#FF0000';
					ctx_fV.strokeRect(-(draw_offset_x),-(draw_offset_y),this.width,this.height);
				}
				if(SHOW_PADDED_OUTLINES === true && this.type==="circle" && (this.padding_x !== 1.0 || this.padding_y !== 1.0) ){
					ctx_fV.strokeStyle = '#0000FF';
					ctx_fV.beginPath();
					ctx_fV.arc(0,0,(draw_offset_x)*this.padding_x,0,2*Math.PI);
					ctx_fV.stroke();
				}
				if(SHOW_PADDED_OUTLINES === true && this.type==="rectangle" && (this.padding_x !== 1.0 || this.padding_y !== 1.0) ){
					ctx_fV.strokeStyle = '#0000FF';
					ctx_fV.strokeRect(-((draw_offset_x)*this.padding_x),-((draw_offset_y)*this.padding_y),this.width*this.padding_x,this.height*this.padding_y);
				}
				if(SHOW_PHYSICS_OUTLINES === true){
					if(this.physics===true){
						var w = Math.abs(this.body.bounds.max.x - this.body.bounds.min.x); 
						var h = Math.abs(this.body.bounds.max.y - this.body.bounds.min.y); 
						ctx_fV.strokeStyle = '#FF00FF';
						ctx_fV.strokeRect(-(draw_offset_x),-(h/2),w,h);
					}
				}

			ctx_fV.restore();

	    },
	    fV_draw_between_points:function(_px1,_py1,_px2,_py2,_height){

	    	if(this.faux_destroy===true){return;}

	    	FAUX_Z_INDEX++;
	    	this.z_index = FAUX_Z_INDEX;

			ctx_fV.globalAlpha = ALPHA;
			ctx_fV.fillStyle = FILL_COLOR;

	    	//this.rotate_freely = true;

		    var dist = distanceBetweenPoints(_px1,_py1,_px2,_py2);
		    var angle = angleBetweenPoints(_px1,_py1,_px2,_py2);

    		ctx_fV.save();
    		ctx_fV.translate((_px1+_px2)/2,(_py1+_py2)/2);
    		ctx_fV.rotate(angle);
    		if(typeof _img === 'undefined' && this.type==="rectangle"){ //primitive rectangle
				ctx_fV.fillRect(-(dist/2), -(_height/2), dist, _height);
			}
			if(typeof _img !== 'undefined' && this.type==="rectangle"){ //image
				ctx_fV.drawImage(img, -(dist/2), -(_height/2), dist, _height);
			}
			
			if(SHOW_OUTLINES === true){
				ctx_fV.strokeStyle="#FF0000";ctx_fV.lineWidth=2;
				ctx_fV.strokeRect(-(dist/2), -(_height/2), dist, _height);
			}

			ctx_fV.restore();

			//now set the body
			this.fV_set_angle(0,"r");
			this.fV_set_position((_px1+_px2)/2,(_py1+_py2)/2);
			this.fV_set_size(dist,_height);
			this.fV_set_angle(angle,"r");

			if(SHOW_PHYSICS_OUTLINES === true){
				if(this.physics===true){
					var w = Math.abs(this.body.bounds.max.x - this.body.bounds.min.x); 
					var h = Math.abs(this.body.bounds.max.y - this.body.bounds.min.y); 
					ctx_fV.strokeStyle = '#FF00FF';
					ctx_fV.strokeRect(this.x-(this.width/2),this.y-(h/2),w,h);
				}
			}



		},
	    fV_destroy:function(){
	    	if(this.physics===true){
	    		Composite.removeBody(world, this.body);
	    	}
	    	var this_uid = this.uid; //'this' is undefined inside of foreach :(
	    	ALL_THINGS.forEach(function(thing,i){
	    		if(thing.uid===this_uid){
	    			ALL_THINGS.splice(i,1);
	    			console.log("DESTROY!");
	    		}
	    	});
	    	this.fV_set_position(0,0);
	    	this.fV_set_size(0,0);
	    	//delete this; //doesn't do shit
	    	this.faux_destroy = true;
	    },
	    fV_set_gif_speed:function(_s){
	    	this.gif_speed = _s;
	    },
	    fV_set_gif_frame:function(_f){
	    	this.gif_on_frame = _f;
	    },
	    fV_set_gif_in:function(_n){
	    	this.gif_in = _n;
	    	this.gif_on_frame = _n;
	    },
	    fV_set_gif_out:function(_n){
	    	this.gif_out = _n;
	    	this.gif_on_frame = _n;
	    },
	    fV_set_gif_playback:function(_p){
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
	ALL_THINGS.push(Thing);

	//___RETURN THING TO THE FRONTEND
	return Thing;

}


//======================================================================== 
//________________________________________________________________________ draw color alpha stuff
function fV_fill_color(_r,_g,_b){
	FILL_COLOR = "rgb("+_r+","+_g+","+_b+")";
}
function fV_alpha(_a){
	ALPHA = _a;
}
function fV_background_color(_r,_g,_b){
	BACKGROUND_COLOR = "rgb("+_r+","+_g+","+_b+")";
}


//========================================================================
//________________________________________________________________________ enviornmental stuff
function fV_env_orientation(_o){
	ORIENTATION = _o;
	if(ORIENTATION==='landscape'){
		console.log("Running LANDSCAPE");
		HEIGHT = 640; 
		WIDTH = 1234;
	}else if(ORIENTATION==='portrait'){
		console.log("Running PORTRAIT");
		HEIGHT = 1224; 
		WIDTH = 650;
	}else{
		console.log("!uhoh no orientation!");
	}
}
function fV_env_framerate(_frames_per_s){ //should be allowed to change this?
	MS_PER_FRAME = ((1/_frames_per_s)*1000).toFixed(2);
}
function fV_env_gravity(_gx,_gy){
	engine.world.gravity.x = _gx; 
	engine.world.gravity.y = _gy;
}
function fV_env_show_bodies(_bool){
	SHOW_BODY_WIREFRAMES = _bool;
}
function fV_env_game_duration(_duration){
	GAME_DURATION = _duration;
	GAME_MS = _duration;
}
function fV_env_game_timer_location(_location){
	GAME_TIMER_LOCATION = _location;
}
function fV_env_show_outlines(_bool){
	SHOW_OUTLINES = _bool;
}
function fV_env_show_padded_outlines(_bool){
	SHOW_PADDED_OUTLINES = _bool;
}
function fV_env_show_physics_outlines(_bool){
	SHOW_PHYSICS_OUTLINES = _bool;
}
function fV_walls(_bool_top, _bool_right, _bool_bottom, _bool_left, _bounce){
	if(typeof _bounce === 'undefined'){
		_bounce = 1.0;
	}
	var wall_thickness = 40 // arbitrary

	if (_bool_top){
		WALL_TOP = fV_thing(WIDTH/2,HEIGHT+wall_thickness/2,WIDTH,wall_thickness,"rectangle");
		fV_behavior_physics(WALL_TOP);
		WALL_TOP.fV_set_fixed(true);
		WALL_TOP.fV_set_restitution(_bounce);
	}

	if (_bool_bottom){
		WALL_BOTTOM = fV_thing(WIDTH/2,0-wall_thickness/2,WIDTH,wall_thickness,"rectangle");
		fV_behavior_physics(WALL_BOTTOM);
		WALL_BOTTOM.fV_set_fixed(true);
		WALL_BOTTOM.fV_set_restitution(_bounce);
	}

	if (_bool_left){
		WALL_LEFT = fV_thing(0-wall_thickness/2,HEIGHT/2,wall_thickness,HEIGHT,"rectangle");
		fV_behavior_physics(WALL_LEFT);
		WALL_LEFT.fV_set_fixed(true);
		WALL_LEFT.fV_set_restitution(_bounce);
	}

	if (_bool_right){
		WALL_RIGHT = fV_thing(WIDTH+wall_thickness/2,HEIGHT/2,wall_thickness,HEIGHT,"rectangle");
		fV_behavior_physics(WALL_RIGHT);
		WALL_RIGHT.fV_set_fixed(true);
		WALL_RIGHT.fV_set_restitution(_bounce);
	}
}



//========================================================================
//________________________________________________________________________ game over
function fV_game_over(_success){

    all_intervals.forEach(function(interval,i){// <-- problem with timer intervals continuing after game ended
        clearInterval(interval);
    });

	PAUSE = true;
	// if(GAME_OVER_STATE===true){
	// 	_success = true;
	// }
	console.log("setting success to, "+_success);
	GAME_OVER_SUCCESS = _success;
	GAME_OVER = true;
}


//========================================================================
//________________________________________________________________________ timer
var TIMER_WAIT = [];
function fV_timer(_duration){

	var Timer = {

		duration: _duration,
		uid: randomString(12),
		timer_uid: undefined,
		starttime: undefined,
		paused: false,
		paused_remaining: undefined,
	    fV_start: function(){
	    	if(GAME_MS===0){ //game has not started! we cannot start timer but we can store it.
	    		TIMER_WAIT.push(this);
	    	}else{
		    	this.starttime = new Date();
			    this.timer_uid = setTimeout(callback_timer, this.duration, this.uid);	    		
	    	}
	    },
	    fV_get_pct: function(){if(GAME_MS!==0){
	    	var timediff = new Date()-this.starttime;
	    	var pct = timediff/this.duration;
	    	return pct;
	    }},
	    fV_clear: function(){if(GAME_MS!==0){
		    clearTimeout(this.timer_uid);
	    }},
	    fV_restart: function(){if(GAME_MS!==0){
	    	this.fV_clear();
	    	this.fV_start();
	    }},
	    fV_pause: function(){if(GAME_MS!==0){
	    	this.paused_remaining = parseInt((1.0 - this.fV_get_pct()) * duration);
	    	this.fV_clear();
	    }},
	    fV_resume: function(){if(GAME_MS!==0){
	    	this.starttime = new Date();
		    this.timer_uid = setTimeout(callback_timer, this.paused_remaining, this.uid);	    		
	    }}

	};

	return Timer;
}


//========================================================================
//________________________________________________________________________ timer repeating
var INTERVAL_WAIT = [];
var all_intervals = [];
function fV_timer_repeating(_duration,_startnow){

	var TimerR = {

		duration:_duration,
		uid:randomString(12),
		timer_uid:undefined,
		starttime:undefined,
		start_now:_startnow,
	    fV_start:function(){
	    	if(GAME_MS===0){ //game has not started we cannot start timer yet. let's add to cu
	    		INTERVAL_WAIT.push(this);
	    	}else{
		    	this.starttime = new Date();
		    	this.timer_uid = setInterval(callback_timer, this.duration, this.uid);
		    	all_intervals.push(this.timer_uid);
		    	if(_startnow===true){ //for intervals sometimes you want to start the first one immediately
		    		callback_timer(this.uid);
		    	}
		    }
	    },
	    fV_get_pct:function(){if(GAME_MS!==0){
	    	var timediff = new Date()-this.starttime;
	    	var pct = timediff/this.duration;
	    	return pct;
	    }},
	    fV_clear:function(){if(GAME_MS!==0){
		    clearInterval(this.timer_uid);
	    }},
	    fV_pause: function(){if(GAME_MS!==0){
	    	this.fV_clear();
	    }},
	    fV_resume: function(){if(GAME_MS!==0){
	    	this.starttime = new Date();
		    this.timer_uid = setInterval(callback_timer, this.duration, this.uid);	   
		    all_intervals.push(this.timer_uid); 		
	    }}

	};

	return TimerR;
}


//========================================================================
//________________________________________________________________________ interactions
function fV_tappable(_obj){
	if(_obj instanceof Array) {
		_obj.forEach(function(_o,i){
			_o.tappable = true;
		});
	}else{
		_obj.tappable = true;
	}
}
function fV_draggable(_obj){
	if(_obj instanceof Array){
		_obj.forEach(function(_o,i){
			_o.draggable = true;
		});
	}else{
		_obj.draggable = true;
	}
}
function fV_launchable(_obj){
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
function create_physics_body(_obj){

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

		Composite.add(allBodiesComposite, [body]);

		World.add(engine.world, [body]);



		_obj.body = body;

		_obj.fV_apply_force = function(_fx,_fy,_px,_py){
			if (typeof _px !== 'undefined'){
		    	Body.applyForce(this.body, {x:_px,y:_py}, {x:_fx,y:_fy});
			}else{
				Body.applyForce(this.body, {x:this.x,y:this.y}, {x:_fx,y:_fy});
			}
		};

		_obj.fV_get_force = function(){
		    return this.body.force;
		};

		_obj.fV_gravity = function(_bool){
		    body.okGravity = _bool;
		};

	    _obj.fV_set_density = function(_d){ 
	    	Body.setDensity(this.body, _d);
	    };

	    _obj.fV_set_mass = function(_m){ 
	    	Body.setMass(this.body, _m);
	    };

	    _obj.fV_set_rotate_freely = function(_b){ 
	    	this.rotate_freely = _b;
	    };

		_obj.fV_set_physics_paddding = function(_px,_py){ //does this work for circle!?!?!?!
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

		_obj.fV_set_air_friction = function(_af){
		    this.body.frictionAir = _af;
		};

		_obj.gravity = false;

		_obj.physics = true;

	}

}


//========================================================================
//________________________________________________________________________ behavior: physics
function fV_behavior_physics(_obj){
	if(_obj instanceof Array){ //you can pass an array to physics :)
		_obj.forEach(function(_o,i){
			create_physics_body(_o);
		});
	}else{
		create_physics_body(_obj);
	}
}
function fV_behavior_physics_remove(_obj){
	_obj.physics = false;
}


//========================================================================
//________________________________________________________________________ behavior: collision
function fV_behavior_collision(_obj,_restitution){

	if(typeof _restitution === 'undefined'){
		_restitution = 1.0;
	}

	create_physics_body(_obj);

	_obj.behavior_collision = true;

	_obj['restitution'] = _restitution;
	_obj.body.restitution = _restitution;
	_obj.fV_set_restitution = function(_r){
		this.restitution = _r;
	    this.body.restitution = _r;
	};

	_obj.body.collisionFilter.group = 1;
	_obj.fV_set_collision_group = function(_g){
	    this.body.collisionFilter.group = _g;
	};

}
function fV_behavior_collision_remove(_obj){
	_obj.behavior_collision = true;
}

//========================================================================
//________________________________________________________________________ behavior: spring
function fV_behavior_spring(_obj,_ax,_ay,_k,_d,_resting){ //thing, center x archor, center y anchor, spring stiffness, damping, resting distance

	create_physics_body(_obj);

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
	_obj.fV_set_spring_anchor = function(_ax,_ay){
	    this.spring_anchor_x = _ax;
	    this.spring_anchor_y = _ay;
	};
	_obj.fV_set_spring_anchor_x = function(_ax){
	    this.spring_anchor_x = _ax;
	};
	_obj.fV_set_spring_anchor_y = function(_ay){
	    this.spring_anchor_y = _ay;
	};

}
function fV_behavior_spring_remove(_obj){
	_obj.spring = false;
}


//========================================================================
//________________________________________________________________________ behavior: magnet
function fV_behavior_magnet(_obj,_force,_radius,_gradient){

	create_physics_body(_obj);

	_obj.magnet = true;

	_obj['magnet_force'] = _force;
	_obj.fV_set_magnet_force = function(_f){
	    this.magnet_force = _f;
	};

	_obj['magnet_radius'] = _radius;
	_obj.fV_set_magnet_radius = function(_r){
	    this.magnet_radius = _r;
	};

	// _obj['magnet_gradient'] = _gradient;
	// _obj.fV_set_magnet_gradient = function(_bool){
	//     this.magnet_gradient = _bool;
	// };

}
function fV_behavior_magnet_remove(_obj){
	_obj.magnet = false;
}


//========================================================================
//________________________________________________________________________ behavior: follow
function fV_behavior_follow(_obj,_objf,_speed,_distance){

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
function fV_behavior_follow_remove(_obj){
	_obj.follow = false;
}


//========================================================================
//________________________________________________________________________ behavior: circular path
function fV_behavior_circular_path(_obj,_cx,_cy,_radius,_speed){

	_obj.circular_path = true;

	_obj['circular_path_radius'] = _radius;

	_obj['circular_path_cx'] = _cx;
	_obj['circular_path_cy'] = _cy;
	_obj.fV_set_circular_path_center = function(_cx,_cy){
	    this.circular_path_cx = _cx;
	    this.circular_path_cy = _cy;
	};
	_obj.fV_set_circular_path_center_x = function(_cx){
	    this.circular_path_cx = _cx;
	};
	_obj.fV_set_circular_path_center_y = function(_cy){
	    this.circular_path_cy = _cy;
	};

	_obj['circular_path_speed'] = _speed;
	_obj.fV_set_circular_path_speed = function(_s){
	    this.circular_path_speed = _s;
	};	

	_obj['circular_path_angle'] = fV_angle_between_points(_cx,_cy,_obj.x,_obj.y,"r");
	_obj.fV_set_circular_path_angle = function(_r){
 		this.circular_path_angle = _r;
	};	
	_obj.fV_get_circular_path_angle = function(){
 		return this.circular_path_angle;
	};	

}


//========================================================================
//________________________________________________________________________ animations 

//________________________________________________________________________ clear existing
function clear_existing_animation(_obj,_type){
	_obj.animations.forEach(function(animate,i){	
		if(animate.type===_type){
			_obj.animations.splice(i,1);
		}
	});	
}
//________________________________________________________________________ animate x
function fV_animate_x(_obj,_x,_duration, _easing){

	clear_existing_animation(_obj,"x");

	if(_obj.physics===true){_obj.fV_set_fixed(true);} //how do we safely pause physics?

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
function fV_animate_y(_obj,_y,_duration,_easing){

	clear_existing_animation(_obj,"y");

	if(_obj.physics===true){_obj.fV_set_fixed(true);}

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
function fV_animate_position(_obj,_x,_y,_duration,_easing){

	clear_existing_animation(_obj,"position");

	if(_obj.physics===true){_obj.fV_set_fixed(true);} 

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
function fV_animate_width(_obj,_width,_duration, _easing){

	clear_existing_animation(_obj,"width");

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
function fV_animate_height(_obj,_height,_duration, _easing){

	clear_existing_animation(_obj,"height");

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
function fV_animate_rotate(_obj,_rotation,_units,_abs_or_rel,_duration,_easing,_mode){

	clear_existing_animation(_obj,"rotate");

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
function fV_animate_scale(_obj,_scale,_duration,_easing){ 

	clear_existing_animation(_obj,"scale");

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
function fV_animation_stop(_obj,_type){
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
function clear_existing_oscillation(_obj,_type){
	_obj.oscillations.forEach(function(oscillate,i){	
		if(animate.type===_type){
			_obj.oscillations.splice(i,1);
			console.log("oscillation cleared");
		}
	});	
}
//________________________________________________________________________ oscillate x
function fV_oscillate_x(_obj,_amplitude,_duration){

	clear_existing_oscillation(_obj,"x");

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
function fV_oscillate_y(_obj,_amplitude,_duration){

	clear_existing_oscillation(_obj,"y");

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
function fV_oscillate_width(_obj,_amplitude,_duration){

	clear_existing_oscillation(_obj,"width");

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
function fV_oscillate_height(_obj,_amplitude,_duration){

	clear_existing_oscillation(_obj,"height");

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
function fV_oscillate_scale(_obj,_amplitude,_duration){

	clear_existing_oscillation(_obj,"scale");

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
function fV_oscillation_stop(_obj,_type){
	_obj.oscillations.forEach(function(oscillate,i){	
		if(oscillate.type===_type){
			_obj.oscillations.splice(i,1);
		}
	});
}


//========================================================================
//________________________________________________________________________ sound
function fV_sound(_file) {
	
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
		uid:randomString(12),
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

	ALL_SOUNDS.push(Sound);

	return Sound;
}
function fV_stop_all_sounds() {
	for (var i = 0; i < ALL_SOUNDS.length; i++) {
		ALL_SOUNDS[i].fV_stop();
	}
}


//========================================================================
//________________________________________________________________________ blip
function fV_blip(_freq, _dur, _vol) {
	var Blip = {
		dur: _dur,
		vol: _vol,
		freq: _freq,
		fV_play: function() {
			// create Oscillator node
			var oscillator = audioCtx.createOscillator();
			oscillator.type = 'sine';
			oscillator.frequency.value = this.freq; // value in hertz

			// create Gain (volume) node
			var gain = audioCtx.createGain();
			gain.gain.value = this.vol || 0.5;

			oscillator.connect(gain);
			gain.connect(audioCtx.destination);

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
function fV_line(_x1, _y1, _x2, _y2, _weight) {
  var Line = {
    x1: _x1,
    y1: _y1,
    x2: _x2,
    y2: _y2,
    weight: _weight,
    cap:"round",
    //color: '#000',
    fV_draw: function() {
      ctx_fV.beginPath();
      ctx_fV.moveTo(this.x1, this.y1);
      ctx_fV.lineTo(this.x2, this.y2);
      ctx_fV.lineCap = this.cap;
      ctx_fV.lineWidth = this.weight;
      ctx_fV.globalAlpha = ALPHA;
      ctx_fV.strokeStyle = FILL_COLOR;
      ctx_fV.stroke();
    },
    fV_set_weight: function(_weight) {
      this.weight = _weight;
    },
    fV_set_position: function(_x1, _y1, _x2, _y2) {
      this.x1 = _x1;
      this.y1 = _y1;
      this.x2 = _x2;
      this.y2 = _y2;
    },
    fV_set_start_point: function(_x1, _y1) {
      this.x1 = _x1;
      this.y1 = _y1;
    },
    fV_set_end_point: function(_x2, _y2) {
      this.x2 = _x2;
      this.y2 = _y2;
    },
    fV_set_cap: function(_cap) {
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
function fV_text(_x, _y, _font, _size, _string) {
	var Text = {
		x: _x,
		y: _y,
		font: _font,
		size: _size,
		string: _string,
		maxWidth: null,
		alignment: 'center',
		fV_draw: function() {
			ctx_fV.globalAlpha = ALPHA;
			ctx_fV.fillStyle = FILL_COLOR;
			ctx_fV.textBaseline = 'middle';
			ctx_fV.textAlign = this.alignment;
			ctx_fV.font = this.size + 'px ' + this._get_font(this.font);

			if (this.maxWidth) {
				this._wrap_text();
			} else {
				ctx_fV.fillText(this.string, this.x, this.y);
			}
		},
		fV_set_position: function(_x,_y){
			this.x = _x;
			this.y = _y;
		},
		fV_set_size: function(_s){
			this.size = _s;
		},
		fV_set_message: function(_string) {
			this.string = _string;
		},
		fV_set_max_width: function(_maxWidth) {
			this.maxWidth = _maxWidth;
		},
		fV_set_alignment: function(_alignment) {
			this.alignment = _alignment;
		},
		fV_set_font: function(_font) {
			this.font = _font;

			ALL_FONTS.push(this.font);
		},
		_wrap_text: function() {
			var words = this.string.split(' ');
			var line = '';
			var x = this.x;
			var y = this.y;

			for(var n = 0; n < words.length; n++) {
			  var testLine = line + words[n] + ' ';
			  var metrics = ctx_fV.measureText(testLine);
			  var testWidth = metrics.width;
			  if (testWidth > this.maxWidth && n > 0) {
			    ctx_fV.fillText(line, x, y);
			    line = words[n] + ' ';
			    y += (this.size + 4);
			  }
			  else {
			    line = testLine;
			  }
			}
			ctx_fV.fillText(line, x, y);
		},
		_get_font: function(font) {
			const fontObj = globalFontList[font];

			if (fontObj) {
				return fontObj.style;
			} else {
				console.warn('Selected font was not found. Using generic font instead.');
				return ('Arial');
			}
		}
	};

	ALL_FONTS.push(Text.font);

	return Text;
}


//========================================================================
//________________________________________________________________________ repeating background 
function fV_repeating_background(_x,_y,_width,_height,_orientation,_speed,_img) {
	if(_img.indexOf(".jpg")!==-1) {
		_img = path = "assets/jpg/"+_img;
	} else if(_img.indexOf(".png")!==-1) {
		_img = path = "assets/png/"+_img;
	} else {
		console.error('Repeating background has incorrect filetype');
	}

	var img = new Image();
	img.src = _img;

	var RepeatingBackground = {
		uid: randomString(12),
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
		 		if (this.width < WIDTH) {
			 		for (var i = 0; i <= WIDTH*2 + this.width; i+= this.width) {
						ctx_fV.drawImage(this.img, this.x + this.posX + i, this.y);
						ctx_fV.drawImage(this.img, this.x + this.posX - i - this.width, this.y);
			 		}

			 		this.posX += this.speed;

					if ((this.posX + this.width) >= WIDTH) {
						this.posX = WIDTH % this.width;
					} else if (this.posX <= -WIDTH) {
						this.posX = -(WIDTH % this.width);
					}
		 		} else {
		 			ctx_fV.drawImage(this.img, this.x + this.posX, this.y);
		 			ctx_fV.drawImage(this.img, this.x + this.posX + this.width, this.y);
					ctx_fV.drawImage(this.img, this.x + this.posX - this.width, this.y);

					this.posX += this.speed;

					if (this.posX >= this.width) {
						this.posX = 0;
					} else if (this.posX <= -this.width) {
						this.posX = 0;
					}
		 		}
		 	} else if (this.orientation === 'vertical') {
		 		if (this.height < HEIGHT) {
			 		for (var i = 0; i <= HEIGHT*2 + this.height; i+= this.height) {
						ctx_fV.drawImage(this.img, this.x, this.y + this.posY + i);
						ctx_fV.drawImage(this.img, this.x, this.y + this.posY - i);
					}

					this.posY += this.speed;

					if ((this.posY + this.height) >= HEIGHT) {
						this.posY = HEIGHT % this.height;
					} else if (this.posY <= -HEIGHT) {
						this.posY = -(HEIGHT % this.height);
					}
		 		} else {
		 			ctx_fV.drawImage(this.img, this.x, this.y + this.posY);
		 			ctx_fV.drawImage(this.img, this.x, this.y + this.posY + this.height);
					ctx_fV.drawImage(this.img, this.x, this.y + this.posY - this.height);

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
		fV_set_speed: function(_speed) {
			this.speed = _speed;
		},
		fV_destroy: function() {
			ALL_BACKGROUNDS.forEach(function(bg, i){
				if(bg.uid === this.uid){
					ALL_BACKGROUNDS.splice(i, 1);
				}
			}.bind(this));
		}
	};

	ALL_BACKGROUNDS.push(RepeatingBackground);

	return RepeatingBackground;
}





















//======================================================================== The Goods AKA Math

//________________________________________________________________________ fV_random
function fV_random(_min,_max){
	return Math.floor(Math.random()*(_max-_min+1)+_min);
}

//________________________________________________________________________ radians and degrees convert
function d_to_r(_d){
	return (_d*((2*Math.PI)/360));
}
function r_to_d(_r){
	return (_r*(360/(2*Math.PI)));
}

//________________________________________________________________________ fV_coincide
function fV_coincide(_obj1,_obj2){

	var obj1_pts = getVertices(_obj1,"obj",true);
	var obj2_pts = getVertices(_obj2,"obj",true);
	var coincide = doPolygonsIntersect(obj1_pts,obj2_pts);
	return coincide;

}
//________________________________________________________________________ fV_encapsulate
function fV_encapsulate(_obj1,_obj2){  //_obj1 encapsulated by _obj2

	var obj1_pts = getVertices(_obj1,"obj",true);
	
	for(var i=0;i<obj1_pts.length;i++){
		if(fV_point_is_inside(_obj2,obj1_pts[i].x,obj1_pts[i].y)===false){
			return false;
		}
	}
	
	return true;

}
//________________________________________________________________________ fV_angle_between_points
function fV_angle_between_points(_p1x,_p1y,_p2x,_p2y,_units,_mode){
	
	var a = roundToTwo(angleBetweenPoints(_p1x,_p1y,_p2x,_p2y));

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
function fV_intersecting_linespts_point(_l1x1,_l1y1,_l1x2,_l1y2, _l2x1,_l2y1,_l2x2,_l2y2){
	var intersect_point = lineIntersect2(_l1x1,_l1y1,_l1x2,_l1y2, _l2x1,_l2y1,_l2x2,_l2y2);
	if(intersect_point){
		return intersect_point;
	}else{
		return false;
	}
}
//________________________________________________________________________ takes points, returns true/false
function fV_intersecting_linespts(_l1x1,_l1y1,_l1x2,_l1y2, _l2x1,_l2y1,_l2x2,_l2y2){
	return lineIntersect(_l1x1,_l1y1,_l1x2,_l1y2, _l2x1,_l2y1,_l2x2,_l2y2);
}
//________________________________________________________________________ takes lines, returns true/false
function fV_intersecting_lines(_line1,_line2){
	return lineIntersect(_line1.x1,_line1.y1,_line1.x2,_line1.y2, _line2.x1,_line2.y1,_line2.x2,_line2.y2);
}
//________________________________________________________________________ takes lines, returns point of intersect
function fV_intersecting_lines_point(_line1,_line2){
	var intersect_point = lineIntersect2(_line1.x1,_line1.y1,_line1.x2,_line1.y2, _line2.x1,_line2.y1,_line2.x2,_line2.y2);
	if(intersect_point){
		return intersect_point;
	}else{
		return false;
	}
}

//________________________________________________________________________ fV_line_intersects_thing  
// function fV_line_intersects_thing(_thing,_x1,_y1,_x2,_y2){

// 	var vertices = getVertices(_thing,"obj",false); //_data_type can be "obj" or "arr", _padding is true/false

// 	//!only works for rectangle at the moment!

// 	//check each edge of the rectangle
// 	for(var i=0;i<4;i++){
// 		var next = i+1; if(next===4){next=0;}
// 		var intersect = fV_intersecting_linespts(_x1,_y1,_x2,_y2, vertices[i].x, vertices[i].y, vertices[next].x, vertices[next].y);
// 		if(intersect===true){ //if we intersect with any of the four edges of the rectangle, return true
// 			return true;
// 		}
// 	}

// 	return false; //no intersection, return false

// }


//! very very very slow !
//________________________________________________________________________ fV_line_intersects_thing  
function fV_line_intersects_thing(_thing,_line){

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
		var intersect = fV_intersecting_linespts(_line.x1,_line.y1,_line.x2,_line.y2, vertices[i].x, vertices[i].y, vertices[next].x, vertices[next].y);
		if(intersect===true){ //if we intersect with any of the four edges of the rectangle, return true
			return true;
		}
	}
	return false; //no intersection, return false

}

//________________________________________________________________________ fV_angle_between_points
function fV_distance_between_points(_p1x,_p1y,_p2x,_p2y){
	return distanceBetweenPoints(_p1x,_p1y,_p2x,_p2y);
}


//========================================================================
//________________________________________________________________________ fV_point_is_inside
function fV_point_is_inside(_obj,_x,_y){

	if(_obj.physics===true){

		if(Matter.Vertices.contains(_obj.body.vertices, {x:_x,y:_y})){
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
//________________________________________________________________________ fV_get_device_acceleration_magnitude
function fV_get_device_acceleration_magnitude(){
	var magnitude = Math.sqrt((DEVICE_ACCELERATION.x * DEVICE_ACCELERATION.x) + (DEVICE_ACCELERATION.y * DEVICE_ACCELERATION.y) + (DEVICE_ACCELERATION.z * DEVICE_ACCELERATION.z)) 
	return magnitude;
}




























































//========================================================================
//________________________________________________________________________ fV_log
function log_this(_type,_msg){
	console.log(_msg);
}







