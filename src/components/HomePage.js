import React from "react";
// import { getFunName } from "../helpers";
import Header from "./Header";

class HomePage extends React.Component {
  myInput = React.createRef();

  goToStore = event => {
    // 1. Stop the form from submitting
    event.preventDefault();
    // 2. get the text from that input
    const storeName = this.myInput.value.value;
    // 3. Change the page to /store/whatever-they-entered
    this.props.history.push(`/store/${storeName}`);
  };

  render() {
    return (
      <div>
        <Header tagline = "Welcome to da games"/>
        <div>
        Hi hi hi
        </div>
      </div>
    );
  }
}

export default HomePage;
