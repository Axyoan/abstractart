import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from '../firebase-config';

export const SignUp = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div>Sign Up</div>
      <input placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
      <input placeholder='password' type='password' onChange={(e) => { setPassword(e.target.value) }} />
      <button onClick={register}>Create user</button>
    </>
  )
}
