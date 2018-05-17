




//##########################################################################################
//########################################################################################## GAME RUNNER
var timeStart;
export default function run_game(){

	GAME_MS = 0;
	PAUSE = false;
	GAME_OVER = false; 
	
	timeStart = new Date();

	setup();

	console.log("Running game, "+WIDTH+":"+HEIGHT);

	

	// all_intervals.push(run_game_interval);
	requestAnimationFrame(run_frame);

}

function run_frame(){
// run_game_interval = setInterval(function(){

	if(PAUSE===false && GAME_OVER===false){

		GAME_MS = new Date() - timeStart;			

		fV_update_backend(); //______________________________________ 1. fV_update_backend();

		update(); //_________________________________________________ 2. (USER CODE)

		fV_update_draw(); //_________________________________________ 3. fV_update_draw();

		fV_update_matter(); //_______________________________________ 4. fV_update_matter();

		fV_clear(); //_______________________________________________ 5. fV_clear();

		if(STATS){ stats.begin(); }

		draw(); //___________________________________________________ 6. (USER CODE)

		fV_backend_draw(); //________________________________________ 7. fV_backend_draw();

		if(STATS){ stats.end(); }
		
		requestAnimationFrame(run_frame);

	}
}

function pause_game(){PAUSE = true;}
function resume_game(){PAUSE = false;}


//##########################################################################################
//########################################################################################## Fix time
// function time_fix(){

// 	//timers and intervals that are started at the beginning of the game need to wait until the game actually starts :+
// 	for(var i=0;i<TIMER_WAIT.length;i++){
//     	TIMER_WAIT[i].starttime = new Date();
// 	    TIMER_WAIT[i].timer_uid = setTimeout(callback_timer, TIMER_WAIT[i].duration, TIMER_WAIT[i].uid);			
// 	}TIMER_WAIT = [];
// 	for(var i=0;i<INTERVAL_WAIT.length;i++){
//     	INTERVAL_WAIT[i].starttime = new Date();
//     	INTERVAL_WAIT[i].timer_uid = setInterval(callback_timer, INTERVAL_WAIT[i].duration, INTERVAL_WAIT[i].uid);
//     	if(INTERVAL_WAIT[i].start_now===true){ //for intervals sometimes you want to start the first one immediately
//     		callback_timer(INTERVAL_WAIT[i].uid);
//     	}		
// 	}INTERVAL_WAIT = [];

// 	//animations and oscillations rely on an end_time variable that needs to 
// 	ALL_THINGS.forEach(function(thing,i){

// 		thing.animations.forEach(function(oscillation,ii){
// 			oscillation.end_time = Date.now() + oscillation.duration;
// 		});

// 		thing.oscillations.forEach(function(oscillation,ii){

// 		});

// 	});	
// }

//##########################################################################################
//########################################################################################## Clear
function fV_clear(){
	ctx_fV.globalAlpha = 1.0;
	ctx_fV.clearRect(0, 0, c_fV.width, c_fV.height);
	ctx_fV.fillStyle = BACKGROUND_COLOR;
	ctx_fV.fillRect(0,0,WIDTH,HEIGHT);
	ctx_fV.fill();	
	FAUX_Z_INDEX = 0;
}

//##########################################################################################
//########################################################################################## BACKEND DRAW
function fV_backend_draw(){

	var wX = GAME_MS / (GAME_DURATION*1000);
	if(wX>=1.0){
		fV_game_over(GAME_OVER_STATE);
	} else{
		var pct = wX * 100;
   		var hue = 120 - pct * 1.2;

    	var timerWidth = WIDTH;

		gameTimerInner.style.width = timerWidth-(timerWidth*wX) + 'px';
		gameTimerInner.style.background = 'hsl(' + hue + ', 90%, 50%)';
	}

	//removed the old timer

	// if(GAME_TIMER_LOCATION=="top"){
	// 	gameTimer.style.order = '0';
	// }
	// if(GAME_TIMER_LOCATION=="bottom"){
	// 	gameTimer.style.order = '1';
	// }

	// var wX = GAME_MS / (GAME_DURATION*1000);

	// if(wX>=1.0){
	// 	fV_game_over(GAME_OVER_STATE);
	// }else{
	// 	var pct = wX * 100;
 //    var hue = 120 - pct * 1.2;

 //    var timerWidth = WIDTH;

	// 	gameTimerInner.style.width = timerWidth-(timerWidth*wX) + 'px';
	// 	gameTimerInner.style.background = 'hsl(' + hue + ', 90%, 50%)';
	// }
}










