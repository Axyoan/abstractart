import React, { useEffect, useState, useRef } from 'react'
import { collection, getDocs, getCountFromServer, query, where, getDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { db } from '../firebase-config'
import CanvasGrid from '../components/CanvasGrid';
import GalleryPagination from '../components/GalleryPagination'

const PersonalGallery = () => {
    const [imagesUrls, setImagesUrls] = useState([])
    const [canvasCount, setCanvasCount] = useState(null)
    const [isDataReady, setIsDataReady] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const drawingsPerPage = 5

    const canvasesRefs = useRef([])

    const filterImages = async () => {
        const auth = getAuth();
        const drawingsUserHasContributedTo = []
        const fullDrawingsSnapShot = await getDocs(collection(db, "associatedDrawings"))
        for (const docSnap of fullDrawingsSnapShot.docs) {
            const firstId = docSnap.data().firstId
            const secondId = docSnap.data().secondId
            const unfinishedDrawing = await getDoc(doc(db, "unfinishedDrawings", firstId))
            const completedDrawing = await getDoc(doc(db, "completedDrawings", secondId))
            if (unfinishedDrawing.data().userId == auth.currentUser.uid || completedDrawing.data().userId == auth.currentUser.uid) {
                const firstImageUrlToDownload = 'newDrawings/' + firstId + '.jpg'
                const secondImageUrlToDownload = 'continuedDrawings/' + secondId + '.jpg'
                drawingsUserHasContributedTo.push([firstImageUrlToDownload, secondImageUrlToDownload])
            }
        }
        return drawingsUserHasContributedTo

    }

    const loadAllImages = async () => {
        const drawingsUserHasContributedTo = await filterImages()
        setCanvasCount(drawingsUserHasContributedTo.length)
        canvasesRefs.current = canvasesRefs.current.slice(0, drawingsUserHasContributedTo.length);
        setImagesUrls(drawingsUserHasContributedTo)
        setIsDataReady(true)
        console.log("all loaded")
    }

    useEffect(() => {
        loadAllImages()
    }, [])
    const updateCurrentPage = (page) => {
        setCurrentPage(page)
    }
    return (
        <>
            <h1>Personal gallery</h1>
            {!isDataReady && <div>Loading...</div>}
            <CanvasGrid count={canvasCount} height={500} width={1100} canvasesRefs={canvasesRefs} imagesUrls={imagesUrls} isDataReady={isDataReady} currentPage={currentPage} drawingsPerPage={drawingsPerPage} />
            <GalleryPagination currentPage={currentPage} setCurrentPage={updateCurrentPage} pageCount={Math.ceil(canvasCount / drawingsPerPage)} />
        </>
    )
}

export default PersonalGallery