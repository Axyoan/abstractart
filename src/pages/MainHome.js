import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useParams } from 'react-router-dom';

const MainHome = () => {

    const { status } = useParams();
    const [userCreated, setUserCreated] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const [checked, setChecked] = useState(false);

    console.log(status);
    if (!checked) {
        if (status === '1') {
            setUserCreated(true)
        }
        else if (status === '2') {
            setUserLogged(true);
        }
        setChecked(true);
    }

    return (
        <div>
            <p style={tutorialStyle}>
                Welcome to <b>AbstractArt!</b> This is an online adaptation of Exquisite Corpse: a game in which each participant takes turns drawing on a sheet of paper, folding it to conceal his or her contribution, and then passing it to the next player for a further contribution. Click on "Start Drawing" to create the first part of a drawing, or "Continue Drawing" to finish what another user has started.
            </p>
            <Collapse in={userLogged}>
                <Alert variant="filled" onClose={() => { setUserLogged(false) }}>Welcome back!</Alert>
            </Collapse>
            <Collapse in={userCreated}>
                <Alert
                    variant="filled"
                    onClose={() => { setUserCreated(false) }}

                >User created successfully</Alert>
            </Collapse>
        </div>

    )
}

const tutorialStyle = {
    margin: "5% 20%",
    fontSize: "20px",
    color: "black"
}

export default MainHome
