import React, { useEffect, useRef } from 'react'
import Canvas from './Canvas'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase-config'

const DrawingArea = ({ isNewDrawing, imageUrl = null, imageId = null }) => {

    const canvasRef = useRef(null)
    const unfinishedCanvasRef = useRef(null)

    const saveImageId = async (id) => {
        await setDoc(doc(db, "unfinishedDrawings", id), {
            drawingId: id,
        });
    }

    const associateImagesInDB = async (secondId) => {
        await setDoc(doc(db, "completedDrawingsIds", imageId + secondId), {
            firstId: imageId,
            secondId: secondId
        });

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
        if (isNewDrawing) {
            saveImageId(id)
        }
        else {
            associateImagesInDB(id)
        }
    }
    useEffect(() => {
    }, [imageUrl])

    return (
        <>
            <Canvas width={isNewDrawing ? 500 : 600} height={500} canvasRef={canvasRef} unfinishedCanvasRef={unfinishedCanvasRef} isNewDrawing={isNewDrawing} imageUrl={imageUrl} />
            <button onClick={uploadImage}>Upload image</button>
        </>
    )
}

export default DrawingArea