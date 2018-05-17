import React, { PureComponent } from 'react'



const EditorFooter = props => (
    <footer>
		<div className="container-fluid">
		    <ul className="file-operation-tray">
		        <li><div className = "button cb super-slim" id = "code_button_new" href="">New</div></li>
		        <li><div className = "button cb super-slim" id = "code_button_load" href="">Load</div></li>
		        <li><div className = "button cb super-slim" id = "code_button_save" href="">Save</div></li>
		        <li><div className = "button cb super-slim" id = "code_button_delete" href="">Delete</div></li>
		    </ul>
			<div className="code_marquee">
				Loaded: <span id="marquee_name"><i>Untitled</i></span> 
				<span className="save_update">UNSAVED</span>
			</div>
			<div className = "keyboard_shortcut_tip_container">
				<b>⌘+i</b> to insert code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<b>⌘+r</b> to run simulation &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<b>⌘+s</b> to save &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
	</footer>
);


export default EditorFooter;

