var x_dn;
var y_dn;
var x_up;
var y_up;
var x_diff;
var y_diff;
var starttime;
var swipe_duration_threshold = 200; //swipe needs to happen in under this time (ms) to be considered a swipe
var swipe_distance_threshold = 20; //swipe distance needs to be at least this long (pixels) to be considered a swipe
var uids_mouse_down = []; //we need to populate an array of the mousedown things in the case of a throw (where mouseup occurs outside the thing)
var thing_down;
var velocity_multiplier_desktop = 22; //arbitrary multiplier to make velocity match interaction velocity
var velocity_multiplier_mobile = 22;
var velocity_multiplier_desktop_physics = 22;
var velocity_multiplier_mobile_physics = 22;








// DESKTOP
//####################################################################################
//####################################################################################



//________________________________________________________________________ mousedown
$("#csim").mousedown(function(e){

	if(!isMobile.any()){

		//record mouse position x,y and start time
		x_dn = e.offsetX;
		y_dn = e.offsetY;
		starttime = new Date(); 

		//event MOUSE DOWN
		event_down(x_dn,y_dn); // !EVENT! event_down

		//determine top thing
		var top_thing = null;
		var top_z_index = 0;
		ALL_THINGS.forEach(function(thing,i){
			if(fV_point_is_inside(thing,x_dn,y_dn)){
					if(thing.z_index > top_z_index){
						top_thing = thing;
						top_z_index = thing.z_index;
					}
			}
		});

		//event DRAG START
		if(top_thing!==null && top_thing.draggable===true){

			top_thing.dragging=true;

			x_diff = x_dn - top_thing.x;
			y_diff = y_dn - top_thing.y;

			//we need to remove all velocity on drag
			top_thing.vx = 0;
			top_thing.vy = 0;
			if(top_thing.physics===true){
				Body.setVelocity(top_thing.body, {x:0,y:0});
			}

			event_drag_start_thing(top_thing.uid,TOUCHX-x_diff,TOUCHY-y_diff); // !EVENT! event_drag_start_thing

		}

		//event LAUNCH uid_down
		if(top_thing!==null && top_thing.launchable===true){
			thing_down = top_thing;
		}else{
			thing_down = null;
		}

		//interacting
		INTERACTING = true;

		//prevent default mouse behavior
		e.preventDefault();

    }

});

//________________________________________________________________________ mouseup
$("#csim").mouseup(function(e){

	if(!isMobile.any()){

		//x,y,dist,timediff
		TOUCHX = x_up = e.offsetX;
		TOUCHY = y_up = e.offsetY;
		var dist = Math.sqrt((x_dn-x_up)*(x_dn-x_up)+(y_dn-y_up)*(y_dn-y_up));
		var timediff = new Date()-starttime;

		//event MOUSE UP
		event_up(x_up,y_up); // !EVENT! event_up

		//determine top thing
		var top_thing = null;
		var top_z_index = 0;
		ALL_THINGS.forEach(function(thing,i){
			if(fV_point_is_inside(thing,x_up,y_up)){
				if(thing.z_index > top_z_index){
					top_thing = thing;
					top_z_index = thing.z_index;
				}
			}
		});

		//event TAP (CLICK)
		if(top_thing!==null && top_thing.tappable===true){
			event_tap_thing(top_thing.uid,x_up,y_up); // !EVENT! event_tap_thing
		}

		//event SWIPE 
		if(dist>swipe_distance_threshold && timediff<swipe_duration_threshold){ //we have a swipe

			var vx = ((x_up-x_dn) / timediff) * velocity_multiplier_desktop; 
			var vy = ((y_up-y_dn) / timediff) * velocity_multiplier_desktop;

			event_swipe(x_dn,y_dn,x_up,y_up,vx,vy,timediff); // !EVENT! event_swipe
		}

		//event LAUNCH
		if(thing_down!==null && thing_down.launchable===true && thing_down.draggable!==true){
			if(dist>swipe_distance_threshold && timediff<swipe_duration_threshold){ //we have a swipe
				event_launch_thing(thing_down.uid,vx,vy); // !EVENT! event_launch_thing
			}
		}

		//event LAUCCH (if also draggable)
		if(thing_down!==null && thing_down.launchable===true && thing_down.draggable===true){
			console.log(MOUSEVX+":"+MOUSEVY);
			if(timediff<swipe_duration_threshold ){
				var vx2 = ((x_up-x_dn) / timediff) * velocity_multiplier_desktop; 
				var vy2 = ((y_up-y_dn) / timediff) * velocity_multiplier_desktop;
				event_launch_thing(thing_down.uid,vx2,vy2); // !EVENT! event_launch_thing
			}else if(Math.abs(MOUSEVX)>30 || Math.abs(MOUSEVY)>30){ //if we drag it around for a bit THEN launch. tricky scenario.
				event_launch_thing(thing_down.uid,MOUSEVX,MOUSEVY); // !EVENT! event_launch_thing
			}else{
				console.log("dragging?");
			}
		}

		thing_down = null;

		//event DRAG
		ALL_THINGS.forEach(function(thing,i){
			if(thing.dragging===true){
				thing.dragging=false; 
				event_drag_end_thing(thing.uid,TOUCHX-x_diff,TOUCHY-y_diff); // !EVENT! event_drag_end_thing
				// if(thing.temp_fixed===true){
				// 	console.log("done temp fix");
				// 	thing.fV_set_static(false);
				// 	thing.temp_fixed = false;
				// }
			}
		});

		//event TAP
		if(dist<swipe_distance_threshold){ //we have a tap?
			event_tap(x_up,y_up); // !EVENT! event_tap
		}

		//interacting
		INTERACTING = false;

		//prevent default mouse behavior
		e.preventDefault();
		
	}

});
function trigger_up(){
	$("#csim").mouseup();
	$("#csim").trigger('touchend');
}

