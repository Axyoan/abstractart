import React, { useEffect, useState } from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { db } from '../firebase-config'


const CanvasGrid = ({ count, width, height, canvasesRefs, imagesUrls, isDataReady, currentPage, drawingsPerPage }) => {
    const [areImagesReady, setAreImagesReady] = useState(false)
    const [reload, setReload] = useState(false)
    const [likeBtns, setLikeBtns] = useState([])
    const [authors, setAuthors] = useState([])

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

    const initializeAuthors = async (imagesUrlsSlice) => {
        const authors = await Promise.all(imagesUrlsSlice.map(async (_, index) => {
            let artists = ["Anonymous", "Anonymous"]
            const firstId = splitUrl(imagesUrlsSlice[index][0])
            const secondId = splitUrl(imagesUrlsSlice[index][1])
            const qryUnfinished = await getDoc(doc(db, "unfinishedDrawings", firstId))
            const qryCompleted = await getDoc(doc(db, "completedDrawings", secondId))
            if (qryUnfinished.exists()) {
                const firstUserId = await getDoc(doc(db, "extraUserData", qryUnfinished.data().userId))
                if (firstUserId.exists() && firstUserId.data().username != undefined) {
                    artists[0] = firstUserId.data().username
                }
            }
            if (qryCompleted.exists()) {
                const secondUserId = await getDoc(doc(db, "extraUserData", qryCompleted.data().userId))
                if(secondUserId.exists() && secondUserId.data().username != undefined){
                    artists[1] = secondUserId.data().username
                }
            }
            return artists
        }))
        setAuthors(authors)
    
    }


    const sliceImagesUrls = () => {
        return imagesUrls.slice((currentPage - 1) * drawingsPerPage, Math.min((currentPage - 1) * drawingsPerPage + drawingsPerPage, count))
    }

    useEffect(() => {
        console.log("grid rendered")
        const storage = getStorage();
        const imagesUrlsSlice = sliceImagesUrls()
        initializeLikes(imagesUrlsSlice)
        initializeAuthors(imagesUrlsSlice)
        imagesUrlsSlice.forEach((imageUrl, index) => {
            const canvas = canvasesRefs.current[index + (currentPage - 1) * drawingsPerPage]
            if (canvas == null) return
            const canvasContext = canvas.getContext("2d")
            const firstImg = new Image();
            const secondImg = new Image();
            let  firstAuthor;
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
                            <p>Authors: {authors[index][0]} & {authors[index][1]}</p>
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