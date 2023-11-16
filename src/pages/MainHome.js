import React, { useEffect, useState, useRef } from 'react'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { query, orderBy, limit, collection, onSnapshot } from "firebase/firestore";
import { useParams } from 'react-router-dom';

import { db } from '../firebase-config'
import HomeCarousel from '../components/HomeCarousel'

const MainHome = () => {

    const { status } = useParams();
    const [imgsUrls, setImgsUrls] = useState([]);
    const [isDataReady, setIsDataReady] = useState(false);
    const [userChanged, setUserChanged] = useState(false);
    const [checked, setChecked] = useState(false);


    const height = 500
    const width = 1100
    const drawingCountOnCarousel = 10

    const canvasesRefs = useRef([])

    if (!checked) {
        if (status === '1') {
            setUserChanged(true)
        }
        setChecked(true);
    }

    useEffect(() => {
        canvasesRefs.current = canvasesRefs.current.slice(0, drawingCountOnCarousel);
        const newImgsUrls = []
        onSnapshot(query(collection(db, "associatedDrawings"), orderBy("likeCounter", "desc"), limit(10)), (snapshot) => {
            snapshot.forEach(doc => {
                const firstImageUrlToDownload = 'newDrawings/' + doc.data()["firstId"] + '.jpg'
                const secondImageUrlToDownload = 'continuedDrawings/' + doc.data()["secondId"] + '.jpg'
                newImgsUrls.push([firstImageUrlToDownload, secondImageUrlToDownload])
            });
            setIsDataReady(true)
            setImgsUrls(newImgsUrls)
        });
    }, [])

    return (
        <div>
            <p style={tutorialStyle}>
                Welcome to <b>AbstractArt!</b> This is an online adaptation of Exquisite Corpse: a game in which each participant takes turns drawing on a sheet of paper, folding it to conceal his or her contribution, and then passing it to the next player for a further contribution. Click on "Start Drawing" to create the first part of a drawing, or "Continue Drawing" to finish what another user has started.
            </p>
            <HomeCarousel
                drawingCountOnCarousel={drawingCountOnCarousel}
                height={height}
                width={width}
                canvasesRefs={canvasesRefs}
                imgsUrls={imgsUrls}
                isDataReady={isDataReady}
            />
            <div style={alert}>
                <Collapse in={userChanged}>
                    <Alert variant="filled" severity='success' onClose={() => { setUserChanged(false) }}>User updated successfully, refresh the page to see the changes</Alert>
                </Collapse>
            </div>
        </div>

    )
}

const tutorialStyle = {
    margin: "5% 20%",
    fontSize: "20px",
    color: "black"
}

const alert = {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%"
}

export default MainHome
