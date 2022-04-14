import React,{useEffect,useState,useLayoutEffect} from 'react'
import PACKOFCARDS from "./DeckOfCards"
import socket from '../socketConfig'
import "./DisplayPlayerCards.css"
const DisplayPlayerCards = ({players,player,gameId,topMostCard,penaltyAdditionAlarm,color,isOpen}) => {
    const [directions, setdirections] = useState({})
    // const [isBusy, setisBusy] = useState(true)
    const conditionUNO = ()=>{
        if(player.isActive && player.cards.length==2){
            let topmostCard = topMostCard
            let topmostCardType = topmostCard.slice(0,topmostCard.length-1)
            let condition = player.cards.some((val)=> val.charAt(val.length-1) == color || val.slice(0,val.length-1) == topmostCardType || val=="W" || val=="D4W")
            if(condition){
                return true
            }
        }
        return false
    }
    function handleKeyUp(item,e){
        console.log(e)
        if(e.key=="x")
        {placeCard(item,e)}
    }
    // useEffect(() => {
    //     console.log("INSIDE USE EFFECT")
    //     conditionUNO()
    
    // }, [player.isActive])
    // useEffect(() => {
    //     console.log("INSIDE USE EFFECT")
    //     document.addEventListener("keyup",(e)=>{
    //         if(e.key === "d"){
    //             drawCards()
    //         }
    //     })
    
    // }, [topMostCard])
    useEffect(() => {
        console.log(color)
        if(color) document.body.style.backgroundImage = "url("+require(`../assets/backgrounds/bg${color}.png`).default+")"
        console.log(players)
        players.forEach(p => {
            console.log(p.playerIndex)
            if(p.isActive) 
            {document.getElementById(String(p.playerIndex)+":"+"turn").firstChild.style.visibility = "visible"
            
            }
            else{document.getElementById(String(p.playerIndex)+":"+"turn").firstChild.style.visibility = "hidden"}
        });
            

    }, [color,isOpen,player.isActive])
    
    
    useEffect(() => {
        let x = player.playerIndex
        let n = players.length
        let arr
        let obj = new Object()
        if(n==4){
            arr = ["west","north","east","south"]
            while(n){
                if(x>players.length-1){x = Math.abs(players.length-x)}
                console.log(directions,x,arr[n-1])
                obj[x]=arr[n-1]
                x+=1
                n-=1
            }
        }
        else if(n==3){
            arr = ["north","east","south"]
            while(n){
                if(x>players.length-1){x = Math.abs(players.length-x)}
                console.log(directions,x,arr[n-1])
                obj[x]=arr[n-1]
                x+=1
                n-=1
            }
        }
        else if(n==2){
            arr = ["north","south"]
            while(n){
                if(x>players.length-1){x = Math.abs(players.length-x)}
                console.log(directions,x,arr[n-1])
                obj[x]=arr[n-1]
                x+=1
                n-=1
            }
        } 
        else{
            obj[x]="south"
        }   
        

        setdirections(obj)
        console.log("sdahdsuihi",directions,obj)
        var inputs = document.getElementsByClassName("card");
        console.log("cards",inputs)
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener("keyup", function(event) {
                if (event.key == "ArrowLeft") {
                    if (this.previousElementSibling) {
                        console.log("Prev")
                        this.previousElementSibling.focus();
                    }
                } 
                else if (event.key == "ArrowRight") {
                    if (this.nextElementSibling) {
                        console.log("Next")
                        this.nextElementSibling.focus();
                    }
                }
                // else if(event.key == "x"){
                //     if(this){
                //         console.log(this,this.firstChild.getAttribute("data-item"))
                //         let item = this.firstChild.getAttribute("data-item")
                //         placeCard(item,this.firstChild.getAttribute("data-item"))
                    
                //     }
                // }
                // else if(event.key == "d"){
                //     drawCards()
                // }
            }, false);
            inputs[i].addEventListener("mouseover", function(event) {
                this.focus();
            }, false);
            console.log("hello")    
        }
        
        document.addEventListener("keyup",function(event){
            if(event.key === "ArrowDown"){
                console.log("hsays8y")
            document.getElementsByClassName("card")[0].focus()
            }

        })
    }, [players.length])
    
    const callUNO = ()=>{
        players.forEach(p => {
            console.log(p.playerIndex)
            if(p.isActive) 
            {
                document.getElementById(String(p.playerIndex)+":"+"turn").children[2].style.visibility = "visible"
                setTimeout(() => {
                    document.getElementById(String(p.playerIndex)+":"+"turn").children[2].style.visibility = "hidden"
                }, 1300); 
            }
            else{document.getElementById(String(p.playerIndex)+":"+"turn").children[2].style.visibility = "hidden"}
        });
        socket.emit("callUNO",{gameId})
        
    }
    const catchUNO = ()=>{
        socket.emit("caughtUNO",{gameId})
    }
    const drawCards = ()=>{
        if(penaltyAdditionAlarm){
            console.log("In drawCards")
            penaltydrawCards()
        }
        else{
            console.log("drawn")
            let userInputDrawn = PACKOFCARDS[Math.floor(Math.random() * PACKOFCARDS.length)]
            let playerId = player._id
            socket.emit("userInputDraw",{userInputDrawn,gameId,playerId})
        }
    }
    const penaltydrawCards = ()=>{
        console.log("In penalty Draw Cards")
        socket.emit("penaltyDraw",{gameId})
    }
    function placeCard(item,e){
        if(player.isActive){
            console.log("IN PLACE CARD")
            console.log(e)
            let index
            if(e.target){
               index = e.target.id
            }
            else{
               index = e.id
            }
            console.log("INDEX",index)
            // let index = e
            let topmostCard = topMostCard
            // let topmostCardColor = topmostCard.charAt(topmostCard.length-1)
            console.log(topmostCard,penaltyAdditionAlarm)
            let topmostCardType = topmostCard.slice(0,topmostCard.length-1)
            let tobePlacedCard = item
            let tobePlacedCardColor = item.charAt(item.length-1)
            let tobePlacedCardType = item.slice(0,item.length-1)
    
            // Takes care of draw 4's and draw 2's during penalties
            if(penaltyAdditionAlarm){
                if(topmostCardType == tobePlacedCardType){
                    if(tobePlacedCard == "D4W")
                    {
                        let wildColor = prompt("enter R:red,B:blue,G:green,y:yellow", "R");
                        tobePlacedCardColor = wildColor
                    }
                    socket.emit("userInputPlace",{item,gameId,index,tobePlacedCardColor})
                }
                else{
                    penaltydrawCards()
                }
            }
            else{
                if(tobePlacedCard == "W" || tobePlacedCard == "D4W")
                {
                    let wildColor = prompt("enter R:red,B:blue,G:green,y:yellow", "R");
                    tobePlacedCardColor = wildColor
                    socket.emit("userInputPlace",{item,gameId,index,tobePlacedCardColor})
                }
                else if(tobePlacedCardColor == color || tobePlacedCardType == topmostCardType){
                    socket.emit("userInputPlace",{item,gameId,index,tobePlacedCardColor})
                }
                
            }
        }

    }
  return (
    <div id="frame">
            {
                <>
                <div key={player._id} class={directions[player.playerIndex]} id={player.playerIndex+":"+"turn"}>
                    {/* <h1>{"as"+directions[player.playerIndex]}</h1> */}
                    {/* <h1>{player.playerIndex}</h1> */}

                    <div display="flex" class="yourTurn">
                        YOUR TURN
                    </div>    
                    <h2 class="playerDetails">{player.playerIndex +":"+ player.nickName + "-("+String(player.cards.length)+" Cards)"}</h2>
                    <img class="unoCall" src={require("../assets/logo.png").default}/>
                    {/* </div> */}
                    {/* <h3>{player.cards}</h3> */}
                    {
                    !isOpen ?<div style={{display:'flex',justifyContent:"center",marginBottom:"10px"}}>
                                {player.cards.map((item,i)=>{
                                    // return <div class="card" tabIndex={i}><img style={{width:"7vw"}} key={i} id={i} data-item={item} onClick={()=>placeCard(item,String(i))} src={require(`../assets/cards-front/${item}.png`).default}/></div>
                                    return <div class="card" tabIndex={i} id={i} onKeyUp={handleKeyUp.bind(this,item)}><img style={{width:"7vw"}} key={i} id={i} data-item={item} onClick={placeCard.bind(this,item)} src={require(`../assets/cards-front/${item}.png`).default}/></div>
                                })}   
                            </div>
                           :<div style={{display:'flex',justifyContent:"center"}}>
                                {player.cards.map((item,i)=>{
                                    return <div class="card" tabIndex={i}><img style={{width:"7vw"}} key={i} id={i} src={require(`../assets/card-back.png`).default}/></div>
                                })}   
                            </div>    
                    }
                    {player.isActive && <button onClick={drawCards}>Draw</button>}
                    {(!player.isActive && !isOpen) && <button onClick={catchUNO}>CATCH UNO</button>}
                    {conditionUNO() && <button onClick={callUNO}>UNO</button>}
                    
                </div>
                </>
            }
            {
                players.map((playerObj)=>{
                    return playerObj._id !== player._id ? 
                            <div key={playerObj._id} class={directions[playerObj.playerIndex]} id={playerObj.playerIndex+":"+"turn"}>
                                <div display="flex" class="yourTurn">
                                    YOUR TURN
                                </div> 
                                <h2 class="playerDetails">{playerObj.playerIndex +":"+ playerObj.nickName + "-("+String(playerObj.cards.length)+" Cards)"}</h2>
                                <img class="unoCall" src={require("../assets/logo.png").default}/>
                                <div style={{display:'flex',justifyContent:"center"}}>
                                {playerObj.cards.map((item,i)=>{
                                    if(i<20 && directions[playerObj.playerIndex]=="east" || directions[playerObj.playerIndex]=="west"){
                                        return <div class="cardBacks" tabIndex={i}><img style={{width:"7vw"}} key={i} id={i} src={require(`../assets/card-back.png`).default}/></div>
                                    }
                                    else if(directions[playerObj.playerIndex]=="south" || directions[playerObj.playerIndex]=="north"){
                                        return <div class="cardBacks" tabIndex={i}><img style={{width:"7vw"}} key={i} id={i} src={require(`../assets/card-back.png`).default}/></div>

                                    } 
                                })}   
                            </div>    
                            </div>
                            :null

                })
            }
    </div>
    
    
  )
}

export default DisplayPlayerCards