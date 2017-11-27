import * as React from "react";
import * as firebase from "firebase";
import { withProps, compose } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Segment, Input, Button } from "semantic-ui-react";

interface Props {

}
interface State {
  lat: number;
  lng: number;
}


const SMapComponent = "Hello";

export default class Find extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({lat: pos.coords.latitude, lng: pos.coords.longitude});
    })
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
      <Marker position={{ lat: -34.397, lng: 150.644 }} />
    </GoogleMap>
  ));

  render() {
    return (
      <Segment attached="bottom" className="map">
        <div className="map">
          {(this.state.lat !== 0 && this.state.lng !== 0) ? <this.MapComponent/> : <div className="placeholder-map" />}
        </div>
      </Segment>
    );
  }
}