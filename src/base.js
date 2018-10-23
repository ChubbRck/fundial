import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyCerFx64-9kQfnqgm21_a4czJ5el9ttqXQ",
    authDomain: "giphy-fundial.firebaseapp.com",
    databaseURL: "https://giphy-fundial.firebaseio.com",
    storageBucket: "giphy-fundial.appspot.com"
});

const base = Rebase.createClass(firebaseApp.database());

// This is a named export
export { firebaseApp };

// this is a default export
export default base;
