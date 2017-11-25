import * as React from "react";
import * as firebase from "firebase";
import { Segment, Input, Button } from "semantic-ui-react";

interface Props {

}
interface State {

}

export default class Find extends React.Component<Props, State> {
  render() {
    return (
      <Segment>
        <div className="map">
        </div>
      </Segment>
    );
  }
}