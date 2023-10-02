import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import {useNavigate } from "react-router-dom"
import { auth } from '../firebase-config';
import "./loginform.css"



export const SignUp = () => {


  //prueba de inicio sesion


  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badParameters, setBadParameters] = useState(false);

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      //navigate("/Home/"+ 1)
      navigate("/Home")
    } catch (error) {
      setBadParameters(true);
      console.error(error)
    }
  }
  const login = async () => {
    try {
      // const user = await createUserWithEmailAndPassword(auth, email, password);
      const user = await signInWithEmailAndPassword(auth, email, password)
      navigate("/Home/"+ 2)
      
    } catch (error) {
      setBadParameters(true);
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

        <Collapse in={badParameters}>
          <Alert variant="filled" severity='error' onClose={() => {setBadParameters(false)}}>Something went wrong, verify your data and try again.</Alert>
        </Collapse>

      </div>

    </>
  )
}

