import React, { useEffect, useRef, useState } from 'react'
import ReactSlider from 'react-slider'

const Canvas = ({ width, height, canvasRef, unfinishedCanvasRef, isNewDrawing, imageUrl = null }) => {

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


    useEffect(() => {
        console.log("render")
        const canvas = canvasRef.current;

        const context = canvas.getContext("2d")
        context.lineCap = "round"
        context.lineJoin = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5
        contextRef.current = context

        if (!isNewDrawing) {
            const unfinishedCanvas = unfinishedCanvasRef.current;
            const unfinishedCanvasContext = unfinishedCanvas.getContext("2d")
            const img = new Image();
            img.src = imageUrl
            img.onload = function () {
                console.log(unfinishedCanvasContext)
                unfinishedCanvasContext.drawImage(img, -450, 0);
            };
        }

    }, [imageUrl])

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
                    width={50}
                    height={height}
                    ref={unfinishedCanvasRef}
                    style={isNewDrawing ? canvasJoinStyle : canvasJoinStyleContinueDrawing}
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
            <button onClick={handleClearCanvasButton} class="btn2"> eliminar canvas</button>
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

const canvasJoinStyleContinueDrawing = {
    borderRight: "1px dashed black",
    position: "absolute",
    left: "0px",
    top: "0px",
    zIndex: "-1",
}