//##########################################################################################
//########################################################################################## BACKGROUND DRAW
// function fV_background_draw() {
// 	 ALL_BACKGROUNDS.forEach(function(bg, i) {

// 	});
// }










//##########################################################################################
//########################################################################################## UPDATE DRAW
function fV_update_draw(){
	ctx_fV.clearRect(0, 0, c_fV.width, c_fV.height);

	ctx_fV.fillStyle = BACKGROUND_COLOR;
	ctx_fV.fillRect(0,0,WIDTH,HEIGHT);
	ctx_fV.fill();
}










//##########################################################################################
//########################################################################################## UPDATE MATTER PHYSICS
var runner = Runner.create();
var collision_run_once = false;
var sliding_run_once = false;
function fV_update_matter(){


	//__________________________________________________________
	//__________________________________________________________ set fixed (have to do it here redudntantly because fV_set_static could be called BEFORE a body is created)
	// ALL_THINGS.forEach(function(thing,i){
	// 	if(thing.fixed===true && this.physics===true){
	// 		Body.setStatic(this.body, true);
	// 	}
	// });


	//__________________________________________________________
	//__________________________________________________________ bodies
	Runner.tick(runner, engine, MS_PER_FRAME);




	//__________________________________________________________
	//__________________________________________________________ spring
	ALL_THINGS.forEach(function(thing,i){
		if(thing.physics===true && thing.spring===true){

			if(thing.dragging===true){

				thing.fV_set_mass(Infinity);

			}else{

				//uhoh fucks up physic collisions !!!
				thing.fV_set_mass(thing.body_mass_original);

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
					Matter.Body.applyForce(thing.body, {x:thing.x,y:thing.y}, {x:frx,y:fry});
				}
				// if(thing.dragging===true){
				// 	Matter.Body.setVelocity(thing.body, {x:0,y:0});
				// }

			}

		}
	});

	//__________________________________________________________
	//__________________________________________________________ magnet
	ALL_THINGS.forEach(function(thing1,i){

		if(thing1.physics===true && thing1.magnet===true){

			ALL_THINGS.forEach(function(thing2,i){

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
								Matter.Body.applyForce(thing1.body, {x:thing1.x,y:thing1.y}, {x:fmx,y:fmy});

							}

						}

					}

				}
			});		

		}
	});

	//__________________________________________________________
	//__________________________________________________________ bodies position and velocity
	ALL_THINGS.forEach(function(thing,i){
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
	ALL_THINGS.forEach(function(thing,i){
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
			if(thing.body.angularVelocity>MAX_ANGULAR_VELOCITY){
				Body.setAngularVelocity(thing.body, MAX_ANGULAR_VELOCITY);
			}
			if(thing.body.angularVelocity<(MAX_ANGULAR_VELOCITY*-1)){
				Body.setAngularVelocity(thing.body, MAX_ANGULAR_VELOCITY*-1);
			}
		}
	});

	//__________________________________________________________
	//__________________________________________________________ collision callback
    collision_run_once = false;
    Events.on(engine, 'collisionStart', function(event) {        
        if(collision_run_once===false){ //if we don't do this it is called about 2000 times per loop...
	        var pairs = event.pairs;
	        for (var i = 0; i < pairs.length; i++) {
	            var pair = pairs[i];
	            var velocity_mag_sum = (pair.bodyA.speed + pair.bodyB.speed).toFixed(2);
	            callback_collision(pair.bodyA.label,pair.bodyB.label,velocity_mag_sum);
	        }
	        collision_run_once = true;
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
	ALL_THINGS.forEach(function(thing,i){
		if(thing.physics===true){
			if(thing.body.speed>velocity_max){
				var scale = velocity_max/thing.body.speed;
				var new_speed_x = thing.body.velocity.x * scale;
				var new_speed_y = thing.body.velocity.y * scale;
				Matter.Body.setVelocity(thing.body, {x:new_speed_x,y:new_speed_y});
			}
		}
	});


}










//##########################################################################################
//########################################################################################## UPDATE BACKEND
function fV_update_backend(){


	//_______________________________________________________________
	//_______________________________________________________________ gif update frame
	GAME_TICKS++;



	var current_time = Date.now();

	ALL_THINGS.forEach(function(thing,i){

		if(thing.gif===true){

			//so we can update every 1,2,3,4,5,6,7,8,9,10 ticks
			if(thing.gif_speed>0 && thing.gif_speed<=1.0){ 

				if((GAME_TICKS%(11-(Math.round(thing.gif_speed*10))))===0){
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
	ALL_THINGS.forEach(function(thing,i){

		//__________________________________________________________ show or hide 
		if(thing.physics===true){
			if(SHOW_BODY_WIREFRAMES===false){
				thing.body.render.visible = false;
			}else{
				thing.body.render.visible = true;
			}
		}

		//__________________________________________________________ out of view callback
		// if(thing.type==="circle"){
		// 	var contains = false;
		// 	for(var i = 0; i < 8; i++) {
		// 	    var px = thing.x + (thing.width/2) * Math.cos(2 * Math.PI * i / 8);
		// 	    var py = thing.y + (thing.height/2) * Math.sin(2 * Math.PI * i / 8);  
		// 	    if( Matter.Vertices.contains([{ x: 0, y: 0 }, { x: WIDTH, y: 0 }, { x: WIDTH, y: HEIGHT }, { x: 0, y: HEIGHT }], {x:px,y:py}) ){
		// 	    	contains = true;
		// 	    	break;
		// 	    }
		// 	}	
		// 	if(contains===false){
		// 		callback_out_of_view(thing.uid);
		// 	}			
		// }


	});


	//_______________________________________________________________
	//_______________________________________________________________ velocity (non physics)
	ALL_THINGS.forEach(function(thing,i){
		if(thing.physics===false){
			thing.x += thing.vx*1;
			thing.y += thing.vy*1;
		}
	});


	//_______________________________________________________________
	//_______________________________________________________________ rotation (ensure is between -2PI and 2PI)
	// ALL_THINGS.forEach(function(thing,i){
	// 	if(thing.rotation>2*Math.PI){
	// 		console.log("RR, rotation of, "+thing.rotation);
	// 		var rotation_redundancy = Math.abs(Math.floor(thing.rotation/(2*Math.PI)));
	// 		console.log("RR, redundancy, "+rotation_redundancy);
	// 		thing.rotation = thing.rotation-(rotation_redundancy*2*Math.PI);
	// 		console.log("RR, fix rotation, "+thing.rotation);
	// 	}
	// 	if(thing.rotation<-2*Math.PI){
	// 		console.log("RR, rotation of, "+thing.rotation);
	// 		var rotation_redundancy = Math.abs(Math.floor(thing.rotation/(2*Math.PI)));
	// 		console.log("RR, redundancy, "+rotation_redundancy);
	// 		thing.rotation = thing.rotation+(rotation_redundancy*2*Math.PI);
	// 		console.log("RR, fix rotation, "+thing.rotation);
	// 	}
	// });


	//_______________________________________________________________
	//_______________________________________________________________ out of view callback 
	// ! this could be slow if lots of things are out of view. need to do something clever here. !
	// ALL_THINGS.forEach(function(thing,i){
	// 	var v = getVertices(thing,"arr",false);
	// 	var out_of_view = true;
	// 	for(var i=0;i<v.length;i++){
	// 		if( pointInPolygon([v[i][0],v[i][1]], [[0,0],[WIDTH,0],[WIDTH,HEIGHT],[0,HEIGHT]]) ){
	// 			out_of_view = false;
	// 			break;
	// 		}
	// 	}
	// 	if(out_of_view === true){
	// 		callback_out_of_view(thing.uid);
	// 	}
	// });

	//_______________________________________________________________
	//_______________________________________________________________ angular roatation (non physics)
	ALL_THINGS.forEach(function(thing,i){
		if(thing.angular_velocity!==0){
			var rotation_per_frame = thing.angular_velocity/60.0; //we are running ~60fps
			thing.rotation += rotation_per_frame;

		}
	});

	//_______________________________________________________________
	//_______________________________________________________________ behavior: follow
	ALL_THINGS.forEach(function(thing,i){

		if(thing.follow!==false){ //check if following

			ALL_THINGS.forEach(function(thing_following,i){ //loop through all things again

				if(thing.follow===thing_following.uid){ //check if this is the thing we are following

					var dist = distanceBetweenPoints(thing.x,thing.y,thing_following.x,thing_following.y);

					if(dist > thing.follow_distance){ //only update position if our distance is greater than the follow distance

					    var xx = thing.x + ( (thing_following.x-thing.x) * thing.follow_speed );
					    var yy = thing.y + ( (thing_following.y-thing.y) * thing.follow_speed );

					    thing.fV_set_position(xx,yy);

					    //!important
						thing.fV_update_faux_velocity();

					}

				}

			});
		}

	});


	//_______________________________________________________________
	//_______________________________________________________________ behavior: circular path
	ALL_THINGS.forEach(function(thing,i){

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

			thing.fV_set_position(xx,yy);

			//!important
			thing.fV_update_faux_velocity();

		}

	});

	//_______________________________________________________________
	//_______________________________________________________________ animations

	function get_rate(end_time, duration, easing) {
		easing = easing || 'linear';
		var remaining_time = end_time - current_time;
		var easingEq = easing_types[easing];
		var pct = 1 - remaining_time / duration;
		return easingEq(pct);
	}

	ALL_THINGS.forEach(function(thing,i){

		thing.animations.forEach(function(animation,ii){

			//__________________________________________________________ animation x
			if(animation.type==="x"){ 

				var rate = get_rate(animation.end_time, animation.duration, animation.easing);

				var xx = animation.start_val + (rate * (animation.final_val - animation.start_val));

				thing.fV_set_x(xx);
				
				if (rate >= 0.999) {
					var xx = animation.final_val;
					thing.fV_set_x(xx);
					thing.animations.splice(ii,1);
					thing.animate_x = false;
					callback_animation_done(thing.uid,"x");
				}

				//!important
				thing.fV_update_faux_velocity();

			}
			//__________________________________________________________ animation y
			if(animation.type==="y"){ 

				var rate = get_rate(animation.end_time, animation.duration, animation.easing);

				var yy = animation.start_val + (rate * (animation.final_val - animation.start_val));

				thing.fV_set_y(yy);

				if (rate >= 0.999) {
					var yy = animation.final_val;
					thing.fV_set_y(yy);
					thing.animations.splice(ii,1);
					thing.animate_y = false;
					callback_animation_done(thing.uid,"y");
				}

				//!important
				thing.fV_update_faux_velocity();

			}
			//__________________________________________________________ animation position
			if(animation.type==="position"){

				var rate = get_rate(animation.end_time, animation.duration, animation.easing);

				var yy = animation.start_val_y + (rate * (animation.final_val_y - animation.start_val_y));
				var xx = animation.start_val_x + (rate * (animation.final_val_x - animation.start_val_x));

				thing.fV_set_position(xx,yy);

				if (rate >= 0.999) {
					var yy = animation.final_val_y;
					var xx = animation.final_val_x;
					thing.fV_set_position(xx,yy);
					thing.animations.splice(ii,1);
					thing.animate_position = false;
					callback_animation_done(thing.uid,"position");
				}

				//!important
				thing.fV_update_faux_velocity();

			}
			//__________________________________________________________ animation width
			if(animation.type==="width"){ 

				var rate = get_rate(animation.end_time, animation.duration, animation.easing);

				var ww = animation.start_val + (rate * (animation.final_val - animation.start_val));

				thing.fV_set_width(ww);

				if (rate >= 0.999) {
					var ww = animation.final_val;
					thing.fV_set_width(ww);
					thing.animations.splice(ii,1);
					thing.animate_width = false;
					callback_animation_done(thing.uid,"width");
				}

			}
			//__________________________________________________________ animation height
			if(animation.type==="height"){ 

				var rate = get_rate(animation.end_time, animation.duration, animation.easing);

				var hh = animation.start_val + (rate * (animation.final_val - animation.start_val));

				thing.fV_set_height(hh);

				if (rate >= 0.999) {
					var hh = animation.final_val;
					thing.fV_set_height(hh);
					thing.animations.splice(ii,1);
					thing.animate_height = false;
					callback_animation_done(thing.uid,"height");
				}



			}
			//__________________________________________________________ animation rotate
			if(animation.type==="rotate"){ 

				var rate = get_rate(animation.end_time, animation.duration, animation.easing);

				var rr = animation.start_val + (rate * animation.amount_to_rotate);

		    	thing.fV_set_angle(rr,"r");

				if (rate >= 0.999) {
					var rr = animation.final_val; //causing jerk with some easing 
					thing.fV_set_angle(rr,"r");
					thing.animations.splice(ii,1);
					thing.animate_rotation = false;
					callback_animation_done(thing.uid,"rotation");
				}

			}
			//__________________________________________________________ animation scale
			if(animation.type==="scale"){ 

				var rate = get_rate(animation.end_time, animation.duration, animation.easing);

				var hh = animation.start_val_h + (rate * (animation.final_val_w - animation.start_val_h));
				var ww = animation.start_val_w + (rate * (animation.final_val_h - animation.start_val_w));

				thing.fV_set_size(ww,hh);

				if (rate >= 0.999) {
					var hh = animation.final_val_h;
					var ww = animation.final_val_w;
					thing.fV_set_size(ww,hh);
					thing.rotation = animation.final_val;
					thing.animations.splice(ii,1);
					thing.animate_rotation = false;
					callback_animation_done(thing.uid,"rotation");
				}
			}





		});

	});

	//_______________________________________________________________
	//_______________________________________________________________oscillations
	ALL_THINGS.forEach(function(thing,i){

		thing.oscillations.forEach(function(oscillation,ii){

			//__________________________________________________________ oscillate x
			if(oscillation.type==="x"){ 

				var rate = get_rate(oscillation.end_time, oscillation.duration);
				var xx = oscillation.start_x + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
				thing.fV_set_x(xx);

			}
			//__________________________________________________________ oscillate y
			if(oscillation.type==="y"){ 

				var rate = get_rate(oscillation.end_time, oscillation.duration);
				var yy = oscillation.start_y + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
				thing.fV_set_y(yy);
			}
			//__________________________________________________________ oscillate width
			if(oscillation.type==="width"){ 

				var rate = get_rate(oscillation.end_time, oscillation.duration);
				var ww = oscillation.start_width + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
				thing.fV_set_width(ww);

			}
			//__________________________________________________________ oscillate height
			if(oscillation.type==="height"){ 

				var rate = get_rate(oscillation.end_time, oscillation.duration);
				var hh = oscillation.start_height + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
				thing.fV_set_height(hh);

			}
			//__________________________________________________________ oscillate scale
			if(oscillation.type==="scale"){ 

				var rate = get_rate(oscillation.end_time, oscillation.duration);
				var hh = oscillation.start_height + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
				var ww = oscillation.start_width + (Math.sin(rate * TWO_PI) * oscillation.amplitude);
				thing.fV_set_size(ww,hh);

			}

			//!important
			thing.fV_update_faux_velocity();

		});

	});

}