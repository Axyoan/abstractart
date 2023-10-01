import React, { useEffect, useState } from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { db } from '../firebase-config'


const CanvasGrid = ({ count, width, height, canvasesRefs, imagesUrls, isDataReady }) => {
    const [areImagesReady, setAreImagesReady] = useState(false)
    const [reload, setReload] = useState(false)
    const [likeBtns, setLikeBtns] = useState([])

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

    const getDrawingLikeURL = (index) => {
        const firstUrl = imagesUrls[index][0].split('/')[1].split('.')[0]
        const secondUrl = imagesUrls[index][1].split('/')[1].split('.')[0]
        return firstUrl + "_" + secondUrl
    }

    const initializeLikes = async () => {
        const auth = getAuth();
        if (auth.currentUser) {
            const newLikes = await Promise.all(imagesUrls.map(async (_, index) => {
                const docRef = doc(db, auth.currentUser.uid + "_likes", getDrawingLikeURL(index));
                const docSnap = await getDoc(docRef);
                return docSnap.exists() ? docSnap.data().val : false
            }))
            setLikeBtns(newLikes)
        }
    }

    useEffect(() => {
        console.log("grid rendered")
        const storage = getStorage();
        initializeLikes()
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
            }).then(() => {
                setReload(true)
            })
        })
        setAreImagesReady(true)

    }, [isDataReady, imagesUrls, reload])

    const updateLike = async (index, newVal) => {
        const auth = getAuth();
        const firstId = imagesUrls[index][0].split('/')[1].split('.')[0]
        const secondSecond = imagesUrls[index][1].split('/')[1].split('.')[0]

        const qryUnfinished = await getDoc(doc(db, "unfinishedDrawings", firstId))
        const qryCompleted = await getDoc(doc(db, "completedDrawings", secondSecond))
        if (!qryUnfinished.exists() || !qryCompleted.exists()) {
            console.error("error fetching drawing ids")
            return
        }
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setDoc(doc(db, user.uid + "_likes", getDrawingLikeURL(index)), {
                    val: newVal,
                    firstUserId: qryUnfinished.data().userId,
                    secondUserId: qryCompleted.data().userId
                });
            }
        });

    }

    const handleOnClickLike = (index) => {
        updateLike(index, !likeBtns[index])
        const newLikes = likeBtns.map((k, i) => {
            return i === index ? !k : k
        });
        setLikeBtns(newLikes)
    }

    return (
        <>
            {
                areImagesReady ?
                    Array.from({ length: count }, (_, index) =>
                        <><div style={canvasContainerStyle}><canvas
                            key={index}
                            width={width}
                            height={height}
                            style={canvasStyle}
                            ref={el => canvasesRefs.current[index] = el}
                        />
                        </div>
                            <a style={likeBtnStyle} on onClick={() => handleOnClickLike(index)} className='btn'>Like<img src={likeBtns[index] ? "../../../assets/heart 2.svg" : "../../../assets/heart.svg"} /></a>
                            <br /><br />
                        </>)

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

const likeBtnStyle = {
    backgroundColor: "white",
    padding: "5px",
    color: "black",
    cursor: "pointer"
}

export default CanvasGrid