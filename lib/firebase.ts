import {FirebaseApp, getApps, initializeApp} from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const clientCredentials = {
  apiKey: "AIzaSyB_VelAX2Fwtz2YE3tQUdkOUvvTP3aPpCw",
  authDomain: "andronix-techriz.firebaseapp.com",
  databaseURL: "https://andronix-techriz.firebaseio.com",
  projectId: "andronix-techriz",
  storageBucket: "andronix-techriz.appspot.com",
  messagingSenderId: "83697300023",
  appId: "1:83697300023:web:a9bbb4b9f2ee7c9e9a45b2",
  measurementId: "G-FGC8FHWTCZ"
};

let app: FirebaseApp | undefined;
if (getApps().length < 1) {
  app = initializeApp(clientCredentials);
}

export default app;
