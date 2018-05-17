import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyBftqVinU3Rcx3mthFYzYJF_gLARingsxM",
    authDomain: "giphy-games.firebaseapp.com",
    databaseURL: "https://giphy-games.firebaseio.com",
});

const base = Rebase.createClass(firebaseApp.database());

// This is a named export
export { firebaseApp };

// this is a default export
export default base;
