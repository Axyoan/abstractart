import React, { useEffect, useState } from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HomeCarousel = ({ drawingCountOnCarousel, height, width, canvasesRefs, imgsUrls, isDataReady }) => {

    const [drawingsReady, setDrawingsReady] = useState(false);

    const canvasContainerStyle = {
        position: "relative",
        left: "0px",
        right: "0px",
        marginLeft: "auto",
        marginRight: "auto",
        height: height,
        width: width,
        backgroundColor: "white",
        zIndex: "1"
    }

    const carouselStyle = {
        margin: "auto",
        width: width + 20,
    }

    useEffect(() => {
        const storage = getStorage();
        console.log("Carousel rendered")
        imgsUrls.forEach((imgUrl, index) => {
            const firstImg = new Image();
            const secondImg = new Image();
            const canvas = canvasesRefs.current[index]
            const canvasContext = canvas.getContext("2d")
            getDownloadURL(ref(storage, imgUrl[0])).then((firstUrl) => {
                firstImg.src = firstUrl
                firstImg.onload = function () {
                    canvasContext.drawImage(firstImg, 0, 0);
                };
            }).then(() => {
                getDownloadURL(ref(storage, imgUrl[1])).then((secondUrl) => {
                    secondImg.src = secondUrl
                    secondImg.onload = function () {
                        canvasContext.drawImage(secondImg, 450, 0);
                    };
                })
            }).then(() => { console.log("Images ready"); setDrawingsReady(true) }).catch(() => { console.log("Error loading image from storage") })
        });

    }, [isDataReady])

    return (
        <>
            {isDataReady &&
                <div style={carouselStyle}>
                    <Carousel width={width + 20} autoPlay={true} centerMode={true} >{
                        Array.from({ length: drawingCountOnCarousel }, (_, index) => {
                            return <div style={canvasContainerStyle} key={index}>
                                <canvas
                                    key={index}
                                    width={width}
                                    height={height}
                                    style={canvasStyle}
                                    ref={el => canvasesRefs.current[index] = el}
                                />
                            </div>
                        })}
                    </Carousel>
                </div>
            }
        </>
    )
}

const canvasStyle = {
    border: "1px solid black",
    zIndex: "0"
}



export default HomeCarousel