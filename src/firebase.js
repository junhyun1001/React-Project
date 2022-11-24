// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcwkVtzwbaPQFQkYP1SwxQs5v-kRDMdpA",
  authDomain: "react-firebase-chat-app-e341d.firebaseapp.com",
  databaseURL:
    "https://react-firebase-chat-app-e341d-default-rtdb.firebaseio.com",
  projectId: "react-firebase-chat-app-e341d",
  storageBucket: "react-firebase-chat-app-e341d.appspot.com",
  messagingSenderId: "236773376867",
  appId: "1:236773376867:web:a2486f0ec5c99e12564956",
  measurementId: "G-DTW1JTY9XG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