var mouse_speed_time = 0;
var mouse_x_prev = 0;
var mouse_y_prev = 0;
//________________________________________________________________________ mousemove
$("#csim").mousemove(function(e){

	if(!isMobile.any()){

		MOUSEX = e.offsetX;
		MOUSEY = e.offsetY;

		//MOUSEVX,MOUSEVY
		//if(GAME_TICKS%2==0){ //check every 10 ticks
			var timediff = new Date()-mouse_speed_time;
			MOUSEVX = ((MOUSEX-mouse_x_prev) / timediff) * 22;
			MOUSEVY = ((MOUSEY-mouse_y_prev) / timediff) * 22;
			mouse_speed_time = new Date();
			mouse_x_prev = MOUSEX;
			mouse_y_prev = MOUSEY;
		//}

		if(INTERACTING===true){

			TOUCHX = e.offsetX;
			TOUCHY = e.offsetY;

			if(TOUCHX==x_dn && TOUCHY==y_dn){

				//do nothing, zero distance drag = weirdness & divide by zero badness

			}else{

				event_drag(TOUCHX,TOUCHY); // !EVENT! event_drag

				ALL_THINGS.forEach(function(thing,i){
					if(thing.dragging===true){
						event_drag_thing(thing.uid,TOUCHX-x_diff,TOUCHY-y_diff); // !EVENT! event_drag_thing
						// if(thing.fixed===false){
						// 	console.log("temp fix");
						// 	thing.fV_set_static(true);
						// 	thing.temp_fixed = true;
						// }					
					}
				});

			}

			e.preventDefault();

		}
	}

});












// MOBILE
//####################################################################################
//####################################################################################


