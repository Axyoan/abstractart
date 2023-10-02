import { Navbar, Nav, Container } from "react-bootstrap"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore";
import axios from 'axios';
import { db } from '../firebase-config'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const NavBarExample = () => {
    const navigate = useNavigate();
    const auth = getAuth()

    const fetchAPI = async () => {
        return axios.get('http://localhost:5000/getRecommendedDrawing?userId=' + auth.currentUser.uid)
            .then(response => response.data).catch(e => console.log(e))
    }

    const navigateToContinueDrawing = async () => {
        const getId = async () => {
            const id = await fetchAPI()
            console.log("recommendation:", id)
            navigate("/continueDrawing/" + id)
        }
        getId()
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

    return (
        <>
            <Navbar className="navBg" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/" >Abstractart</Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <button onClick={navigateToMain} class="btn">Home</button>
                            <button onClick={navigateToStarDraw} class="btn">Start Drawing</button>
                            <button onClick={navigateToContinueDrawing} class="btn">Continue Drawing</button>
                            <button onClick={navigateToGallery} class="btn">Gallery</button>
                            <button onClick={navigateToSignup} class="btn">SignUp</button>
                            <button onClick={fetchAPI} class="btn"> api test</button>
                            <button onClick={signOut} class="btnSignOut"> SignOut</button>

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
export default NavBarExample


