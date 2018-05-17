import React, { PureComponent } from 'react'



const EditorOverlay = props => (
  

);


export default EditorOverlay;





<div class="blackout"></div>
    	<div class="darken"></div>
    	<div class="darken_noclick"></div>
    	<div class="header_box"></div>
    
    	<div class="code_newname overlay xycenter">
			<input type="text" class="name_input" placeholder="Name Your Game">
		</div>
		<div class="code_loadlist overlay xycenter">
			<div class="code_loadlist_head">
				<div class="loadlist_head_col52">NAME</div>
				<div class="loadlist_head_col24">CREATED</div>
				<div class="loadlist_head_col24">EDITED</div>
				<div style="clear:both;"></div>
			</div>
			<!-- __________________________________________________________________ code: load -->
			<div class="code_loadlist_games">
			<!-- load from db -->
			</div>
		</div>
		<div class="popup_container_delete overlay xycenter">
		ARE YOU SURE YOU WANT TO DELETE '<span class="delete_name"></span>'?
		<div style="height:12px;"></div>
		<span class="popup_sel delete_code_click" id="yesiamsure">YES</span>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<span class="popup_sel delete_code_click" id="no">NO</span>
	</div>
		<!-- __________________________________________________________________ code: saved -->
    	<div class="was_saved overlay xycenter"><b>Saved!</b></div>
    	<!-- __________________________________________________________________ code: success -->
    	<div class="was_success overlay xycenter"><b>Success!</b></div>
    	<!-- __________________________________________________________________ code: cant save -->
    	<div class="cant_published overlay xycenter"></div>

    	<div class="code_insert overlay xycenter">
				    		
				    		<div class="code_insert_nav">
				    			<span class="jump_insert" id="j1">Thing</span> /
				    			<span class="jump_insert" id="j2">Draw</span> / 
				    			<span class="jump_insert" id="j3">Gif Control</span> / 
				    			<span class="jump_insert" id="j4">Rotation</span> / 
				    			<span class="jump_insert" id="j5">Environment</span> /
				    			<span class="jump_insert" id="j6">Interactions</span> /
				    			<span class="jump_insert" id="j7">Interactions w Things</span> /
				    			<span class="jump_insert" id="j8">Lines</span> /
				    			<span class="jump_insert" id="j9">Game Over</span> /
				    			<span class="jump_insert" id="j10">Timers</span> /
				    			<span class="jump_insert" id="j11">Repeating Backgrounds</span> /
				    			<span class="jump_insert" id="j12">Animations</span> /
				    			<span class="jump_insert" id="j13">Oscillations</span> /
				    			<span class="jump_insert" id="j14">Sounds</span> /
				    			<span class="jump_insert" id="j15">B: Physics</span> /
				    			<span class="jump_insert" id="j16">B: Collisions</span> /
				    			<span class="jump_insert" id="j17">B: Magnets</span> /
				    			<span class="jump_insert" id="j18">B: Springs</span> /
				    			<span class="jump_insert" id="j19">B: Circular Path</span> /
				    			<span class="jump_insert" id="j20">B: Follow</span> /
				    			<span class="jump_insert" id="j21">Text</span> /
				    			<span class="jump_insert" id="j22">The Goods</span> /
				    			<span class="jump_insert" id="j23">Globals</span> /
				    			<span class="jump_insert" id="j24">Callbacks</span> /
				    			<span class="jump_insert" id="j25">Device Motion</span>
				    		</div>

				    		<div class="code_insert_content">

					    		<div class="code_insert_section" id="jj1">
						    		<div class="code_insert_row_head" id="xjj1">T H I N G </div>
						    		<div class="code_insert_row">var myThing = fV_thing(_x,_y,_width,_height,_type,_img[optional]);</div>
						    		<div class="code_insert_row">.fV_draw();</div>
						    		<div class="code_insert_row">.fV_draw_between_points(_px1,_py1,_px2,_py2);</div>
						    		<div class="code_insert_row">.fV_set_position(_x,_y);</div>
						    		<div class="code_insert_row">.fV_set_x(_x);</div>
						    		<div class="code_insert_row">.fV_set_y(_y);</div>
						    		<div class="code_insert_row">.fV_set_size(_width,_height);</div>
						    		<div class="code_insert_row">.fV_set_width(_width);</div>
						    		<div class="code_insert_row">.fV_set_height(_height);</div>
						    		<div class="code_insert_row">.fV_set_velocity(_x,_y);</div>
						    		<div class="code_insert_row">.fV_set_velocity_x(_vx);</div>
						    		<div class="code_insert_row">.fV_set_velocity_y(_vy);</div>
						    		<div class="code_insert_row">.fV_set_velocity_magnitue(_vm);</div>
						    		<div class="code_insert_row">.fV_set_flip(_x,_y);</div>
						    		<div class="code_insert_row">.fV_destroy();</div>
						    		<div class="code_insert_row">.x</div>
						    		<div class="code_insert_row">.y</div>
						    		<div class="code_insert_row">.width</div>
						    		<div class="code_insert_row">.height</div>
						    		<div class="code_insert_row">.rotation_d</div>
						    		<div class="code_insert_row">.rotation_r</div>
						    		<div class="code_insert_row">.angular_velocity</div>
						    		<div class="code_insert_row">.vx</div>
						    		<div class="code_insert_row">.vy</div>
						    		<div class="code_insert_row">.vm</div>
						    		<div class="code_insert_row">.fV_get_out_of_view();</div>
						    	</div>

					    		<div class="code_insert_section" id="jj2">
						    		<div class="code_insert_row_head" id="xjj2">D R A W</div>
						    		<div class="code_insert_row">fV_fill_color(_r,_g,_b);</div>
						    		<div class="code_insert_row">fV_background_color(_r,_g,_b);</div>
						    		<div class="code_insert_row">fV_alpha(_a);</div>
						    	</div>

					    		<div class="code_insert_section" id="jj3">
						    		<div class="code_insert_row_head" id="xjj3">G I F &nbsp; C O N T R O L</div>
						    		<div class="code_insert_row">.fV_set_gif_speed(_s);</div>
						    		<div class="code_insert_row">.fV_set_gif_frame(_f);</div>
						    		<div class="code_insert_row">.fV_set_gif_in(_i);</div>
						    		<div class="code_insert_row">.fV_set_gif_out(_o);</div>
						    		<div class="code_insert_row">.fV_set_gif_playback(_p);</div>
						    	</div>

					    		<div class="code_insert_section" id="jj4">
						    		<div class="code_insert_row_head" id="xjj4">R O T A T I O N</div>
						    		<div class="code_insert_row">.fV_set_angle(_val,_unit);</div>
						    		<div class="code_insert_row">.fV_rotate(_val,_unit);</div>
						    		<div class="code_insert_row">.fV_set_angular_velocity(_val,_unit);</div>
						    		<div class="code_insert_row">.fV_set_max_angular_velocity(_val);</div>
						    		<div class="code_insert_row">.fV_get_angle_d();</div>
						    		<div class="code_insert_row">.fV_get_angle_r();</div>
						    		<div class="code_insert_row">r_to_d(_r);</div>
						    		<div class="code_insert_row">d_to_r(_d);</div>
						    	</div>

								<div class="code_insert_section" id="jj5">
						    		<div class="code_insert_row_head" id="xjj5">E N V I R O N M E N T</div>
						    		<div class="code_insert_row">fV_env_orientation(_orientation);</div>
						    		<div class="code_insert_row">fV_env_game_duration(_duration);</div>
						    		<div class="code_insert_row">fV_env_gravity(_gx,_gy);</div>
						    		<div class="code_insert_row">fV_env_game_timer_location(_tb);</div>
						    		<div class="code_insert_row">fV_env_show_outlines(true);</div>
						    		<div class="code_insert_row">fV_env_show_padded_outlines(true);</div>
						    		<div class="code_insert_row">fV_env_show_physics_outlines(true);</div>
						    	</div>

						    	<div class="code_insert_section" id="jj6">
						    		<div class="code_insert_row_head" id="xjj6">I N T E R A C T I O N S</div>
						    		<div class="code_insert_row">function event_tap(x,y){}</div>
						    		<div class="code_insert_row">function event_swipe(x1,y1,x2,y2,vx,vy,time){}</div>
						    		<div class="code_insert_row">function event_drag(x,y){}</div>
						    		<div class="code_insert_row">function event_down(x,y){}</div>
						    		<div class="code_insert_row">function event_up(x,y){}</div>
						    		<div class="code_insert_row">trigger_up();</div>
						    	</div>

						    	<div class="code_insert_section" id="jj7">
						    		<div class="code_insert_row_head" id="xjj7">I N T E R A C T I O N S &nbsp; W/ &nbsp; T H I N G S</div>
						    		<div class="code_insert_row">fV_tappable(myThing);</div>
						    		<div class="code_insert_row">fV_tappable([myThing1,myThing2,myThing3,...]);</div>
						    		<div class="code_insert_row">function event_tap_thing(thing_uid,x,y){}</div>
						    		<div class="code_insert_row">fV_draggable(myThing);</div>
						    		<div class="code_insert_row">fV_draggable([myThing1,myThing2,myThing3,...]);</div>
						    		<div class="code_insert_row">function event_drag_thing(thing_uid,x,y){}</div>
						    		<div class="code_insert_row">function event_drag_start_thing(thing_uid,x,y){}</div>
						    		<div class="code_insert_row">function event_drag_end_thing(thing_uid,x,y){}</div>
						    		<div class="code_insert_row">fV_launchable(myThing);</div>
						    		<div class="code_insert_row">fV_launchable([myThing1,myThing2,myThing3,...]);</div>
						    		<div class="code_insert_row">function event_launch_thing(thing_uid,vx,vy){}</div>
						    	</div>

						    	<div class="code_insert_section" id="jj8">
						   			<div class="code_insert_row_head" id="xjj8">L I N E S</div>
						    		<div class="code_insert_row">var myLine = fV_line(_x1,_y1,_x2,_y2,_weight);</div>
						    		<div class="code_insert_row">.fV_draw();</div>
						    		<div class="code_insert_row">.fV_set_weight(_weight);</div>
						    		<div class="code_insert_row">.fV_set_position(_x1,_y1,_x2,_y2);</div>
						    		<div class="code_insert_row">.fV_set_start_point(_x1,_y1);</div>
						    		<div class="code_insert_row">.fV_set_end_point(_x2,_y2);</div>
						    		<div class="code_insert_row">.x1</div>
						    		<div class="code_insert_row">.y1</div>
						    		<div class="code_insert_row">.x2</div>
						    		<div class="code_insert_row">.y2</div>
						    	</div>

								<div class="code_insert_section" id="jj9">
						   			<div class="code_insert_row_head" id="xjj9">G A M E &nbsp; O V E R</div>
						    		<div class="code_insert_row">fV_game_over(_success);</div>
						    		<div class="code_insert_row">GAME_OVER_STATE = true;</div>
						    	</div>

						    	<div class="code_insert_section" id="jj10">
						    		<div class="code_insert_row_head" id="xjj10">T I M E R</div>
						    		<div class="code_insert_row">var myTimer = fV_timer(_duration);</div>
						    		<div class="code_insert_row">var myTimerRepeating = fV_timer_repeating(_duration,_now);</div>
						    		<div class="code_insert_row">.fV_start();</div>
						    		<div class="code_insert_row">.fV_get_pct();</div>
						    		<div class="code_insert_row">.fV_clear();</div>
						    		<div class="code_insert_row">.fV_pause();</div>
						    		<div class="code_insert_row">.fV_resume();</div>
						    		<div class="code_insert_row">.fV_restart();</div>
						    		<div class="code_insert_row">function callback_timer(timer_uid){}</div>
						    	</div>

						    	<div class="code_insert_section" id="jj11">
						    		<div class="code_insert_row_head" id="xjj11">R E P E A T I N G &nbsp; B A C K G R O U N D S</div>
						    		<div class="code_insert_row">myBackground = fV_repeating_background(_x,_y,_width,_height,_orientation,_speed,_img);</div>
						    		<div class="code_insert_row">.fV_draw();</div>
						    		<div class="code_insert_row">.fV_set_speed(_s);</div>
						    	</div>

						    	<div class="code_insert_section" id="jj12">
						    		<div class="code_insert_row_head" id="xjj12">A N I M A T I O N S</div>
						    		<div class="code_insert_row">fV_animate_x(_thing,_x,_duration,_easing);</div>
						    		<div class="code_insert_row">fV_animate_y(_thing,_y,_duration,_easing);</div>
						    		<div class="code_insert_row">fV_animate_position(_thing,_x,_y,_duration,_easing);</div>
						    		<div class="code_insert_row">fV_animate_width(_thing,_width,_duration,_easing);</div>
						    		<div class="code_insert_row">fV_animate_height(_thing,_height,_duration,_easing);</div>
						    		<div class="code_insert_row">fV_animate_scale(_thing,_scale,_duration,_easing);</div>
						    		<div class="code_insert_row">fV_animate_rotate(_obj,_rotation,_units,_abs_or_rel,_duration,_easing,_direction[optional]);</div>
						    		<div class="code_insert_row">function callback_animation_done(thing_uid,animation_type){}</div>
						    	</div>

						    	<div class="code_insert_section" id="jj13">
						    		<div class="code_insert_row_head" id="xjj13">O S C I L L A T I O N S</div>
						    		<div class="code_insert_row">fV_oscillate_x(_thing,_amplitue,_duration);</div>
						    		<div class="code_insert_row">fV_oscillate_y(_thing,_amplitue,_duration);</div>
						    		<div class="code_insert_row">fV_oscillate_width(_thing,_amplitue,_duration);</div>
						    		<div class="code_insert_row">fV_oscillate_height(_thing,_amplitue,_duration);</div>
						    		<div class="code_insert_row">fV_oscillate_scale(_thing,_amplitue,_duration);</div>
						    	</div>
						 		
						 		<div class="code_insert_section" id="jj14">	
						 			<div class="code_insert_row_head" id="xjj14">S O U N D S</div>
						 			<div class="code_insert_row">var mySound = fV_sound("somefile.mp3");</div>
						 			<div class="code_insert_row">.fV_play();</div>
						 			<div class="code_insert_row">.fV_stop();</div>
						 			<div class="code_insert_row">.fV_pause();</div>
						 			<div class="code_insert_row">.fV_volume(_volume);</div>
						 			<div class="code_insert_row">var myBlip = fV_blip(_freq,_duration,_volume);</div>
						 			<div class="code_insert_row">.fV_play();</div>
						 			<div class="code_insert_row">fV_stop_all_sounds();</div>
						 		</div>

						 		<div class="code_insert_section" id="jj15">
						 			<div class="code_insert_row_head" id="xjj15">B E H A V I O R :&nbsp; P H Y S I C S</div>
						 			<div class="code_insert_row">fV_behavior_physics(_thing);</div>
						 			<div class="code_insert_row">fV_behavior_physics([_thing1,_thing2,_thing3]);</div>
						 			<div class="code_insert_row">.fV_gravity(true);</div>
						 			<div class="code_insert_row">.fV_set_air_friction(_af);</div>
						 			<div class="code_insert_row">.fV_apply_force(_fx,_fy);</div>
						 			<div class="code_insert_row">.fV_set_physics_paddding(_x,_y);</div>
						 			<div class="code_insert_row">.fV_set_fixed(_bool);</div>
						 			<div class="code_insert_row">.fV_set_rotate_freely(_bool);</div>
						 			<div class="code_insert_row">.fx</div>
						 			<div class="code_insert_row">.fy</div>
						 			<div class="code_insert_row">.fm</div>
						 			<div class="code_insert_row">fV_behavior_physics_remove(_thing);</div>
						 		</div>

						 		<div class="code_insert_section" id="jj16">
						  			<div class="code_insert_row_head" id="xjj16">B E H A V I O R :&nbsp; C O L L I S I O N</div>
						 			<div class="code_insert_row">fV_behavior_collision(_thing,_restitution);</div>
						 			<div class="code_insert_row">function callback_collision(thing1_uid,thing2_uid){}</div>
						 			<div class="code_insert_row">.fV_set_restitution(_r);</div>
						 			<div class="code_insert_row">.fV_set_collision_group(_g);</div>
						 			<div class="code_insert_row">fV_behavior_collision_remove(_thing);</div>
						 		</div>

						 		<div class="code_insert_section" id="jj17">
						 			<div class="code_insert_row_head" id="xjj17">B E H A V I O R :&nbsp; M A G N E T</div>
						 			<div class="code_insert_row">fV_behavior_magnet(_thing,_force,_radius,_gradient);</div>
						 			<div class="code_insert_row">.fV_set_magnet_force(_f);</div>
						 			<div class="code_insert_row">.fV_set_magnet_radius(_r);</div>
						 			<div class="code_insert_row">fV_behavior_magnet_remove(_thing);</div>
						 		</div>

						 		<div class="code_insert_section" id="jj18">
						 			<div class="code_insert_row_head" id="xjj18">B E H A V I O R :&nbsp; S P R I N G</div>
						 			<div class="code_insert_row">fV_behavior_spring(_thing,_ax,_ay,_k,_d,_resting);</div>
						 			<div class="code_insert_row">.fV_set_spring_anchor(_ax,_ay);</div>
						 			<div class="code_insert_row">.fV_set_spring_anchor_x(_ax);</div>
						 			<div class="code_insert_row">.fV_set_spring_anchor_y(_ay);</div>
						 			<div class="code_insert_row">fV_behavior_spring_remove(_thing);</div>
						 		</div>

								<div class="code_insert_section" id="jj19">
						 			<div class="code_insert_row_head" id="xjj19">B E H A V I O R :&nbsp; C I R C U L A R &nbsp; P A T H</div>
						 			<div class="code_insert_row">fV_behavior_circular_path(_thing,_cx,_cy,_speed);</div>
						 			<div class="code_insert_row">.fV_set_circular_path_center(_cx,_cy);</div>
						 			<div class="code_insert_row">.fV_set_circular_path_center_x(_cx);</div>
						 			<div class="code_insert_row">.fV_set_circular_path_center_y(_cy);</div>
						 			<div class="code_insert_row">.fV_set_circular_path_speed(_s);</div>
						 			<div class="code_insert_row">.fV_set_circular_path_angle(_a);</div>
						 			<div class="code_insert_row">.fV_get_circular_path_angle();</div>
						 			<div class="code_insert_row">fV_behavior_circular_path_remove(_thing);</div>
						 		</div>

						 		<div class="code_insert_section" id="jj20">
						 			<div class="code_insert_row_head" id="xjj20">B E H A V I O R :&nbsp; F O L L O W</div>
						 			<div class="code_insert_row">fV_behavior_follow(_thing,_thingf,_speed,_distance);</div>
						 			<div class="code_insert_row">.fV_set_follow_speed(_s);</div>
						 			<div class="code_insert_row">fV_behavior_follow_remove(_thing);</div>
						 		</div>

						 		<div class="code_insert_section" id="jj21">
						 			<div class="code_insert_row_head" id="xjj21">T E X T</div>
						 			<div class="code_insert_row">var myText = fV_text(_x,_y,_font,_size,_string);</div>
						 			<div class="code_insert_row">.fV_draw();</div>
						 			<div class="code_insert_row">.fV_set_message(_string);</div>
						 			<div class="code_insert_row">.fV_set_size(_s);</div>
						 			<div class="code_insert_row">.fV_set_position(_x,_y);</div>
						 			<div class="code_insert_row">.fV_set_max_width(_w);</div>
						 			<div class="code_insert_row">.fV_set_alignment(_a); </div>  
						 		</div>  

						 		<div class="code_insert_section" id="jj22">
						  			<div class="code_insert_row_head" id="xjj22">T H E &nbsp; G O O D S &nbsp; ( M A T H )</div>
						 			<div class="code_insert_row">.fV_get_vertices(_use_padding);</div>
						 			<div class="code_insert_row">fV_coincide(_thing1,_thing2);</div>
						 			<div class="code_insert_row">.fV_set_padding(_px,_py);</div>
						 			<div class="code_insert_row">fV_encapsulate(_thing1,_thing2);</div>
						 			<div class="code_insert_row">fV_point_is_inside(_thing,_x,_y);</div>
						 			<div class="code_insert_row">fV_distance_between_points(_p1x,_p1y,_p2x,_p2y);</div>
						 			<div class="code_insert_row">r_to_d(_r);</div>
						 			<div class="code_insert_row">d_to_r(_d);</div>
						 			<div class="code_insert_row">fV_angle_between_points(_p1x,_p1y,_p2x,_p2y,_units);</div>
						 			<div class="code_insert_row">fV_line_intersects_thing(_thing,_line);</div>
						 			<div class="code_insert_row">fV_intersecting_lines(_line1,_line2);</div>
						 			<div class="code_insert_row">fV_intersecting_linespts(_l1x1,_l1y1,_l1x2,_l1y2,_l2x1,_l2y1,_l2x2,_l2y2);</div>
						 			<div class="code_insert_row">fV_intersecting_lines_point(_line1,_line2);</div>
						 			<div class="code_insert_row">fV_intersecting_linespts_point(_l1x1,_l1y1,_l1x2,_l1y2,_l2x1,_l2y1,_l2x2,_l2y2);</div>
						 			<div class="code_insert_row">fV_magnitude(_vx,_vy);</div>
						 			<div class="code_insert_row">fV_random(_min,_max);</div>
						 		</div>

						 		<div class="code_insert_section" id="jj23">
						  			<div class="code_insert_row_head" id="xjj23">G L O B A L S</div>
						 			<div class="code_insert_row">GAME_MS</div>
						 			<div class="code_insert_row">GAME_TICKS</div>
						 			<div class="code_insert_row">WIDTH</div>
						 			<div class="code_insert_row">HEIGHT</div>
						 			<div class="code_insert_row">DRAW_FROM_CENTER</div>
						 			<div class="code_insert_row">MOUSEX</div>
						 			<div class="code_insert_row">MOUSEY</div>
						 			<div class="code_insert_row">DEVICE_ACCELERATION.x</div>
						 			<div class="code_insert_row">DEVICE_ACCELERATION.y</div>
						 			<div class="code_insert_row">DEVICE_ACCELERATION.z</div>
						 			<div class="code_insert_row">DEVICE_GYROSCOPE.alpha</div>
						 			<div class="code_insert_row">DEVICE_GYROSCOPE.gamma</div>
						 			<div class="code_insert_row">DEVICE_GYROSCOPE.beta</div>
						 		</div>

						 		<div class="code_insert_section" id="jj24">
						  			<div class="code_insert_row_head" id="xjj24">C A L L B A C K S</div>
						 			<div class="code_insert_row">callback_timer(timer_uid){}</div>
						 			<div class="code_insert_row">callback_collision(thing1_uid,thing2_uid){}</div>
						 			<div class="code_insert_row">callback_animation_done(thing_uid,animation_type){}</div>
						 		</div>

						 		<div class="code_insert_section" id="jj25">
						  			<div class="code_insert_row_head" id="xjj25">D E V I C E  M O T I O N</div>
						 			<div class="code_insert_row">fV_get_device_acceleration_magnitude();</div>
						 		</div>


					 		</div>
				    	</div>


		<!-- ########################################################################### -->
		<!-- ########################################################################### -->
		<!-- ______________________________________________________________________ LOGIN -->
		<div class="login_black">
			<div class="rel relfuck">
				<div class="login_bar bar_docu" style="border-left:2px solid #fff"></div> 
				<div class="login_bar bar_asse"></div> 
				<div class="login_bar bar_code"></div> 
				<div class="login_bar bar_simu"></div> 
				<div class="login_bar bar_publ"></div> 
				<div class="login_bar bar_lern" style="border-right:2px solid #fff"></div> 
			</div>
		</div>
		<div class="login_box xycenter">
			<input class="login_input" type="text" style="text-transform:uppercase">
		</div>
		<div class="logged_in_user">
			<div class="logout_link">LOGOUT</div>
		</div>





