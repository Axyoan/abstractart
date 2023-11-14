
import React, {useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from '../firebase-config'
import { useNavigate } from "react-router-dom"

const Settings = () => {

    const [username, setUsername] = useState("Anonymous");
    const navigate = useNavigate();

    const upload = () => {
        console.log()
        const changeUsername = async () => {
            const docRef = doc(db, "extraUserData", auth.currentUser.uid)
            await setDoc(docRef, {
              username: username
            })
        }
        changeUsername()
        navigate("/Home")
        
    }
    const getUsername = async (userId) => {
        const query = await getDoc(doc(db, "extraUserData", userId))
        if (query.exists()) {
            setUsername(query.data().username)
        }
    }
    useEffect(() => {

        onAuthStateChanged(auth, (u) => {
            getUsername(auth.currentUser.uid)
        })
    }, [])

    return (
        <>
            <h2>
                <label>Username: </label> <input value={username} onChange={(e) => { setUsername(e.target.value) }} />
            </h2>
            <button onClick={upload}>Upload</button>
        </>
    )
}

export default Settings