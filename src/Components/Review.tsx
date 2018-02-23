/*global google*/
import * as React from "react";
import { Link } from "react-router-dom";
import * as firebase from "firebase";
import { Segment, Input, Button } from "semantic-ui-react";
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";

interface Props {
  fdb: firebase.database.Database;
  toilets: Object[];
}

interface State {}

const ToiletButton = (props: {address: string, sex: string}) => {
  const color = props.sex === "m" ? "blue" : props.sex === "f" ? "red" : "grey";
  const sexIcon = props.sex === "m" ? "male" : props.sex === "f" ? "female" : "intergender";
  return (
    <Button.Group fluid={true} color={color}>
      <Button icon={sexIcon} />
      <Button color={color} basic={true} className="toilet-button">
        {props.address}
      </Button>
      <Button icon="right chevron" />
    </Button.Group>
  );
};

export default class Review extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const toiletButtons = this.props.toilets.map((toilet) => (
      <ToiletButton
        key={toilet["key"]}
        address={toilet["data"].address} 
        sex={toilet["data"].sex}
      />
    ));

    return (
      <Segment attached="bottom" className="review">
        <Link to="/app/review/addtoilet">
          <Button className="new-toilet-button" color="yellow">
            Add New Toilet
          </Button>
        </Link>
        {toiletButtons}
      </Segment>
    );
  }
}