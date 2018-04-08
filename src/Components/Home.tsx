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
      <div className="landing-container fullheight-flexbox">
        <h1>InLoo</h1>
        <h4>Find the perfect toilet near you.</h4>
        <img src="InLieuLogoWhite.png" className="landing-logo" />
        <Link to="/login">
          <Button className="button">Login</Button>
        </Link>
      </div>
    );
  }
}

export default Home;