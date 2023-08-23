import React, { useState } from 'react'
import DrawingArea from '../components/DrawingArea'
import { getAuth, onAuthStateChanged } from "firebase/auth";


const StartDrawing = () => {
    const auth = getAuth()
    const [isUserSignedIn, setIsUserSignedIn] = useState(false)

    onAuthStateChanged(auth, (u) => {
        setIsUserSignedIn(u != null)
    })

    return (
        <>
            <button onClick={() => auth.signOut()} />
            {console.log("wat",)}
            {isUserSignedIn ?
                <DrawingArea isNewDrawing={true} />
                :
                <div>Log in to draw!</div>}
        </>
    )
}

export default StartDrawing