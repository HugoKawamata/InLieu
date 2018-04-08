import * as React from "react";
import * as firebase from "firebase";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Segment, Input, Button, Menu } from "semantic-ui-react";

interface URLParameters {}

interface Props extends RouteComponentProps<URLParameters> {

}
interface State { }

export default class MobNavBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {user: null};
  }

  componentDidMount() {
    this.setState({user: firebase.auth().currentUser});
  }

  render() {
    const logInOutTab = firebase.auth().currentUser == null ? (
        <Link to="/login">
          <Menu.Item name="login">
            Login
          </Menu.Item>
        </Link>
    ) : (
        <a onClick={
          () => firebase.auth().signOut().then( () => {
              location.reload();
            }, (error) => {
              console.log(error);
            } )
          }>
          <Menu.Item name="logout">
            Logout
          </Menu.Item>
        </a>
    )

    return (
      <Menu attached="top" className="mobnavbar" tabular={true}>
        <Link to="/app/find">
          <Menu.Item name="find" active={this.props.location.pathname === "/app/find"}>
            Find
          </Menu.Item>
        </Link>
        <Link to="/app/review">
          <Menu.Item name="review" active={this.props.location.pathname.slice(0,11) === "/app/review"}>
            Review
          </Menu.Item>
        </Link>
        { logInOutTab }
        {/*
        <Link to="/app/settings">
          <Menu.Item name="settings" active={this.props.location.pathname === "/app/settings"}>
            Settings
          </Menu.Item>
        </Link>
        */}
      </Menu>
    );
  }
}