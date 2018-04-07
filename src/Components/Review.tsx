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

interface State {
  lat: number;
  lng: number;
  mounted: boolean;
}

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
    this.state = {
      lat: 0,
      lng: 0,
      mounted: false
    }
  }

  componentDidMount() {
    //this.setState({mounted: true});
    // Using mounted in the state because of async call in componentDidMount
    navigator.geolocation.getCurrentPosition((pos) => {
      //if (this.state.mounted) {
        this.setState({lat: pos.coords.latitude, lng: pos.coords.longitude});
      //}
    });
  }

  componentWillUnmount() {
    this.setState({mounted: false});
  }

  render() {
    let nearbyToilets = [];
    let userCoords = [this.state.lat, this.state.lng];
    for (let i = 0; i < this.props.toilets.length; i++) {
      let toiletCoords = [this.props.toilets[i]["data"]["lat"], this.props.toilets[i]["data"]["lng"]];
      let hypotenuse = Math.sqrt(Math.pow(userCoords[0] - toiletCoords[0], 2) + Math.pow(userCoords[1] - toiletCoords[1], 2))
      if (hypotenuse < 0.005) {
        nearbyToilets.push(this.props.toilets[i])
      }
    }
    console.log(nearbyToilets);
    console.log(userCoords);
    console.log(this.state.lat + ", " + this.state.lng);
    const toiletButtons = nearbyToilets.map((toilet) => (
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
        {(this.state.lat !== 0 && this.state.lng !== 0) ?
        toiletButtons :
        "loading"}
      </Segment>
    );
  }
}