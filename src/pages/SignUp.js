import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from "react-router-dom"
import { auth } from '../firebase-config';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./loginform.css"
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase-config'

const provider = new GoogleAuthProvider();

export const SignUp = () => {

  const createUsername = async (userId) => {
    const docRef = doc(db, "extraUserData", userId)
    const query = await getDoc(doc(db, "extraUserData", userId))
    if (!query.exists() || !query.hasOwnProperty("username")) {
      await setDoc(docRef, {
      username: "Anonymous"
  },{ merge: true });
  }
    

}
  const navigate = useNavigate();
  const [badParameters, setBadParameters] = useState(false);

  const googleLogIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        createUsername(auth.currentUser.uid);
        navigate("/Home")
      }).catch((error) => {
        setBadParameters(true);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Error signing in!\n" +
          "Code: " + errorCode + "\n" +
          "Message: " + errorMessage + "\n" +
          "email: " + email + "\n" +
          "credential: " + credential + "\n"
        )
      });
  }

  return (
    <>
      <div>
        <div class="photoA"></div>

        <button onClick={googleLogIn} class="btnLg">Login with Google</button>

        <Collapse in={badParameters}>
          <Alert variant="filled" severity='error' onClose={() => { setBadParameters(false) }}>Something went wrong, verify your data and try again.</Alert>
        </Collapse>

      </div>

    </>
  )
}

