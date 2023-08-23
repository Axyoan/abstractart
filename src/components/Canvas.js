import React, { useEffect, useRef, useState } from 'react'
import ReactSlider from 'react-slider'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase-config'

const Canvas = ({ width, height }) => {

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const canvasContainerStyle = {
        position: "relative",
        left: "0px",
        right: "0px",
        marginLeft: "auto",
        marginRight: "auto",
        height: height,
        width: width,
        backgroundColor: "white",
        zIndex: "0"
    }

    const [isDrawing, setIsDrawing] = useState(false)

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true)

    }

    const finishDrawing = () => {
        setIsDrawing(false);
        contextRef.current.closePath();
    }

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke()
    }

    const handleClearCanvasButton = (e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    const saveImageId = async (id) => {
        await setDoc(doc(db, "unfinishedDrawings", id), {
            drawingId: id,
        });
    }


    const uploadImage = () => {
        const storage = getStorage();
        //const id = crypto.randomUUID()
        const id = "2f981207-8018 - 453c - b046 - 88b52da9027a"
        canvasRef.current.toBlob(function (blob) {
            const url = 'images/' + id + '.jpg'
            const storageRef = ref(storage, url);
            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
        });
        saveImageId(id)

    }

    useEffect(() => {
        console.log("render")
        const canvas = canvasRef.current;

        const context = canvas.getContext("2d")
        context.lineCap = "round"
        context.lineJoin = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5
        contextRef.current = context
    }, [])

    return (
        <>
            <div style={canvasContainerStyle}>
                <canvas
                    width={width}
                    height={height}
                    style={canvasStyle}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    onMouseLeave={finishDrawing}
                    ref={canvasRef} />

                <canvas
                    width={width / 10}
                    height={height}
                    style={canvasJoinStyle}
                />
            </div>
            <ReactSlider
                min={0}
                max={50}
                defaultValue={5}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                onChange={(value, _) => {
                    const canvas = canvasRef.current;
                    const context = canvas.getContext("2d")
                    context.lineWidth = value
                }}
            />
            <button onClick={handleClearCanvasButton} class="btn"> eliminar canvas</button>
            <button onClick={uploadImage}>subir chingadera</button>
        </>
    )
}

export default Canvas

const canvasStyle = {
    border: "1px solid black",
    zIndex: "0"
}

const canvasJoinStyle = {
    borderLeft: "1px dashed black",
    position: "absolute",
    right: "0px",
    top: "0px",
    zIndex: "-1",
}
