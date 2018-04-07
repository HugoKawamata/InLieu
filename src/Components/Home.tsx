/*global google*/
import * as React from "react";
import * as firebase from "firebase";
import { Button } from "semantic-ui-react";

import { Link } from "react-router-dom";

interface HomeProps {
  fdb: firebase.database.Database;
}

interface State { }

class Home extends React.Component<HomeProps, State> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to InLoo</h2>
        </div>
        <p className="App-intro">
          <Link to="/login">
            <Button className="button">Login</Button>
          </Link>
        </p>
      </div>
    );
  }
}

export default Home;