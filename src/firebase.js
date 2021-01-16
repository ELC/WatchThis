import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import "firebase/analytics";
 
const config = {
    apiKey: "AIzaSyCUHUVtEypKwat6A_ue7k5kR3AdGRvT_oc",
    authDomain: "watchthis-a7537.firebaseapp.com",
    databaseURL: "https://watchthis-a7537-default-rtdb.firebaseio.com",
    projectId: "watchthis-a7537",
    storageBucket: "watchthis-a7537.appspot.com",
    messagingSenderId: "50943613885",
    appId: "1:50943613885:web:345603d0d5d0242ec1d0d4",
    measurementId: "G-FE6PHQBWNV"
  };
 
firebase.initializeApp(config);
firebase.auth().signInAnonymously();
firebase.analytics();

export const db = firebase.database();
export const analytics = firebase.analytics();