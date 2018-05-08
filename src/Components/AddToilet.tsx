/*global google*/
import * as React from "react";
import { Redirect } from "react-router";
import * as firebase from "firebase";
import { Segment, Input, Button, Form, Rating, Message } from "semantic-ui-react";
import withScriptjs from "react-google-maps/lib/withScriptjs";
const { compose, withProps, lifecycle } = require("recompose");
const { withScriptJS } = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

interface Props {
  fdb: firebase.database.Database;
  lat: number;
  lng: number;
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
  multistorey: number;
  floor: number;
  description: string;
  failedSubmission: boolean;
}

// Rather than booleans, many states are numbers to represent 3 options:
// -1 : Unset
//  0 : False
//  1 : True
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
      submitted: false,
      multistorey: -1,
      floor: 1,
      description: "",
      failedSubmission: false
    };

    this.submitToilet = this.submitToilet.bind(this);
  }

  // Add "number of reviews" to toilet data
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
          rating: this.state.aestheticRating
        },
        quietness: {
          rating: this.state.quietnessRating
        },
        cleanliness: {
          rating: this.state.cleanlinessRating,
        }
      },
      lat: lat,
      lng: lng,
      numStalls: this.state.numStalls,
      paperTowels: this.state.paperTowels,
      sex: this.state.sex,
      multistorey: this.state.multistorey,
      floor: this.state.floor,
      description: this.state.description,
      numberOfReviews: 1
    };
    this.props.fdb.ref("toilets").push().set(data);
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
      });
    });
  }

  // Gets the address from a given set of coordinates and pushes the current state as a new toilet
  getAddressFromLatLng = (lat: number, lng: number) => {
    // Get the address of the current location using a fetch
    const self = this;
    const address = fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true",
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
          json.results[0].address_components[2].short_name + ", " +
          json.results[0].address_components[3].short_name;
        self.pushToiletData(lat, lng, address);
      });
    });
  }

  // Gets the latlng from th user's geolocation and calls getAddressFromLatLng using the retrieved coords
  getLatLngFromLocation() {
    // Get the current location
    console.log("New toilet comin' up");
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      console.log("New toilet:" + lat + ", " + lng);
      this.getAddressFromLatLng(lat, lng);
    }, (error) => {console.log(error)}, {maximumAge: 180000});
  }
  

  formIsValid = () => {
    return !(
      this.state.aestheticRating === -1 ||
      this.state.cleanlinessRating === -1 ||
      this.state.quietnessRating === -1 ||
      this.state.accessible === -1 ||
      this.state.sex === "" ||
      this.state.paperTowels === -1 ||
      this.state.multistorey === -1 ||
      this.state.useGeolocation === -1 ||
      (this.state.useGeolocation === 0 && this.state.address === "")
    );
  }

  async submitToilet() {
    
    if (
      !this.formIsValid()
    ) {
      this.setState({failedSubmission: true});
      return;
    } else {
      this.setState({failedSubmission: false, loading: false});
    }

    // Up to here
    this.setState({loading: true});

    if (this.state.useGeolocation === 1) {
      await this.getLatLngFromLocation();
    } else if (this.state.useGeolocation === 0) {
      await this.getLatLngFromAddress(this.state.address);
    }
    this.setState({submitted: true});
  }

  handleChange = (e: React.FormEvent<HTMLInputElement>, { name, value }: any) => {
    let obj = {};
    obj[name] = value;
    this.setState(obj);
  }

  // Semantic Ratings have no name, so use a className instead to uniquely ID inputs
  handleRate = (e: React.MouseEvent<HTMLDivElement>, { className, rating }: any) => {
    let obj = {};
    obj[className] = rating;
    this.setState(obj);
  }

  // This comes from the documentation of react-google-maps
  // https://tomchentw.github.io/react-google-maps/#standalonesearchbox
  SearchBoxComponent = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry," +
      "drawing,places&key=AIzaSyDaSKRHqKVoX30QjzSHFRYupe92K_NpJpk",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
    }),
    lifecycle({
      // Dodgy hacks happening here due to the react-google-maps documentation not working nicely with typescript
      componentWillMount() {
        let searchBoxRef: any;

        this.setState({
          places: [],
          onSearchBoxMounted: (ref: any) => {
            searchBoxRef = ref;
          },
          onPlacesChanged: () => {
            const places = searchBoxRef.getPlaces();
            this.setState({ places });
          }
        });
      }
    }),
    withScriptjs
  )((props: any) => {
    // Smelly code: additional effects in a render function are an anti-pattern
    // Should be refactored out to componentWillMount.
    if (props.places.length !== 0) {
      this.setState({
        address: props.places[0].address_components[0].short_name + " " +
                props.places[0].address_components[1].short_name + ", " +
                props.places[0].address_components[2].short_name + ", " +
                props.places[0].address_components[3].short_name, 
      });
    }

    return (
      <div data-standalone-searchbox="">
        <StandaloneSearchBox
          ref={props.onSearchBoxMounted}
          bounds={props.bounds}
          onPlacesChanged={props.onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Enter Toilet Address"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              marginBottom: `1em`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </StandaloneSearchBox>
      </div>
    ); }
  );

  render() {
    const addressInput = this.state.useGeolocation === 0 ?
      // Then
      <this.SearchBoxComponent/> :
      // Else
      <div/>;

    const floorInput = this.state.multistorey === 1 ?
      // Then
      (
        <Form.Input
          label="Floor Number"
          name="floor"
          value={this.state.floor}
          onChange={this.handleChange}
        />
      ) :
      // Else
      <div/>;

    const validationMsg = this.state.failedSubmission ?
      // Then
      (
        <Message 
          negative={!this.formIsValid()}
          positive={this.formIsValid()}
        >
          <Message.Header>
            {this.formIsValid() ? 
            "Nice!":
            "Please fill out the required fields"}
          </Message.Header>
            {
              this.formIsValid() ? 
              <p>You can submit again now.</p> :
              (
                <div>
                  <p>Please ensure the following fields are filled out: </p>
                  <ul>
                    {this.state.useGeolocation === -1 ? <li>Use Geolocation</li> : ""}
                    {this.state.useGeolocation === 0 ? <li>Address</li> : ""}
                    {this.state.aestheticRating === -1 ? <li>Aesthetic rating</li> : ""}
                    {this.state.cleanlinessRating === -1 ? <li>Cleanliness rating</li> : ""}
                    {this.state.quietnessRating === -1 ? <li>Quietness rating</li> : ""}
                    {this.state.accessible === -1 ? <li>Wheelchair accessibility</li> : ""}
                    {this.state.sex === "" ? <li>Sex</li> : ""}
                    {this.state.paperTowels === -1 ? <li>Paper towels</li> : ""}
                    {this.state.multistorey === -1 ? <li>Multistorey building</li> : ""}
                  </ul>
                </div>
              )
            }
        </Message>
      ) :
      <div/>;

    const stallOptions = [
      {text: 0, value: 0},
      {text: 1, value: 1},
      {text: 2, value: 2},
      {text: 3, value: 3},
      {text: 4, value: 4},
      {text: "5+", value: 5},
    ];
    
    if (this.state.submitted) {
      return (
        <Redirect to="/app/review/added" />
      );
    }

    return(
      <Segment attached="bottom" className="add-toilet">
        {validationMsg}
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
              value={this.state.aestheticRating}
              onRate={this.handleRate}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Cleanliness: </label>
            <Rating
              icon="star"
              className="cleanlinessRating"
              maxRating={5}
              value={this.state.cleanlinessRating}
              onRate={this.handleRate}
            />
          </Form.Group>
          <Form.Group inline={true}>
            <label>Quietness: </label>
            <Rating
              icon="star"
              className="quietnessRating"
              maxRating={5}
              value={this.state.quietnessRating}
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
            <label>Multi-storey building:</label>
            <Form.Radio
              label="yes" 
              name="multistorey"
              value={1} 
              checked={this.state.multistorey === 1} 
              onChange={this.handleChange}
            />
            <Form.Radio
              label="no" 
              name="multistorey"
              value={0} 
              checked={this.state.multistorey === 0} 
              onChange={this.handleChange}
            />
          </Form.Group>
          {floorInput}
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

          <Form.Input
            label="Description (optional)"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
          />

          <Form.Button
            className="darkButton"
            onClick={this.submitToilet}
          >
            Submit
          </Form.Button>
        </Form>
      </Segment>
    );
  }
}