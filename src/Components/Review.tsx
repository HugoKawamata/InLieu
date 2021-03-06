/*global google*/
import * as React from "react";
import { Link } from "react-router-dom";
import * as firebase from "firebase";
import { Segment, Input, Button, Icon, Rating, Loader, Message } from "semantic-ui-react";
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";

interface Props {
  fdb: firebase.database.Database;
  toilets: Object[];
  lat: number;
  lng: number;
  msgHead: string;
  msgBody: string;
  userInfo: UserInfo;
}

interface UserInfo {
  showMale: boolean;
  showFemale: boolean;
  showUnisex: boolean;
  privilege: string;
}

interface State {
  lat: number;
  lng: number;
  mounted: boolean;
  nearbyToilets: Object[];
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

const LoadingToilets = () => 
  (
    <div className="ninety-flexbox">
      <Loader active={true} inline="centered" />
    </div>
  );

export default class Review extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      mounted: false,
      nearbyToilets: []
    }
  }

  compare(a: object, b: object) {
    if (a["distance"] < b["distance"]) {
      return -1;
    } else if (a["distance"] > b["distance"]) {
      return 1;
    } else {
      return 0;
    }
  }

  render() {
    let nearbyToilets = [];
    let userCoords = [this.props.lat, this.props.lng];
    for (let i = 0; i < this.props.toilets.length; i++) {
      let toiletCoords = [this.props.toilets[i]["data"]["lat"], this.props.toilets[i]["data"]["lng"]];
      let hypotenuse = Math.sqrt(Math.pow(userCoords[0] - toiletCoords[0], 2) + Math.pow(userCoords[1] - toiletCoords[1], 2))
      if (hypotenuse < 0.01) {
        let toiletWithDistance = this.props.toilets[i];
        toiletWithDistance["distance"] = hypotenuse;
        nearbyToilets.push(this.props.toilets[i])
      } else {
        console.log("nahh too far away fuck you. toilet: " + this.props.toilets[i]["data"]["address"]);
      }
    }

    // Sort nearbyToilets by proximity
    nearbyToilets.sort(this.compare)

    const toiletButtons = nearbyToilets.map((toilet) => {
      if (
        (toilet["data"].sex === "m" && this.props.userInfo.showMale) ||
        (toilet["data"].sex === "f" && this.props.userInfo.showFemale) ||
        (toilet["data"].sex === "u" && this.props.userInfo.showUnisex)
      ) { // Show it
        return (
          <ToiletButton
            key={toilet["key"]}
            address={toilet["data"].address} 
            sex={toilet["data"].sex}
            id={toilet["key"]}
            aesthetic={toilet["data"]["criteria"]["aesthetic"]["rating"]}
            cleanliness={toilet["data"]["criteria"]["cleanliness"]["rating"]}
            quietness={toilet["data"]["criteria"]["quietness"]["rating"]}
          />
        );
      } else {
        return "";
      }
    });

    const messageBody = this.props.msgBody !== "" ? (
      <p>{this.props.msgBody}</p>
    ) : ""

    const message = this.props.msgHead !== "" ? (
      <Message positive={true}>
        <Message.Header>
          {this.props.msgHead}
        </Message.Header>
        {messageBody}
      </Message>
    ) : ""

    return (
      <Segment attached="bottom" className="review">
        {message}
        {(this.props.lat !== 0 && this.props.lng !== 0) ? 
          <div>
            {toiletButtons}
            { firebase.auth().currentUser != null ? (
              <Link to="/app/review/addtoilet">
                <Button className="new-toilet-button">
                  Add New Toilet
                </Button>
              </Link>
            ) : ""}
          </div> :
          <LoadingToilets />
        }
      </Segment>
    );
  }
}