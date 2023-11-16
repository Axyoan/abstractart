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
        },{ merge: true });

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
            <div style={tempStyle}>
                <Canvas width={isNewDrawing ? 500 : 600} height={500} canvasRef={canvasRef} unfinishedCanvasRef={unfinishedCanvasRef} isNewDrawing={isNewDrawing} imageUrl={imageUrl} />
            </div>
            <button onClick={uploadImage} class="btn2" >Upload image</button>
            <div style={alert}>
                <Collapse in={uploaded}>
                    <Alert variant="filled" severity='success' onClose={() => { setUploaded(false) }}>Paint uploaded successfully</Alert>
                </Collapse>
            </div>
        </>
    )
}

const tempStyle = {
}

const alert = {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%"
}
export default DrawingArea
