import { Navbar, Nav, Container } from "react-bootstrap"
import { Outlet, Link } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore";


const NavBarExample = () => {
    const getContinueDrawingURL = () => {
        console.log("huh?")
        const id = 1
        const hardcodedId = "2f981207-8018-453c-b046-88b52da9027a"

        return "/continueDrawing/" + hardcodedId;
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
                            <Nav.Link as={Link} to={getContinueDrawingURL()}>Continue Drawing</Nav.Link>
                            <Nav.Link as={Link} to="/galery">Galery</Nav.Link>
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
