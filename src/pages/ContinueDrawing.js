import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import DrawingArea from '../components/DrawingArea';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase-config'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ContinueDrawing = () => {
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState(null)
    const auth = getAuth()
    const [isUserSignedIn, setIsUserSignedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    onAuthStateChanged(auth, (u) => {
        setIsUserSignedIn(u != null)
    })

    useEffect(() => {
        setIsLoading(true)
        if (!isUserSignedIn) {
            console.log("user not signed in")
            setIsLoading(false)
            return
        }
        const docRef = doc(db, "unfinishedDrawings", id);

        const fetchData = async () => {
            const newDocSnap = await getDoc(docRef)
            if (newDocSnap.exists()) {
                const storage = getStorage();
                const imageUrlToDownload = 'newDrawings/' + newDocSnap.data().drawingId + '.jpg'
                getDownloadURL(ref(storage, imageUrlToDownload))
                    .then((url) => {
                        setImageUrl(url)
                        setIsLoading(false)
                    })
                    .catch((error) => {
                        console.log(error)
                    });
                console.log("retrieved document successfully")
            } else {
                console.log("No such document!");
            }
        };
        fetchData();

    }, [id, isUserSignedIn])

    return (
        <>
         <div class="photoA"></div>

            {isLoading ?
                <>Loading</>
                :
                (isUserSignedIn ?
                    <DrawingArea isNewDrawing={false} imageUrl={imageUrl} imageId={id} />
                    :
                    <div>Log in to draw!</div>
                )
            }

        </>
    )
}

export default ContinueDrawing
