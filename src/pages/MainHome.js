import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useParams } from 'react-router-dom';

const MainHome = () => {

    const { status } = useParams();
    const [userChanged, setUserChanged] = useState(false);
    const [checked, setChecked] = useState(false);

    console.log(status);
    if (!checked) {
        if (status === '1') {
           setUserChanged(true)
        }
        setChecked(true);
    }

    return (
        <div>
            <p style={tutorialStyle}>
                Welcome to <b>AbstractArt!</b> This is an online adaptation of Exquisite Corpse: a game in which each participant takes turns drawing on a sheet of paper, folding it to conceal his or her contribution, and then passing it to the next player for a further contribution. Click on "Start Drawing" to create the first part of a drawing, or "Continue Drawing" to finish what another user has started.
            </p>
            <div style={alert}>
                <Collapse in={userChanged}>
                    <Alert variant="filled" severity='success' onClose={() => { setUserChanged(false) }}>User updated successfully</Alert>
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
