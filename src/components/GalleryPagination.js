import React from 'react'

const GalleryPagination = ({ currentPage, setCurrentPage, pageCount }) => {

    return (
        <>
            <button disabled={currentPage == 1} onClick={() => setCurrentPage(1)}>First</button>
            <button disabled={currentPage == 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
            {
                Array.from({ length: pageCount }, (_, index) =>
                    <button onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>)
            }

            <button disabled={currentPage == pageCount} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            <button disabled={currentPage == pageCount} onClick={() => setCurrentPage(pageCount)}>Last</button>
        </>
    )
}

export default GalleryPagination