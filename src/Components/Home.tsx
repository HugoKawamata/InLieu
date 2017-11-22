import * as React from "react";
import * as firebase from "firebase";

import { Link } from "react-router-dom";

interface HomeProps {
  ref: firebase.database.Reference;
}

interface State { }

class Home extends React.Component<HomeProps, State> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <Link to="/login">
            <button className="button">Login</button>
          </Link>
        </p>
      </div>
    );
  }
}

export default Home;