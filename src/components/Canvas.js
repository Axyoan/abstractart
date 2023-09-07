import React, { useEffect, useRef, useState } from 'react'
import ReactSlider from 'react-slider'
import './buttonColors.css'
import context from 'react-bootstrap/esm/AccordionContext'


const Canvas = ({ width, height, canvasRef, unfinishedCanvasRef, isNewDrawing, imageUrl = null }) => {
   
function whiteColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#ffffff"
}
function blackColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#000000"
}
function redColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#cc1919"
}
function blueColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#2934c6"
}
function grayColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#717171"
}
function yellowColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#fffb14"
}
function orangeColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#fa9906"
}
function purpleColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#5e115f"
}
function cyanColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#1ac8e3"
}
function kirbyColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#e4a3d1"
}
function pinkColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#e32ebc"
}
function coffeeColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#463e32"
}
function sandColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#c3c19e"
}
function greenColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#1ae33f"
}
function greenPColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#067608"
}
function bluePColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#27cce1"
}
function brownColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#392a10"
}
function violetColor()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.strokeStyle ="#a578c5"
}
function pen1()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.lineWidth = 5
}
function pen2()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.lineWidth = 20
}
function pen3()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.lineWidth = 35
}
function pen4()
{
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.lineWidth = 50
}


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
            <div style={tempStyle}>
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
                <p1>
                <button onClick={whiteColor}class="white"></button>
                <button onClick={blackColor}class="black"></button>
                <button onClick={grayColor} class="gray"></button>
                <button onClick={blueColor} class="blue"></button>
                <button onClick={redColor} class="red"></button>
                <button onClick={pinkColor} class="pink"></button>
                </p1>
                <p2>
                <button onClick={greenColor}class="green"></button>
                <button onClick={greenPColor}class="greenP"></button>
                <button onClick={bluePColor}class="blueP"></button>
                <button onClick={yellowColor}class="yellow"></button>
                <button onClick={orangeColor} class="orange"></button>
                <button onClick={purpleColor}class="purple"></button>
                </p2>
                <p3>
                <button onClick={brownColor}class="brown"></button>
                <button onClick={kirbyColor}class="kirby"></button>
                <button onClick={violetColor}class="violet"></button>
                <button onClick={coffeeColor} class="coffee"></button>
                <button onClick={cyanColor}class="cyan"></button>
                <button onClick={sandColor} class="sand"></button>
                </p3>
                <p4>
                <button onClick ={whiteColor} className='eraser'><img src="../../../assets/eraser.svg"/></button>
                <button onClick ={handleClearCanvasButton} className='eraser'><img src="../../../assets/trash.svg"/></button>  
                <button onClick={pen1}class="pen1"></button>
                <button onClick={pen2}class="pen2"></button>
                <button onClick={pen3}class="pen3"></button>
                <button onClick={pen4}class="pen4"></button>

                </p4>
        
                </div>
            
            
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

const tempStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "30%",
    marginRight: "30%",

}
