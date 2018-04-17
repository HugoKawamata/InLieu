import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import "./App.css";

import firebase from "./FirebaseInstance";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Find from "./Components/Find";
import Review from "./Components/Review";
import AddToilet from "./Components/AddToilet";
import MobNavBar from "./Components/MobNavBar";
import ReviewToilet from "./Components/ReviewToilet";

let database = firebase.database();

const FBHome = () => {
  return <Home fdb={database} />;
};

const FBFind = (toilets: Object[], lat: number, lng: number) => {
  return (
    <Find 
      fdb={database}
      toilets={toilets}
      lat={lat}
      lng={lng}
    />);
};

const FBReview = (toilets: Object[], lat: number, lng: number) => {
  return (
    <Review
      fdb={database}
      toilets={toilets}
      lat={lat}
      lng={lng}
    />
  );
};

const FBAddToilet = () => {
  return (
    <AddToilet fdb={database} />
  );
};

const FBReviewToilet = () => {
  return (
    <ReviewToilet fdb={database} />
  )
}

interface Props {}
interface State {
  activeIcon: string;
  toilets: Object[];
  mounted: boolean;
  lat: number;
  lng: number;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIcon: "find",
      toilets: [],
      mounted: false,
      lat:0,
      lng:0
    };
  }

  componentDidMount() {
    document.title = "InLoo"

    // Sets state.markers to be a list of all approved markers in the entire database
    database.ref("toilets").on("value", (toiletsRef) => {
      let newToilets = [];
      if (toiletsRef) {
        let toilets = toiletsRef.val();
        for (let key in toilets) {
          if (toilets.hasOwnProperty(key)) {
            let value = toilets[key];
            if (value.approved === 1) {
              newToilets.push({key: key, data: value});
            }
          }
        }
      }
      this.setState({toilets: newToilets});
    });

    // Get user coordinates
    this.setState({mounted: true});
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        alert("Got Coordinates")
        console.log("got the coords");
        console.log( pos.coords.latitude + ", " + pos.coords.longitude );

        if (this.state.mounted) {
          this.setState({lat: pos.coords.latitude, lng: pos.coords.longitude});
        }
      }, (error) => {
        alert("Geolocation failed.");
        alert(error.message);
      });
    } else {
      alert("Geolocation not supported.");
    }
  }

  componentWillUnmount() {
    this.setState({mounted: false});
    database.ref("toilets").off();
  }

  render() {
    return (
      <div id="main">
        <Route path="/app" component={MobNavBar} />
        <Route exact={true} path="/" component={FBHome} />
        <Route exact={true} path="/login" component={Login} />
        <Route exact={true} path="/app/find" component={() => FBFind(this.state.toilets, this.state.lat, this.state.lng)} />
        <Route exact={true} path="/app/review" component={() => FBReview(this.state.toilets, this.state.lat, this.state.lng)} />
        <Route exact={true} path="/app/review/addtoilet" component={FBAddToilet} />
        <Route exact={true} path="/app/review/toilet/:toiletID" component={FBReviewToilet} />
      </div>
    );
  }
}

export default App;
