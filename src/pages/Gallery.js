import React, { useEffect, useState, useRef } from 'react'
import { collection, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from '../firebase-config'
import CanvasGrid from '../components/CanvasGrid';
import GalleryPagination from '../components/GalleryPagination'

const Gallery = () => {
    const [imagesUrls, setImagesUrls] = useState([])
    const [canvasCount, setCanvasCount] = useState(null)
    const [isDataReady, setIsDataReady] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const drawingsPerPage = 5

    const canvasesRefs = useRef([])

    const loadAllImages = async () => {
        const queryCountSnapshot = await getCountFromServer(collection(db, "associatedDrawings"))
        const newCanvasCount = queryCountSnapshot.data().count
        setCanvasCount(newCanvasCount)
        canvasesRefs.current = canvasesRefs.current.slice(0, newCanvasCount);
        const querySnapshot = await getDocs(collection(db, "associatedDrawings"))

        const newArr = querySnapshot.docs.map((doc) => {
            const firstId = doc.data().firstId
            const secondId = doc.data().secondId
            const firstImageUrlToDownload = 'newDrawings/' + firstId + '.jpg'
            const secondImageUrlToDownload = 'continuedDrawings/' + secondId + '.jpg'
            return [firstImageUrlToDownload, secondImageUrlToDownload]
        })
        setImagesUrls(newArr)
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
        <div>
            {console.log(canvasCount)}
            <h1>view gallery</h1>
            <CanvasGrid count={canvasCount} height={500} width={1100} canvasesRefs={canvasesRefs} imagesUrls={imagesUrls} isDataReady={isDataReady} currentPage={currentPage} drawingsPerPage={drawingsPerPage} />
            <GalleryPagination currentPage={currentPage} setCurrentPage={updateCurrentPage} pageCount={Math.ceil(canvasCount / drawingsPerPage)} />
        </div>

    )
}
export default Gallery