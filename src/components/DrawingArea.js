import React, { useEffect, useRef, useState } from 'react'
import Canvas from './Canvas'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase-config'
import { getAuth } from 'firebase/auth'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

const DrawingArea = ({ isNewDrawing, imageUrl = null, imageId = null, firstUserId = null }) => {
    const [uploaded, setUploaded] = useState(false)
    const canvasRef = useRef(null)
    const unfinishedCanvasRef = useRef(null)
    const auth = getAuth()
    const message = (isNewDrawing ? "Painting uploaded successfully " : "Painting uploaded successfully, you can go to the gallery to see it.")

    const saveImage = async (id, isNewDrawing) => {
        await setDoc(doc(db, isNewDrawing ? "unfinishedDrawings" : "completedDrawings", id), {
            drawingId: id,
            userId: auth.currentUser.uid
        });
        setUploaded(true);

    }

    const associateImagesInDB = async (secondId) => {
        await setDoc(doc(db, "associatedDrawings", imageId + secondId), {
            firstId: imageId,
            secondId: secondId,
        });

    }

    const increaseImageCounter = async (userId) => {
        const docRef = doc(db, "extraUserData", userId)
        const qry = await getDoc(doc(db, "extraUserData", userId))
        let prevCnt = 0
        if (qry.exists() && qry.data().hasOwnProperty("totalImagesDrawn")) {
            prevCnt = qry.data().totalImagesDrawn
        }
        await setDoc(docRef, {
            totalImagesDrawn: prevCnt + 1
        }, { merge: true });

    }

    const uploadImage = () => {
        const storage = getStorage();
        const id = crypto.randomUUID()
        canvasRef.current.toBlob(function (blob) {
            const url = (isNewDrawing ? 'newDrawings/' : 'continuedDrawings/') + id + '.jpg'
            const storageRef = ref(storage, url);
            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded drawing!');
            });
        });
        saveImage(id, isNewDrawing)
        if (!isNewDrawing) {
            increaseImageCounter(auth.currentUser.uid)
            increaseImageCounter(firstUserId)
            associateImagesInDB(id)
        }
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height);

    }
    useEffect(() => {
    }, [imageUrl])

    return (
        <>
            {
                isNewDrawing ?
                    <p style={instructionsStyle}>Be sure to draw something to the right of the dotted line so that the user who finishes the drawing has something to go off of!</p>
                    :
                    <p style={instructionsStyle}>To the left of the dotted line is a small piece of another drawing, complete it using your imagination!</p>
            }
            <div>
                <Canvas width={isNewDrawing ? 500 : 600} height={500} canvasRef={canvasRef} unfinishedCanvasRef={unfinishedCanvasRef} isNewDrawing={isNewDrawing} imageUrl={imageUrl} />
            </div>
            <button onClick={uploadImage} class="btn2" >Upload image</button>
            <div style={alert}>
                <Collapse in={uploaded}>{ }
                    <Alert variant="filled" severity='success' onClose={() => { setUploaded(false) }}>{message}</Alert>
                </Collapse>
            </div>
        </>
    )
}

const instructionsStyle = {
    margin: "0 20%",
    marginTop: "50px",
    fontSize: "20px",
    color: "black",
    backgroundColor: "white",
    borderRadius: "10px"
}

const alert = {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%"
}
export default DrawingArea
