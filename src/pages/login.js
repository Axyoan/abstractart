import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from '../firebase-config';
import "./loginform.css"

export const Login = () => {
  
 
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

  return (
    <>
      <div>
        <h1>Login</h1>
        <h2>
        <input placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
        </h2>
        <h3>
        <input placeholder='password' type='password' onChange={(e) => { setPassword(e.target.value) }} />
        </h3>
     
        <button>inicia sesion</button>
      

     
      

      </div>
      
    </>
  )
}
