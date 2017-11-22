import * as React from "react";
import { Route } from "react-router-dom";
import "./App.css";

import firebase from "./firebase";
import Home from "./Components/Home";

let database = firebase.database().ref();

let FBHome = () => {
  return <Home ref={database} />
}

class App extends React.Component {
  render() {
    return (
      <div id="main">
        <Route exact={true} path="/" component={FBHome} />
      </div>
    );
  }
}

export default App;
