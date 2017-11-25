import * as React from "react";
import * as firebase from "firebase";
import { withProps, compose } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Segment, Input, Button } from "semantic-ui-react";

interface Props {

}
interface State {

}

const MapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry," +
    "drawing,places&key=AIzaSyDaSKRHqKVoX30QjzSHFRYupe92K_NpJpk",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
  defaultZoom={8}
  defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >

  {true && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
  </GoogleMap>
));

const SMapComponent = "Hello";

export default class Find extends React.Component<Props, State> {
  render() {
    return (
      <Segment attached="bottom">
        <div className="map">
          yeet
          {<MapComponent/>}
        </div>
      </Segment>
    );
  }
}