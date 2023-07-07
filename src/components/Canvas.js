import React, { useEffect, useRef } from 'react'

const Canvas = ({ width, height }) => {

    const canvasRef = useRef(null)

    const startDrawing = () => {
    }

    const finishDrawing = () => {
    }

    const draw = () => {
    }

    useEffect(() => {

    }, [])

    return (
        <canvas
            width={width}
            height={height}
            style={canvasStyle}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}></canvas>
    )
}

export default Canvas

const canvasStyle = {
    border: "1px solid black"
}