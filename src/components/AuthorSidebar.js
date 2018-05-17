import React, { PureComponent } from 'react'


class AuthorSidebar extends PureComponent {

	render() {
		return(
    		<section id = "authorSidebar">
				<img className = "avatar" src={require("../img/avatar-placeholder.png")} />
				<span className = "name">{this.props.user}</span><br/>
				<span className = "username">{this.props.username}</span>
				<p className = "bio">This is this user's bio information. They've been around for a while and done a bunch of stuff!</p>
		
			</section>	
		)
	}
}


export default AuthorSidebar;

