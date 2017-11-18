import * as React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
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