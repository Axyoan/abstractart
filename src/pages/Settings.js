
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
            },{merge: true})
        }
        changeUsername()
        navigate("/Home/1")
        
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
            <div style={settingsStyle}>
                <div style={usernameStyle}><p style={lavelStyle}>Username: </p><input value={username} onChange={(e) => { setUsername(e.target.value) }} /></div>
            </div>
            <button onClick={upload}>Upload</button>
        </>
    )
}

const settingsStyle = { 
    margin : "50px"
}

const usernameStyle = {
    fontSize : "40px",
    fontWeight : "400"
}

const lavelStyle = {
    fontSize : "40px",
    fontWeight : "600",
    margin : "30px",
    WebkitTextStrokeWidth : "1.5px",
    WebkitTextStrokeColor : "#50218B"
}

export default Settings