import React from 'react'
import "./PileOfCards.css"
const PileOfCards = ({topMostCard}) => {
  return (
    topMostCard ? <div style={{marginTop:"19%"}}>
                    <img className="deck" style={{width:"6vw"}} 
                      src={require(`../assets/cards-front/${topMostCard}.png`).default}/>
                    
                    {/* <h3>{topMostCard}</h3> */}
                    {/* {
                        
                    <img style={{width:"7vw"}} 
                            src={require(`../assets/cards-front/${topMostCard}.png`).default}/>
                    } */}
                  </div>
                : <div style={{marginTop:"19%"}}>
                    <img className="deck" style={{width:"6vw"}} 
                            src={require(`../assets/card-back.png`).default}/>
                  </div>  
  )
}

export default PileOfCards
