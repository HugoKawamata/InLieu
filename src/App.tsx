import * as React from "react";
import { Route } from "react-router-dom";
import "./App.css";

import firebase from "./firebase";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Find from "./Components/Find";
import MobNavBar from "./Components/MobNavBar";

let database = firebase.database().ref();

const FBHome = () => {
  return <Home fref={database} />;
};

interface Props {}

class App extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIcon: "find"
    };
  }

  render() {
    return (
      <div id="main">
        <Route path="/app" component={MobNavBar} />
        <Route exact={true} path="/" component={FBHome} />
        <Route exact={true} path="/login" component={Login} />
        <Route exact={true} path="/app/find" component={Find} />
      </div>
    );
  }
}

export default App;
