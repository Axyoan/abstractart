import { Navbar, Nav, Container } from "react-bootstrap"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase-config'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const NavBarExample = () => {
    const navigate = useNavigate();
    const auth = getAuth()

    const navigateToContinueDrawing = async () => {
        const getId = async () => {
            const querySnapshot = await getDocs(collection(db, "unfinishedDrawings"))
            const randIndex = Math.floor(Math.random() * (querySnapshot.docs.length));
            const id = querySnapshot.docs[randIndex].data().drawingId
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
                            <button onClick={() => auth.signOut()} class="btnUnLg"> Unlogin</button>



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


