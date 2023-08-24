import { Navbar, Nav, Container } from "react-bootstrap"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase-config'
const NavBarExample = () => {
    const navigate = useNavigate();
    const navigateToContinueDrawing = async () => {
        const getId = async () => {
            const querySnapshot = await getDocs(collection(db, "unfinishedDrawings"))
            const randIndex = Math.floor(Math.random() * (querySnapshot.docs.length));
            const id = querySnapshot.docs[randIndex].data().drawingId
            navigate("/continueDrawing/" + id)
        }
        getId()
    }

    return (
        <>
            <Navbar className="navBg" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/" >Abstractart</Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" >MainHome</Nav.Link>
                            <Nav.Link as={Link} to="/StartDrawing">Start Drawing</Nav.Link>
                            <button onClick={navigateToContinueDrawing}>Continue Drawing</button>
                            <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                            <Nav.Link as={Link} to="/signup">SignUp</Nav.Link>
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
