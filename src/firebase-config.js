
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1sF-HSXOKw-mIV-Lx0q9ajdG3u6igmXg",
    authDomain: "abstractart-25836.firebaseapp.com",
    projectId: "abstractart-25836",
    storageBucket: "abstractart-25836.appspot.com",
    messagingSenderId: "1040675957448",
    appId: "1:1040675957448:web:f3901ae57fedfc3dee93fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app)