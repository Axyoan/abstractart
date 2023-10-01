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
        let colRef = collection(db, auth.currentUser.uid + "_user_likes");
        let snapshot = await getDocs(colRef);
        const data = { likes: {}, drawingsCnt: {} }
        snapshot.docs.forEach(doc => { data.likes[doc.id] = doc.data().likeCounter })

        colRef = collection(db, "extraUserData");
        snapshot = await getDocs(colRef);
        snapshot.docs.forEach(doc => { data.drawingsCnt[doc.id] = doc.data().totalImagesDrawn })

        console.log(data)
        axios.get('http://localhost:5000/hello', { params: data })
            .then(response => console.log("response from api: ", response.data)).catch(e => console.log(e))
    }

    const navigateToContinueDrawing = async () => {
        const getId = async () => {
            const currentUserId = auth.currentUser?.uid
            var id
            var userId = currentUserId
            while (userId === currentUserId) {
                const querySnapshot = await getDocs(collection(db, "unfinishedDrawings"))
                const randIndex = Math.floor(Math.random() * (querySnapshot.docs.length));
                id = querySnapshot.docs[randIndex].data().drawingId
                userId = querySnapshot.docs[randIndex].data().userId
                console.log("...Wating")
            }
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
                            <button onClick={fetchAPI} class="btn"> api test</button>
                            <button onClick={() => auth.signOut()} class="btnSignOut"> SignOut</button>



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


