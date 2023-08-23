import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import DrawingArea from '../components/DrawingArea';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase-config'
import { getStorage, ref, getDownloadURL } from "firebase/storage";



const ContinueDrawing = () => {
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        const docRef = doc(db, "unfinishedDrawings", "2f981207-8018 - 453c - b046 - 88b52da9027a");

        const fetchData = async () => {
            const newDocSnap = await getDoc(docRef)
            if (newDocSnap.exists()) {
                const storage = getStorage();
                const imageUrlToDownload = 'newDrawings/' + newDocSnap.data().drawingId + '.jpg'
                getDownloadURL(ref(storage, imageUrlToDownload))
                    .then((url) => {
                        setImageUrl(url)
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
        console.log()

    }, [])

    return (
        <>
            <DrawingArea isNewDrawing={false} imageUrl={imageUrl}/>
        </>
    )
}

export default ContinueDrawing