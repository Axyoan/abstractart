import React, { useEffect, useState } from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { db } from '../firebase-config'


const CanvasGrid = ({ count, width, height, canvasesRefs, imagesUrls, isDataReady, currentPage, drawingsPerPage }) => {
    const [areImagesReady, setAreImagesReady] = useState(false)
    const [reload, setReload] = useState(false)
    const [likeBtns, setLikeBtns] = useState([])
    const [firstUser, setFirstUser] = useState("Anonymous");
    const [secondUser, setSecondUser] = useState("Anonymous");

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

    const getDrawingLikeURL = (imagesUrlsSlice, index) => {
        const firstUrl = imagesUrlsSlice[index][0].split('/')[1].split('.')[0]
        const secondUrl = imagesUrlsSlice[index][1].split('/')[1].split('.')[0]
        return firstUrl + "_" + secondUrl
    }

    const splitUrl = (str) => {
        return str.split('/')[1].split('.')[0]
    }

    const initializeLikes = async (imagesUrlsSlice) => {
        const auth = getAuth();
        if (auth.currentUser) {
            const newLikes = await Promise.all(imagesUrlsSlice.map(async (_, index) => {
                const docRef = doc(db, "drawing_likes", auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                return (docSnap.exists() && docSnap.data().hasOwnProperty(getDrawingLikeURL(imagesUrlsSlice, index)))
                    ?
                    docSnap.data()[getDrawingLikeURL(imagesUrlsSlice, index)]
                    : false
            }))
            setLikeBtns(newLikes)
        }
    }

    const sliceImagesUrls = () => {
        return imagesUrls.slice((currentPage - 1) * drawingsPerPage, Math.min((currentPage - 1) * drawingsPerPage + drawingsPerPage, count))
    }

    useEffect(() => {
        console.log("grid rendered")
        const storage = getStorage();
        const imagesUrlsSlice = sliceImagesUrls()
        initializeLikes(imagesUrlsSlice)
        imagesUrlsSlice.forEach((imageUrl, index) => {
            const canvas = canvasesRefs.current[index + (currentPage - 1) * drawingsPerPage]
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

    }, [isDataReady, imagesUrls, reload, currentPage])

    const updateLike = async (imagesUrlsSlice, index, newVal) => {
        const auth = getAuth();
        const firstId = splitUrl(imagesUrlsSlice[index][0])

        const secondSecond = splitUrl(imagesUrlsSlice[index][1])

        const qryUnfinished = await getDoc(doc(db, "unfinishedDrawings", firstId))
        const qryCompleted = await getDoc(doc(db, "completedDrawings", secondSecond))
        if (!qryUnfinished.exists() || !qryCompleted.exists()) {
            console.error("error fetching drawing ids")
            return
        }
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const queryFirstUser = await getDoc(doc(db, "extraUserData", qryUnfinished.data().userId))
                console.log(qryUnfinished.data().userId)
                    if (queryFirstUser.exists() && queryFirstUser.data().username != undefined) {
                        console.log("==============" + queryFirstUser.data().username)
                        setFirstUser(queryFirstUser.data().username)
                    }
                const querySecondUser = await getDoc(doc(db, "extraUserData", qryCompleted.data().userId))
                    if (querySecondUser.exists() && querySecondUser.data().username != undefined) {
                        setSecondUser(querySecondUser.data().username)
                    }
                // update likes of the drawing itself, not the individual users
                let docRef = doc(db, "drawing_likes", auth.currentUser.uid);
                const drawingId = getDrawingLikeURL(imagesUrlsSlice, index)
                if ((await getDoc(docRef)).exists()) {
                    updateDoc(docRef, {
                        [drawingId]: newVal
                    })
                }
                else {
                    setDoc(docRef, {
                        [drawingId]: newVal
                    })
                }
                // Update likes of first artist
                docRef = doc(db, "user_likes", auth.currentUser.uid)
                let qryDoc = await getDoc(docRef)
                let newLikeCounter = newVal ? 1 : 0
                if (qryDoc.exists()) {
                    newLikeCounter = 0
                    if (qryDoc.data().hasOwnProperty(qryUnfinished.data().userId))
                        newLikeCounter = qryDoc.data()[qryUnfinished.data().userId]
                    newLikeCounter += (newVal ? 1 : -1)
                    updateDoc((docRef), {
                        [qryUnfinished.data().userId]: newLikeCounter
                    });
                }
                else {
                    setDoc((docRef), {
                        [qryUnfinished.data().userId]: newLikeCounter
                    });
                }

                // Update likes of second artist
                docRef = doc(db, "user_likes", auth.currentUser.uid)
                qryDoc = await getDoc(docRef)
                newLikeCounter = newVal ? 1 : 0
                if (qryDoc.exists()) {
                    newLikeCounter = 0
                    if (qryDoc.data().hasOwnProperty(qryCompleted.data().userId))
                        newLikeCounter = qryDoc.data()[qryCompleted.data().userId]
                    newLikeCounter += (newVal ? 1 : -1)
                    updateDoc((docRef), {
                        [qryCompleted.data().userId]: newLikeCounter
                    });
                }
                else {
                    setDoc((docRef), {
                        [qryCompleted.data().userId]: newLikeCounter
                    });
                }
            }
        });

    }

    const handleOnClickLike = (index) => {
        const imagesUrlsSlice = sliceImagesUrls()
        updateLike(imagesUrlsSlice, index, !likeBtns[index])
        const newLikes = likeBtns.map((k, i) => {
            return i === index ? !k : k
        });
        setLikeBtns(newLikes)
    }


    /* canvasesRefs.current.slice((currentPage - 1) * drawingsPerPage, Math.min((currentPage - 1) * drawingsPerPage + drawingsPerPage, count))[index] */

    return (
        <>
            {
                areImagesReady ?
                    Array.from({ length: Math.min(drawingsPerPage, count - (currentPage - 1) * drawingsPerPage) }, (_, index) =>
                        <>
                            <div style={canvasContainerStyle}><canvas
                                key={index + (currentPage - 1) * drawingsPerPage}
                                width={width}
                                height={height}
                                style={canvasStyle}
                                ref={el => canvasesRefs.current[index + (currentPage - 1) * drawingsPerPage] = el}
                            />
                            </div>
                            <p>Authors: {firstUser} & {secondUser}</p>
                            <a style={likeBtnStyle} onClick={() => handleOnClickLike(index)} className='btn'>Like<img src={likeBtns[index] ? "../../../assets/heart 2.svg" : "../../../assets/heart.svg"} /></a>
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