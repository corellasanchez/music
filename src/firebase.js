import { firebase } from "@firebase/app";
// import "@firebase/firestore";
// import '@firebase/auth';


const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAAgoc6CyGGfc0a6DyCUqFTj0jgkJs30zw",
  authDomain: "pongalamusic-api.firebaseapp.com",
  databaseURL: "https://pongalamusic-api.firebaseio.com",
  projectId: "pongalamusic-api",
  storageBucket: "pongalamusic-api.appspot.com",
  messagingSenderId: "917512446533",
  appId: "1:917512446533:web:4697952b7a099ba622392c"
});
//firebase.firestore.setLogLevel('error'); // debug 

export const db = firebaseApp.firestore();

