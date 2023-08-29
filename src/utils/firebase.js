import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyDJzNAhLPJPsVA-FytAbwTF1nL2FI9BUl0",
  authDomain: "goodlife-7c050.firebaseapp.com",
  projectId: "goodlife-7c050",
  storageBucket: "goodlife-7c050.appspot.com",
  messagingSenderId: "563516857950",
  appId: "1:563516857950:web:dbf75dbc32e5984b7a1ecf",
  measurementId: "G-CLWQMJGYQJ"
};

firebase.initializeApp(firebaseConfig);

export default firebase;