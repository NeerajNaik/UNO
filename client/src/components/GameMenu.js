import React from 'react'
import { useHistory } from 'react-router'
import "./GameMenu.css"

const GameMenu = () => {
    let history = useHistory()
    return (
        <div className="text-center top">
            <h1 className="gameMenu">Welcome to UNO</h1>
            <button type="button" onClick={()=>history.push("/game/create")} className="btn btn-primary btn-lg m-3">Create Game</button>
            <button type="button" onClick={()=>history.push("/game/join")} className="btn btn-primary btn-lg">Join Game</button>
        </div>
    )
}

export default GameMenu
