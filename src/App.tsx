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

const FBLogin = () => {
  return <Login fdb={database} />;
}

const FBFind = (toilets: Object[], lat: number, lng: number) => {
  return (
    <Find 
      fdb={database}
      toilets={toilets}
      lat={lat}
      lng={lng}
    />);
};

const FBReview = (toilets: Object[], lat: number, lng: number, user: UserInfo) => {
  return (
    <Review
      fdb={database}
      toilets={toilets}
      userInfo={user}
      lat={lat}
      lng={lng}
      msgHead=""
      msgBody=""
    />
  );
};

const FBReviewMessage = (toilets: Object[], lat: number, lng: number, msgHead: string, msgBody: string, user: UserInfo) => {
  return (
    <Review
      fdb={database}
      toilets={toilets}
      userInfo={user}
      lat={lat}
      lng={lng}
      msgHead={msgHead}
      msgBody={msgBody}
    />
  )
}

const FBAddToilet = (lat: number, lng: number) => {
  return (
    <AddToilet
      fdb={database}
      lat={lat}
      lng={lng}
    />
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
  lat: number;
  lng: number;
  user?: firebase.User;
  userInfo: UserInfo;
}
interface UserInfo {
  showMale: boolean;
  showFemale: boolean;
  showUnisex: boolean;
  privilege: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIcon: "find",
      toilets: [],
      lat:-27.5016713,
      lng:153.0077424,
      user:undefined,
      userInfo: {
        showMale: true,
        showFemale: true,
        showUnisex: true,
        privilege: "basic"
      }
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
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      this.setState({user: user})
      database.ref("users").child(user.uid).once('value', (userRef) => {
        if (userRef) {
          let thisUser:UserInfo = userRef.val();
          this.setState({userInfo: {
            showMale: thisUser.showMale,
            showFemale: thisUser.showFemale,
            showUnisex: thisUser.showUnisex,
            privilege: thisUser.privilege
          }})
        }
      })
    })
    this.findAndSetLocation();
  }

  findAndSetLocation() {
    // Get user coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log("got the coords");
        console.log( pos.coords.latitude + ", " + pos.coords.longitude );

        this.setState({lat: pos.coords.latitude, lng: pos.coords.longitude});
      }, (error) => {
        alert("Geolocation failed.");
      });
    } else {
      alert("Geolocation not supported.");
    }
  }

  componentWillUnmount() {
    database.ref("toilets").off();
  }

  render() {
    return (
      <div id="main">
        <Route path="/app" component={MobNavBar} />
        <Route exact={true} path="/" component={FBHome} />
        <Route exact={true} path="/login" component={FBLogin} />
        <Route exact={true} path="/app/find" component={() => FBFind(this.state.toilets, this.state.lat, this.state.lng)} />
        <Route exact={true} path="/app/review" component={() => FBReview(this.state.toilets, this.state.lat, this.state.lng, this.state.userInfo)} />
        <Route exact={true} path="/app/review/added" component={() => FBReviewMessage(
          this.state.toilets, this.state.lat, this.state.lng, "Added new toilet!", "It will appear on the map once it is approved.", this.state.userInfo)} />
        <Route exact={true} path="/app/review/reviewed" component={() => FBReviewMessage(
          this.state.toilets, this.state.lat, this.state.lng, "Toilet reviewed!", "", this.state.userInfo)} />
        <Route exact={true} path="/app/review/addtoilet" component={() => FBAddToilet(this.state.lat, this.state.lng)} />
        <Route exact={true} path="/app/review/toilet/:toiletID" component={FBReviewToilet} />
      </div>
    );
  }
}

export default App;
