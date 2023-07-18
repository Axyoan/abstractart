import React, { useEffect, useRef, useState } from 'react'
import ReactSlider from 'react-slider'

const Canvas = ({ width, height }) => {

    const canvasRef = useRef(null)
    const contextRef = useRef(null)

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
    }, [])

    return (
        <>
            <canvas
                width={width}
                height={height}
                style={canvasStyle}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                ref={canvasRef} />
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
            <button onClick={handleClearCanvasButton}>Clear canvas</button>

        </>
    )
}

export default Canvas

const canvasStyle = {
    border: "1px solid black"
}