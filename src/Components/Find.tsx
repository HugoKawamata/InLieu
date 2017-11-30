import * as React from "react";
import * as firebase from "firebase";
import { withProps, compose } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Segment, Input, Button } from "semantic-ui-react";

import fbi from "../FirebaseInstance";

interface Props {
  fdb: firebase.database.Database;
}

interface State {
  lat: number;
  lng: number;
  markers: JSX.Element[]
}

interface ToiletMarker {
  lat: number;
  lng: number;
  approved: boolean;
}

const SMapComponent = "Hello";

export default class Find extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      markers: [],
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({lat: pos.coords.latitude, lng: pos.coords.longitude});
    });
    // None of this works
    
    this.props.fdb.ref("markers").on('value', (markersRef) => {
      let newMarkers = [];
      if (markersRef) {
        let markers = markersRef.val();
        for (let key in markers) {
          if (markers.hasOwnProperty(key)) {
            let value = markers[key];
            if (value.approved === 1) {
              newMarkers.push(<Marker key={key} position={{ lat: value.lat, lng: value.lng }} />);
            } else {
              console.log("marker " + key + "is not approved")
            }
          } else {
            console.log("marker " + key + " was not present in actual db.")
          }
        }
      }
      this.setState({markers: newMarkers});
    })
    
  }

  componentWillUnmount() {
    this.props.fdb.ref("markers").off();
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
    //alert(this.state.markers);
    return (
      <Segment attached="bottom" className="map">
        <div className="map">
          {(this.state.lat !== 0 && this.state.lng !== 0 && this.state.markers.length !== 0) ? <this.MapComponent/> : <div className="placeholder-map" />}
        </div>
      </Segment>
    );
  }
}