//________________________________________________________________________ tapstart
//$().bind('tapstart', function(e,o) { 
$('#csim').on('touchstart', function(e) {

	console.log("t");

	if(isMobile.any()){

		console.log("* start");

		//e.preventDefault();

		//record mouse position x,y and start time
		x_dn = pointerEventToXY(e).x;
		y_dn = pointerEventToXY(e).y;
		starttime = new Date(); 

		//event MOUSE DOWN
		event_down(x_dn,y_dn); // !EVENT! event_down

		//determine top thing
		var top_thing = null;
		var top_z_index = 0;
		ALL_THINGS.forEach(function(thing,i){
			if(fV_point_is_inside(thing,x_dn,y_dn)){
					if(thing.z_index > top_z_index){
						top_thing = thing;
						top_z_index = thing.z_index;
					}
			}
		});

		//event DRAG START
		if(top_thing!==null && top_thing.draggable===true){

			top_thing.dragging=true;

			x_diff = x_dn - top_thing.x;
			y_diff = y_dn - top_thing.y;

			//we need to remove all velocity on drag
			top_thing.vx = 0;
			top_thing.vy = 0;
			if(top_thing.physics===true){
				Body.setVelocity(top_thing.body, {x:0,y:0});
			}

			event_drag_start_thing(top_thing.uid,TOUCHX-x_diff,TOUCHY-y_diff); // !EVENT! event_drag_start_thing

		}

		//event LAUNCH uid_down
		if(top_thing!==null && top_thing.launchable===true){
			thing_down = top_thing;
		}else{
			thing_down = null;
		}

		//interacting
		INTERACTING = true;

    }

});
//________________________________________________________________________ tapend
//$('#csim').bind('tapend', function(e,o) { 
//$('').on('touchend', function(e) {
$(document).on('touchend', '#csim', function(e) {

	if(isMobile.any()){

		console.log("* end");

		e.preventDefault();

		//x,y,dist,timediff
		TOUCHX = x_up = pointerEventToXY(e).x;
		TOUCHY = y_up = pointerEventToXY(e).y;
		var dist = Math.sqrt((x_dn-x_up)*(x_dn-x_up)+(y_dn-y_up)*(y_dn-y_up));
		var timediff = new Date()-starttime;

		//event MOUSE UP
		event_up(x_up,y_up); // !EVENT! event_up

		//determine top thing
		var top_thing = null;
		var top_z_index = 0;
		ALL_THINGS.forEach(function(thing,i){
			if(fV_point_is_inside(thing,x_up,y_up)){
				if(thing.z_index > top_z_index){
					top_thing = thing;
					top_z_index = thing.z_index;
				}
			}
		});

		//event TAP 
		if(top_thing!==null && top_thing.tappable===true){
			event_tap_thing(top_thing.uid,x_up,y_up); // !EVENT! event_tap_thing

		}

		//event SWIPE 
		if(dist>swipe_distance_threshold && timediff<swipe_duration_threshold){ //we have a swipe

			var vx = ((x_up-x_dn) / timediff) * velocity_multiplier_desktop; 
			var vy = ((y_up-y_dn) / timediff) * velocity_multiplier_desktop;

			event_swipe(x_dn,y_dn,x_up,y_up,vx,vy,timediff); // !EVENT! event_swipe
		}

		//event LAUNCH
		if(thing_down!==null && thing_down.launchable===true && thing_down.draggable!==true){
			if(dist>swipe_distance_threshold && timediff<swipe_duration_threshold){ //we have a swipe
				event_launch_thing(thing_down.uid,vx,vy); // !EVENT! event_launch_thing
			}
		}

		//event LAUCCH (if also draggable)
		if(thing_down!==null && thing_down.launchable===true && thing_down.draggable===true){
			console.log(MOUSEVX+":"+MOUSEVY);
			if(timediff<swipe_duration_threshold ){
				var vx2 = ((x_up-x_dn) / timediff) * velocity_multiplier_desktop; 
				var vy2 = ((y_up-y_dn) / timediff) * velocity_multiplier_desktop;
				event_launch_thing(thing_down.uid,vx2,vy2); // !EVENT! event_launch_thing
			}else if(Math.abs(MOUSEVX)>30 || Math.abs(MOUSEVY)>30){ //if we drag it around for a bit THEN launch. tricky scenario.
				event_launch_thing(thing_down.uid,MOUSEVX,MOUSEVY); // !EVENT! event_launch_thing
			}else{
				console.log("dragging?");
			}
		}

		thing_down = null;

		//event DRAG
		ALL_THINGS.forEach(function(thing,i){
			if(thing.dragging===true){
				thing.dragging=false; 
				event_drag_end_thing(thing.uid,TOUCHX-x_diff,TOUCHY-y_diff); // !EVENT! event_drag_end_thing
				// if(thing.temp_fixed===true){
				// 	thing.fV_set_static(false);
				// 	thing.temp_fixed = false;
				// }
			}
		});

		//event TAP
		if(dist<swipe_distance_threshold){ //we have a tap?
			event_tap(x_up,y_up); // !EVENT! event_tap
		}

		//interacting
		INTERACTING = false;

	}

});
//________________________________________________________________________ tapmove
//$('#csim').bind('tapmove', function(e,o) { 
$('#csim').on('touchmove', function(e) {

	if(isMobile.any()){

		console.log("* move");

		//e.preventDefault();

		MOUSEX = pointerEventToXY(e).x;
		MOUSEY = pointerEventToXY(e).y;

		//MOUSEVX,MOUSEVY
		//if(GAME_TICKS%2==0){ //check every 10 ticks
			var timediff = new Date()-mouse_speed_time;
			MOUSEVX = ((MOUSEX-mouse_x_prev) / timediff) * 22;
			MOUSEVY = ((MOUSEY-mouse_y_prev) / timediff) * 22;
			mouse_speed_time = new Date();
			mouse_x_prev = MOUSEX;
			mouse_y_prev = MOUSEY;
		//}

		if(INTERACTING===true){

			TOUCHX = pointerEventToXY(e).x;
			TOUCHY = pointerEventToXY(e).y;

			if(TOUCHX==x_dn && TOUCHY==y_dn){

				//do nothing, zero distance drag = weirdness & divide by zero badness

			}else{

				event_drag(TOUCHX,TOUCHY); // !EVENT! event_drag

				ALL_THINGS.forEach(function(thing,i){
					if(thing.dragging===true){
						event_drag_thing(thing.uid,TOUCHX-x_diff,TOUCHY-y_diff); // !EVENT! event_drag_thing
						// if(thing.fixed===false){
						// 	thing.fV_set_static(true);
						// 	thing.temp_fixed = true;
						// }
					}
				});



			}

			e.preventDefault();

		}

	}

});

//________________________________________________________________________ accelerometer
window.addEventListener("deviceorientation", function(e) {
	var tilt_LR = e.gamma;
	var tilt_FB = e.beta;
	var rot = e.alpha;

	event_tilt(tilt_LR, tilt_FB, rot);
}, true);



    var pointerEventToXY = function(e){
      var out = {x:0, y:0};
      if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX;
        out.y = touch.pageY;
      } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
        out.x = e.pageX;
        out.y = e.pageY;
      }
      return out;
    };












