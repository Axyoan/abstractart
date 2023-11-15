import React, { useState } from 'react'
const MainHome = () => {
  return (
        <div>
            <p style={tutorialStyle}>
                Welcome to <b>AbstractArt!</b> This is an online adaptation of Exquisite Corpse: a game in which each participant takes turns drawing on a sheet of paper, folding it to conceal his or her contribution, and then passing it to the next player for a further contribution. Click on "Start Drawing" to create the first part of a drawing, or "Continue Drawing" to finish what another user has started.
            </p>
        </div>

    )
}

const tutorialStyle = {
    margin: "5% 20%",
    fontSize: "20px",
    color: "black"
}

export default MainHome
