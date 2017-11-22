import * as firebase from "firebase";
// Initialize Firebase
const config = {
  apiKey: "AIzaSyDyirGlSYkBHxlZHeTT9MPgMy9zi5bUTtw",
  authDomain: "inlieu-toilet-finder.firebaseapp.com",
  databaseURL: "https://inlieu-toilet-finder.firebaseio.com",
  projectId: "inlieu-toilet-finder",
  storageBucket: "",
  messagingSenderId: "107675485804"
};
firebase.initializeApp(config);

export default firebase;