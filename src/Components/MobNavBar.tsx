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
  render() {
    return (
      <Menu attached="top" tabular={true}>
        <Link to="/app/find">
          <Menu.Item name="find" active={this.props.location.pathname === "/app/find"}>
            Find
          </Menu.Item>
        </Link>
        <Link to="/app/review">
          <Menu.Item name="review" active={this.props.location.pathname === "/app/review"}>
            Review
          </Menu.Item>
        </Link>
        <Link to="/app/settings">
          <Menu.Item name="settings" active={this.props.location.pathname === "/app/settings"}>
            Settings
          </Menu.Item>
        </Link>
      </Menu>
    );
  }
}