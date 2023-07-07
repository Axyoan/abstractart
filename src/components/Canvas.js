import React, { useEffect, useRef, useState } from 'react'

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

    useEffect(() => {
        const canvas = canvasRef.current;

        const context = canvas.getContext("2d")
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5
        contextRef.current = context
    }, [])

    return (
        <canvas
            width={width}
            height={height}
            style={canvasStyle}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            ref={canvasRef}></canvas>
    )
}

export default Canvas

const canvasStyle = {
    border: "1px solid black"
}