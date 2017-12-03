import * as React from "react";
import { Redirect } from "react-router";
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
  quietnessRating: number;
  cleanlinessRating: number;
  sex: string;
  numStalls: number;
  paperTowels: number;
  loading: boolean;
  submitted: boolean;
}

export default class AddToilet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      accessible: -1,
      useGeolocation: -1,
      address: "",
      aestheticRating: -1,
      quietnessRating: -1,
      cleanlinessRating: -1,
      sex: "",
      numStalls: 1,
      paperTowels: -1,
      loading: false,
      submitted: false
    }

    this.submitToilet = this.submitToilet.bind(this);
  }

  pushToiletData = (lat: number, lng: number, address: string) => {
    console.log(lat);
    console.log(lng);
    console.log(address);
    let data = {
      accessible: this.state.accessible,
      address: address,
      approved: 0,
      criteria: {
        aesthetic: {
          numReviews: 1,
          rating: this.state.aestheticRating
        },
        quietness: {
          numReviews: 1,
          rating: this.state.quietnessRating
        },
        cleanliness: {
          numReviews: 1,
          rating: this.state.cleanlinessRating,
        }
      },
      lat: lat,
      lng: lng,
      numStalls: this.state.numStalls,
      paperTowels: this.state.paperTowels,
      sex: this.state.sex,
    };
    this.props.fdb.ref("toilets").push().set(data);
    this.setState({submitted: true});
  }

  // Gets latlng from a given address and pushes the current state as a new toilet
  getLatLngFromAddress = (address: string) => {
    const self = this;

    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=AIzaSyDyirGlSYkBHxlZHeTT9MPgMy9zi5bUTtw",
        {
            method: "POST",
            credentials: "same-origin"
        }
    ).then(function(response) {
      if (response.status !== 200) {
          console.log("Error " +
          response.status);
          return;
      }

      response.json().then((json) => {
        const lat = json.results[0].geometry.location.lat;
        const lng = json.results[0].geometry.location.lng;
        self.pushToiletData(lat, lng, address);
      })
    })
  }

  // Gets the address from a given set of coordinates and pushes the current state as a new toilet
  getAddressFromLatLng = (lat: number, lng: number) => {
    // Get the address of the current location using a fetch
    const self = this;
    const address = fetch("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true",
        {
            method: "POST",
            credentials: "same-origin"
        }
    ).then(function(response) {
      if (response.status !== 200) {
          console.log("Error " +
          response.status);
          return;
      }

      response.json().then((json) => {
        const address = json.results[0].address_components[0].short_name + " " +
            json.results[0].address_components[1].short_name + ", " +
            json.results[0].address_components[2].short_name
        self.pushToiletData(lat, lng, address);
      })
    })
  }

  // Gets the latlng from th user's geolocation and calls getAddressFromLatLng using the retrieved coords
  getLatLngFromLocation = () => {
    // Get the current location
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      this.getAddressFromLatLng(lat, lng);
    });
  }

  async submitToilet() {
    this.setState({loading: true})
    
    ///////////////////////
    // TODO: Verify form //
    ///////////////////////

    if (this.state.useGeolocation === 1) {
      this.getLatLngFromLocation()
    } else if (this.state.useGeolocation === 0) {
      this.getLatLngFromAddress(this.state.address);
    }
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
    
    if (this.state.submitted) {
      return (
        <Redirect to="/app/review" />
      )
    }

    return(
      <Segment attached="bottom" className="add-toilet">
        <Form loading={this.state.loading}>
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
              name="useGeolocation"
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
            <label>Quietness: </label>
            <Rating
              icon="star"
              className="quietnessRating"
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