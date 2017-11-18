import * as React from "react";
import { Route } from "react-router-dom";
import "./App.css";

import Home from "./Components/Home";

class App extends React.Component {
  render() {
    return (
      <div id="main">
        <Route exact={true} path="/" component={Home} />
      </div>
    );
  }
}

export default App;
