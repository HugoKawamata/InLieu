/*global google*/
import * as React from "react";
import * as firebase from "firebase";
import { withProps, compose } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps";
import { Segment, Input, Button, Loader } from "semantic-ui-react";
import { Redirect } from "react-router-dom";

import fbi from "../FirebaseInstance";

interface Props {
  fdb: firebase.database.Database;
  toilets: Object[];
  lat: number;
  lng: number;
}

interface State {
  lat: number;
  lng: number;
  markers: JSX.Element[];
  markerClicked: string;
  // I'm aware this is an anti-pattern
  mounted: boolean;
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
      mounted: false,
      markerClicked: "",
      markers: this.props.toilets.map((toilet) => 
        <Marker key={toilet["key"]}
                position={{ lat: toilet["data"]["lat"], lng: toilet["data"]["lng"] }}
                clickable={true}
                onClick={() => this.clickMarker(toilet["key"])} />)
    };
  }

  clickMarker(toiletKey: string) {
    this.setState({markerClicked: toiletKey});
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
      defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
      center={{ lat: this.props.lat, lng: this.props.lng }}
    >
      {this.state.markers}
      {/* User position. It's not rendering the correct icon atm, so this feature is on hold for a sec
      <Marker position={{ lat: this.props.lat, lng: this.props.lng }}
              //icon="https://github.com/HugoKawamata/InLieu/blob/master/public/googleUserlocationIcon.png"
              //icon="https://lh4.googleusercontent.com/-ywzFYtSAbqQ/AAAAAAAAAAI/AAAAAAAADNg/YX7JdEcU81I/photo.jpg?sz=64"
      />*/}
    </GoogleMap>
  ));

  render() {
    alert("lat: " + this.state.lat + "lng: " + this.state.lng);
    if (this.state.markerClicked !== "") {
      return <Redirect to={"/app/review/toilet/"+this.state.markerClicked} />
    }
    return (
      <Segment attached="bottom" className="find">
        <div className="map">
          {/* If the state hasn't been set yet, render the loading map */}
          {(this.props.lat !== 0 && this.props.lng !== 0 && this.state.markers.length !== 0) ?
            <this.MapComponent/> :
            <LoadingMap />}
        </div>
      </Segment>
    );
  }
}