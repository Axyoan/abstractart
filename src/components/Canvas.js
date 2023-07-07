import React from 'react'

const canvas = ({ width, height }) => {
    return (
        <canvas width={width} height={height} style={canvasStyle}></canvas>
    )
}

export default canvas

const canvasStyle = {
    border: "1px solid black"
}