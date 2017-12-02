import * as React from "react";
import * as firebase from "firebase";
import { Segment, Input, Button, Form, Rating } from "semantic-ui-react";

interface Props {
  fdb: firebase.database.Database;
}

interface State {
  accessible: number;
  useGeolocation: number;
  address: string;
  aestheticRating: number;
  busynessRating: number;
  cleanlinessRating: number;
  sex: string;
  numStalls: number;
  paperTowels: number;
}

export default class AddToilet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      accessible: -1,
      useGeolocation: -1,
      address: "",
      aestheticRating: -1,
      busynessRating: -1,
      cleanlinessRating: -1,
      sex: "",
      numStalls: 1,
      paperTowels: -1
    }
  }

  async function submitToilet() {
    ///////////////////////
    // TODO: Verify form //
    ///////////////////////

    let lat, lng;

    if (this.state.useGeolocation === 1) {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        console.log(lat);
      });
    }

    /*
    this.props.fdb.ref("toilets").set({
      accessible: this.state.accessible,
      address: address,
      approved: 0,
      criteria: {
        aesthetic: {
          numReviews: 1,
          rating: this.state.aestheticRating
        },
        busynessRating: {
          numReviews: 1,
          rating: this.state.busynessRating
        },
        cleanlinessRating: {
          numReviews: 1,
          rating: this.state.cleanlinessRating,
        }
      },
      lat: lat,
      lng: lng,
      numStalls: this.state.numStalls,
      paperTowels: this.state.paperTowels,
      sex: this.state.sex,
    });
    */
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>, { name, value }: any) => {
    let obj = {};
    obj[name] = value;
    this.setState(obj);
  }

  // Semantic Ratings have no name, so use a className instead to uniquely ID inputs
  handleRate = (e: React.MouseEvent<HTMLDivElement>, { className, rating }:any) => {
    let obj = {};
    obj[className] = rating;
    this.setState(obj);
  }

  render() {
    const addressInput = this.state.useGeolocation === 0 ?
      (<Form.Input
        label="Address of Toilet"
        name="address"
        value={this.state.address}
        onChange={this.handleChange}
      />) :
      <div/>

    const stallOptions = [
      {text: 0, value: 0},
      {text: 1, value: 1},
      {text: 2, value: 2},
      {text: 3, value: 3},
      {text: 4, value: 4},
      {text: "5+", value: 5},
    ]

    return(
      <Segment attached="bottom" className="add-toilet">
        <Form>
          <Form.Group inline={true}>
            <label>Use my geolocation to get the toilet's address:</label>
            <Form.Radio 
              label="yes" 
              name="useGeolocation"
              value={1} 
              checked={this.state.useGeolocation === 1} 
              onChange={this.handleChange}
            />
            <Form.Radio
              label="no" 
              name="atToiletLocation"
              value={0} 
              checked={this.state.useGeolocation === 0} 
              onChange={this.handleChange}
            />
          </Form.Group>
          {addressInput}
          <Form.Group inline={true}>
            <label>Aesthetic: </label>
            <Rating
              icon="star"
              className="aestheticRating"
              maxRating={5}
              onRate={this.handleRate}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Cleanliness: </label>
            <Rating
              icon="star"
              className="cleanlinessRating"
              maxRating={5}
              onRate={this.handleRate}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Busyness: </label>
            <Rating
              icon="star"
              className="busynessRating"
              maxRating={5}
              onRate={this.handleRate}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Toilet is wheelchair accessible:</label>
            <Form.Radio 
              label="yes" 
              name="accessible"
              value={1} 
              checked={this.state.accessible === 1} 
              onChange={this.handleChange}
            />
            <Form.Radio
              label="no" 
              name="accessible"
              value={0} 
              checked={this.state.accessible === 0} 
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Sex:</label>
            <Form.Radio 
              label="male" 
              name="sex"
              value={"m"} 
              checked={this.state.sex === "m"} 
              onChange={this.handleChange}
            />
            <Form.Radio
              label="female" 
              name="sex"
              value={"f"} 
              checked={this.state.sex === "f"} 
              onChange={this.handleChange}
            />
            <Form.Radio
              label="unisex" 
              name="sex"
              value={"u"} 
              checked={this.state.sex === "u"} 
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Paper towels:</label>
            <Form.Radio 
              label="yes" 
              name="paperTowels"
              value={1} 
              checked={this.state.paperTowels === 1} 
              onChange={this.handleChange}
            />
            <Form.Radio
              label="no" 
              name="paperTowels"
              value={0} 
              checked={this.state.paperTowels === 0} 
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Number of Stalls:</label>
            <Form.Dropdown
              placeholder="Please select"
              inline={true}
              name="numStalls"
              value={this.state.numStalls}
              options={stallOptions}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Button
            onClick={this.submitToilet}
          >
            Submit
          </Form.Button>
        </Form>
      </Segment>
    )
  }
}