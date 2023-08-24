import React, { useEffect, useState } from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const CanvasGrid = ({ count, width, height, canvasesRefs, imagesUrls, isDataReady }) => {
    const [areImagesReady, setAreImagesReady] = useState(false)
    const [reload, setReload] = useState(false)

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

    useEffect(() => {
        console.log("grid rendered")
        const storage = getStorage();
        imagesUrls.forEach((imageUrl, index) => {
            const canvas = canvasesRefs.current[index]
            if (canvas == null) return
            const canvasContext = canvas.getContext("2d")
            const firstImg = new Image();
            const secondImg = new Image();
            getDownloadURL(ref(storage, imageUrl[0])).then((firstUrl) => {
                firstImg.src = firstUrl
                firstImg.onload = function () {
                    canvasContext.drawImage(firstImg, 0, 0);

                };
            }).then(() => {
                getDownloadURL(ref(storage, imageUrl[1])).then((secondUrl) => {
                    secondImg.src = secondUrl
                    secondImg.onload = function () {
                        canvasContext.drawImage(secondImg, 450, 0);
                    };
                })
            }).then((bruh) => {
                setReload(true)
            })
        })
        setAreImagesReady(true)

    }, [isDataReady, imagesUrls, reload])


    return (
        <>
            {
                areImagesReady ?
                    Array.from({ length: count }, (_, index) =>
                        <div style={canvasContainerStyle}><canvas
                            key={index}
                            width={width}
                            height={height}
                            style={canvasStyle}
                            ref={el => canvasesRefs.current[index] = el}
                        />
                        </div>)

                    :
                    <div>loading</div>
            }
        </>
    )
}

const canvasStyle = {
    border: "1px solid black",
    zIndex: "0"
}
export default CanvasGrid