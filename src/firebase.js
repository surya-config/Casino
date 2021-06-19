import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD95nkbyxSq6po1At-HTRC72e9183Yb00U",
  authDomain: "casino-3258b.firebaseapp.com",
  projectId: "casino-3258b",
  storageBucket: "casino-3258b.appspot.com",
  messagingSenderId: "681877410089",
  appId: "1:681877410089:web:d9d579bfa577cf81b56738",
  measurementId: "G-8GCM7XFV3F",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
