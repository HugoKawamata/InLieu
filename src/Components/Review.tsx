/*global google*/
import * as React from "react";
import { Link } from "react-router-dom";
import * as firebase from "firebase";
import { Segment, Input, Button, Icon, Rating } from "semantic-ui-react";
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";

interface Props {
  fdb: firebase.database.Database;
  toilets: Object[];
}

interface State {}

const ToiletButton = (props: {id: string, address: string, sex: string, aesthetic: number, cleanliness: number, quietness: number}) => {
  const color = props.sex === "m" ? "blue" : props.sex === "f" ? "red" : "grey";
  const sexIcon = props.sex === "m" ? "male" : props.sex === "f" ? "female" : "intergender";
  return (
    <Link to={"/app/review/toilet/" + props.id}>
      <Button.Group fluid={true} color={color} className="toilet-button-container">
        <Button icon={sexIcon} className="toilet-button-bumper" />
        <Button color={color} basic={true} className="toilet-button">
          <div className="address">
            {props.address}
          </div>
          <div>
            <Icon name="unhide" />
            <Rating rating={props.aesthetic + 0.5} maxRating={5} disabled={true}/>
          </div>
          <div>
            <Icon name="diamond" />
            <Rating rating={props.cleanliness + 0.5} maxRating={5} disabled={true}/>
          </div>
          <div>
            <Icon name="spy" />
            <Rating rating={props.quietness + 0.5} maxRating={5} disabled={true}/>
          </div>
        </Button>
        <Button icon="right chevron" className="toilet-button-bumper" />
      </Button.Group>
    </Link>

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
        id={toilet["key"]}
        aesthetic={toilet["data"]["criteria"]["aesthetic"]["rating"]}
        cleanliness={toilet["data"]["criteria"]["cleanliness"]["rating"]}
        quietness={toilet["data"]["criteria"]["quietness"]["rating"]}
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