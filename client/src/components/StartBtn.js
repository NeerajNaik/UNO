import React,{useState} from 'react'
import socket from '../socketConfig'
const StartBtn = ({player,gameId}) => {
    const [ShowBtn, setShowBtn] = useState(true)
    const {isPartyLeader} = player
    const onClickHandler = ()=>{
        // socket.emit("timer",{playerId:player._id,gameId})
        socket.emit("gameStart",{playerId:player._id,gameId})
        setShowBtn(false)

     }
    return (
        isPartyLeader && ShowBtn ? <button type="button" 
                                           onClick={onClickHandler}
                                           className="btn btn-primary">
                                           Start Game</button>
                                           : null
    )
}

export default StartBtn
