import React from 'react'
import { useParams } from 'react-router-dom';
import DrawingArea from '../components/DrawingArea';


const ContinueDrawing = () => {
    const { id } = useParams();
    return (
        <>
            <DrawingArea />
        </>
    )
}

export default ContinueDrawing