import React from 'react'

const ScoreBoard = ({players}) => {
    const getScoreBoard = (players)=>{
        const scoreBoard =  players.filter((player)=>player.cards.length!==-1)
        return scoreBoard.sort((a,b)=>b.cards.length>a.cards.length ? -1 : a.cards.length>b.cards.length ? 1 : 0)
    }
    const scoreBoard = getScoreBoard(players)
    if(scoreBoard.length === 0 ){
        return null
    }
    return (
        <table className="table table-striped my-3 table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">No Of Cards</th>
                </tr>
            </thead>
            <tbody>
                {
                    scoreBoard.map((player,index)=>{
                        return  <tr>
                                    <th scope="row">{index+1}</th>
                                    <td>{player.nickName}</td>
                                    <td>{player.cards.length}</td>
                                </tr>
                    })
                }
            </tbody>
            
        </table>
    )
}

export default ScoreBoard

