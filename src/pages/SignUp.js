import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

import { auth } from '../firebase-config';
import "./loginform.css"



export const SignUp = () => {


  //prueba de inicio sesion


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

    } catch (error) {
      console.error(error)
    }
  }
  const login = async () => {
    try {
      // const user = await createUserWithEmailAndPassword(auth, email, password);
      const user = await signInWithEmailAndPassword(auth, email, password)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div>
        <div class="photoA"></div>

        <h1>Sign Up</h1>
        <h2>
          <input placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
        </h2>
        <h3>
          <input placeholder='password' type='password' onChange={(e) => { setPassword(e.target.value) }} />
        </h3>


        <button onClick={register} class = "btnLg">Create user</button>

        <button onClick={login}class = "btnLg">Login</button>




      </div>

    </>
  )
}

