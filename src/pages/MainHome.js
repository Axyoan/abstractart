import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useParams } from 'react-router-dom';

const MainHome =() =>{

    const { status } = useParams();
    const [userCreated, setUserCreated] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const [checked, setChecked] = useState(false);
    console.log(status);
    if(!checked){
        if(status === '1'){
            setUserCreated(true)
        }
        else if(status === '2'){
            setUserLogged(true);
        }
        setChecked(true);
    }
    
    return (
            <div>
                <div class="photoA"></div>

                <h1>view home</h1>
                <Collapse in={userLogged}>
                    <Alert variant="filled" onClose={() => {setUserLogged(false)}}>Welcome back!</Alert>
                </Collapse>
                <Collapse in={userCreated}>
                    <Alert 
                    variant="filled" 
                    onClose={() => {setUserCreated(false)}}
                    
                    >User created successfully</Alert>
                </Collapse>
            </div>

    )
}
export default MainHome
