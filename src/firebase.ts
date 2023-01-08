import firebase from "firebase/app";
import "firebase/database";

let config = {
  apiKey: "AIzaSyBhjZCJuMeQUQ5zOArt3BZR06nFAGmvlBc",
  authDomain: "recipes-showcase.firebaseapp.com",
  databaseURL: "https://recipes-showcase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "recipes-showcase",
  storageBucket: "recipes-showcase.appspot.com",
  messagingSenderId: "322832960990",
  appId: "1:322832960990:web:ba7d55f28c19325dc0a14f"
};

firebase.initializeApp(config);

export default firebase;
