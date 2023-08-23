import React, { useState } from 'react'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'

const LogIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const login = () => {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("logged in")
            console.log(user)
            // ...
        })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });
    }

    return (
        <>
            <h2>
                <input placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
            </h2>
            <h3>
                <input placeholder='password' type='password' onChange={(e) => { setPassword(e.target.value) }} />
            </h3>
            <button onClick={login}>login</button>
        </>
    )
}

export default LogIn