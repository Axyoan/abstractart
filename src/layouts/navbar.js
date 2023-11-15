import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Container } from "react-bootstrap"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { collection, query, where, getDocs } from "firebase/firestore";
import axios from 'axios';
import { db } from '../firebase-config'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./navbar.css"

const NavBar = () => {
    const navigate = useNavigate();
    const auth = getAuth()
    
    const [isUserSignedIn, setIsUserSignedIn] = useState(false)
    const [username, setUsername] = useState("Anonymous");
    
    const getUsername = async (userId) => {
        const query = await getDoc(doc(db, "extraUserData", userId))
        if (query.exists() && query.data().username != undefined) {
            setUsername(query.data().username)
        }
    }

    const fetchAPI = async () => {
        return axios.get('http://localhost:5000/getRecommendedDrawing?userId=' + auth.currentUser.uid)
            .then(response => response.data).catch(e => {
                console.log(e)
                return null
            })
    }

    const getRandDrawing = async () => {
        const currentUserId = auth.currentUser?.uid
        let drawingId = null

        const querySnapshot = await getDocs(query(collection(db, "unfinishedDrawings"), where("userId", "!=", currentUserId)))
        const randIndex = Math.floor(Math.random() * (querySnapshot.docs.length));
        if (querySnapshot.empty) {
            console.log("No drawings available to finish")
            return null
        }
        drawingId = querySnapshot.docs[randIndex].data().drawingId
        console.log(drawingId)
        return drawingId
    }
    const navigateToContinueDrawing = async () => {
        const getId = async () => {
            const id = await fetchAPI()
            console.log("recommendation:", id)
            if (id === null) {
                console.error("cannot recommend anything, give random drawing instead")
                navigate("/continueDrawing/" + await getRandDrawing())
            }
            else {
                navigate("/continueDrawing/" + id)
            }
        }
        getId()
    }

    const navigateToSettings = async () => {
        navigate("/settings/")
    }
    
    const navigateToGallery = async () => {

        navigate("/gallery/")

    }
    const navigateToStarDraw = async () => {

        navigate("/StartDrawing/")

    }
    const navigateToSignup = async () => {

        navigate("/SignUp/")

    }
    const navigateToMain = async () => {

        navigate("/Home/")

    }

    const signOut = async () => {
        auth.signOut()
        navigate("/Home/")
    }

    useEffect(() => {

        onAuthStateChanged(auth, (u) => {
            console.log("uh oh  ")
            setIsUserSignedIn(u != null)
            if(auth.currentUser !== null ){
                getUsername(auth.currentUser.uid)
            }
        })
    }, [])

    return (
        <>
            <Navbar className="navBg" variant="light" expand="lg">
                <Container>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <button onClick={navigateToMain} class="logoA"> </button>
                            <button onClick={navigateToMain} class="btnHome">Home</button>
                            <button onClick={navigateToGallery} class="btnGallery">Gallery</button>
                            {isUserSignedIn ?
                                <>
                                    <button onClick={navigateToStarDraw} class="btnStart">Start Drawing</button>
                                    <button onClick={navigateToContinueDrawing} class="btnContinue">Continue Drawing</button>
                                     <button onClick={navigateToSettings} class="btnStart">{username}</button>
                                    <button onClick={signOut} class="btnSignOut"> SignOut</button>
                                </>
                                :
                                //Change class
                                <button onClick={navigateToSignup} class="btnSignOut">SignUp</button>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <section>
                <Outlet></Outlet>
            </section>
        </>
    )
}
export default NavBar




