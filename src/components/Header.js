import React from "react";

const Header = props => (
    	<nav className = "navbar navbar-fixed-top">
            <div className = "container-fluid">
                <div className = "navbar-header"> 
                    <a href="home-link"><img className = "dev-logo" src={require("../img/giphy-logo.gif")} /></a>
                </div>
                <div id="navbar" className = "navbar-collapse collapse">
                    <ul id = "login-container">
            
                     
                            <li id="header" className = "no-pad">
                            <div className = "default-nav partner-nav">
                                <span className = "user">
                                    <a className = "username-button user-url no-user" href="none">
                                        <span className = "avatar"><i class = "ss-icon ss-user"></i></span>
                                        <span className = "username">Log In</span>
                                    </a>
                                </span>
                            </div>
                        </li>
                   
                    </ul>
                  

                </div>
            </div>
        </nav>
);

export default Header;
