import React, { useRef } from 'react'
import Canvas from './Canvas'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase-config'

const DrawingArea = ({ isNewDrawing, imageUrl = null }) => {

    const canvasRef = useRef(null)
    const unfinishedCanvasRef = useRef(null)

    const saveImageId = async (id) => {
        await setDoc(doc(db, "unfinishedDrawings", id), {
            drawingId: id,
        });
    }
    const uploadImage = () => {
        const storage = getStorage();
        //const id = crypto.randomUUID()
        const id = isNewDrawing ? "2f981207-8018 - 453c - b046 - 88b52da9027a" : "2f981207-8018 - 453c - b046 - 88b52da9027b"
        canvasRef.current.toBlob(function (blob) {
            const url = (isNewDrawing ? 'newDrawings/' : 'continuedDrawings/') + id + '.jpg'
            const storageRef = ref(storage, url);
            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
        });
        if (isNewDrawing) {
            saveImageId(id)
        }
    }

    return (
        <>
            <Canvas width={isNewDrawing ? 500 : 600} height={500} canvasRef={canvasRef} unfinishedCanvasRef={unfinishedCanvasRef} isNewDrawing={isNewDrawing} imageUrl={imageUrl} />
            <button onClick={uploadImage}>Upload image</button>
        </>
    )
}

export default DrawingArea