import React from 'react'
import { Redirect } from 'react-router'
import StartBtn from './StartBtn'
import socket from '../socketConfig'

import ScoreBoard from './ScoreBoard'
import DisplayGameCode from './DisplayGameCode'
import DisplayPlayerCards from './DisplayPlayerCards'
import PileOfCards from './PileOfCards'
const Uno = ({gameState}) => {
    // const [state, setstate] = useState(initialState)
    const findPlayer=(players)=>{
        return players.find((player)=>player.socketId === socket.id)
    }
    const {_id,players,topMostCard,penaltyAdditionAlarm,color,isOpen,isOver} = gameState
    console.log(topMostCard,color,penaltyAdditionAlarm)
    let pileTopMostCard
    const player = findPlayer(players)
    if(topMostCard == "W" || topMostCard == "D4W"){
        topMostCard == "W" ? pileTopMostCard ="W"+color : pileTopMostCard ="D4W"+color
    }else{
        pileTopMostCard = topMostCard
    }
    console.log("PileTop",pileTopMostCard)
    if(_id ===""){
        return <Redirect to="/"/>
    }
    return (
        <div className="text-center">

            <PileOfCards topMostCard={pileTopMostCard}/>
            <DisplayPlayerCards players={players} player={player} gameId={_id} topMostCard={topMostCard} 
                                penaltyAdditionAlarm={penaltyAdditionAlarm} color={color} isOpen ={isOpen}/>
            {players.length>1 && <StartBtn player={player} gameId={_id}/>}
            {isOpen && <DisplayGameCode gameId={_id}/>}
            {isOver && <ScoreBoard players={players}/>}
            
        </div>
    )
}

export default Uno

