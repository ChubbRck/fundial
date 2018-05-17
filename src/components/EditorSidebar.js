import React, { PureComponent } from 'react'


class EditorSidebar extends PureComponent {

	render(){
		return(	
		    <div id = "sidebar-nav">
				<div className = "tab-container">
			    	<div onClick = {() => this.props.changePane("docs")} className="header_tab docu" id="documentation"><i className = "fa fa-file-code-o"></i>DOCS</div>
					<div onClick = {() => this.props.changePane("getting-started")} className="header_tab lern" id="getting_started"><i className = "fa fa-cubes"></i>LEARN</div>
					<div onClick = {() => this.props.changePane("assets")} className="header_tab asse" id="assets"><i className = "fa fa-file-image-o"></i>ASSETS</div>
					<div onClick = {() => this.props.changePane("simulator")} className="header_tab simu" id="simulation"><i className = "fa fa-play-circle"></i>RUN</div>
					<div onClick = {() => this.props.changePane("games")} className="header_tab game" id="games"><i className = "fa fa-gamepad"></i>MY GAMES</div>
				</div>
			</div>	
		);
	}
}


export default EditorSidebar;

