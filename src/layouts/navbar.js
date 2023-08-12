import { Navbar, Nav, Container } from "react-bootstrap"
import { Outlet, Link } from "react-router-dom"

const NavBarExample = () => {
    return(
       <>    
       <Navbar className="navBg" variant="light" expand="lg">
        <Container>
            <Navbar.Brand as={Link} to="/" >Abstractart</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link as={Link} to="/" >MainHome</Nav.Link>
                <Nav.Link as={Link} to="/Canvas">Home</Nav.Link> 
                <Nav.Link as={Link} to="/signup">SignUp</Nav.Link>
                <Nav.Link as={Link} to="/galery">Galery</Nav.Link>
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
