/*global google*/
import * as React from "react";
import * as firebase from "firebase";
import { withProps, compose } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Segment, Input, Button, Loader } from "semantic-ui-react";

import fbi from "../FirebaseInstance";

interface Props {
  fdb: firebase.database.Database;
  toilets: Object[];
}

interface State {
  lat: number;
  lng: number;
  markers: JSX.Element[];
}

interface ToiletMarker {
  lat: number;
  lng: number;
  approved: boolean;
}

const SMapComponent = "Hello";

const LoadingMap = () => 
  (
    <div className="ninety-flexbox">
      <Loader active={true} inline="centered" />
    </div>
  );

export default class Find extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      markers: this.props.toilets.map((toilet) => 
        <Marker key={toilet["key"]} position={{ lat: toilet["data"]["lat"], lng: toilet["data"]["lng"] }} />)
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({lat: pos.coords.latitude, lng: pos.coords.longitude});
    });
  }

  MapComponent = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry," +
      "drawing,places&key=AIzaSyDaSKRHqKVoX30QjzSHFRYupe92K_NpJpk",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `90vh` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) => (
    <GoogleMap
      defaultZoom={15} // Or 16. The larger the number, the more zoomed in
      defaultCenter={{ lat: this.state.lat, lng: this.state.lng }}
    >
      {this.state.markers}
    </GoogleMap>
  ));

  render() {
    return (
      <Segment attached="bottom" className="find">
        <div className="map">
          {/* If the state hasn't been set yet, render the loading map */}
          {(this.state.lat !== 0 && this.state.lng !== 0 && this.state.markers.length !== 0) ?
            <this.MapComponent/> :
            <LoadingMap />}
        </div>
      </Segment>
    );
  }
}