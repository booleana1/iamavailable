import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";

import {getFirestore} from "firebase/firestore";
import {getAuth, EmailAuthProvider} from "firebase/auth";

const firebaseConfig={
  apiKey: "AIzaSyCRoUSNV5X5FpcDzdFSvIx_JZFlHQYYoJM",
  authDomain: "iamavailableappdm24252g43.firebaseapp.com",
  projectId: "iamavailableappdm24252g43",
  storageBucket: "iamavailableappdm24252g43.firebasestorage.app",
  messagingSenderId: "614990932567",
  appId: "1:614990932567:web:b828927d0f61cfe84ed112",
  measurementId: "G-RE6PL9G7LN"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();