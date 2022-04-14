//REVERSE DOESNT WORK for two players

const express = require("express")
const socketio = require("socket.io")
const mongoose = require("mongoose")
// const cors = require('cors');
const dotenv = require("dotenv")
const Game = require("./Models/Game")
// const QuoatableAPI = require("./QuoatableAPI")
const app = express()
// const expressServer = app.listen(3001)

const expressServer = app.listen("https://youno26.herokuapp.com/")
const io = socketio(expressServer)
const PACKOFCARDS = require("./Models/DeckOfCards")
const OPENINGDECK = require("./Models/OpeningDeck")
// import PACKOFCARDS from "./client/src/components/DeckOfCards"

dotenv.config()


io.on("connect",(socket)=>{
    //userInputDraw
    //userInputPlace
    socket.on("caughtUNO",async({gameId})=>{
        try{
            let game = await Game.findById(gameId)
            if(!game.isOpen && !game.isOver){
                game.caught = true
                game = await game.save()
                io.to(gameId).emit("update-game",game)
            }
        }catch(err){
            console.log(err)
        }
    })
    socket.on("callUNO",async({gameId})=>{
        try{
            let game = await Game.findById(gameId)
            if(!game.isOpen && !game.isOver){
                game.uno = true
                game = await game.save()
                io.to(gameId).emit("update-game",game)
            }
        }catch(err){
            console.log(err)
        }
    })
    socket.on("penaltyDraw",async({gameId})=>{
        try{
            let game = await Game.findById(gameId)
            if(!game.isOpen && !game.isOver){
                console.log("In Backend Penalty")
                let player = game.players.find((player)=>player.socketId === socket.id)
                let n = game.penalty
                let randomIndex
                while(n){
                    randomIndex = Math.floor(Math.random() * PACKOFCARDS.length);
                    player.cards.push(PACKOFCARDS[randomIndex])
                    n-=1
                }
                game.penalty = 0
                game.penaltyAdditionAlarm = false
                let index = player.playerIndex
                player.isActive = false
                if(game.operator === "+"){
                    index+=1
                }
                else{
                    index-=1
                }
                let z
                if(index < 0 || index > game.players.length-1){
                    z = Math.abs(game.players.length - Math.abs(index))
                }
                else{
                    z = index
                }
                console.log("ZZZ",z,game.operator)
                let nextplayer = game.players.find((player)=>player.playerIndex === z)
                nextplayer.isActive = true
                game = await game.save()
                io.to(gameId).emit("update-game",game)
            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on("userInputDraw",async({userInputDrawn,gameId,playerId})=>{
        try{
            let game = await Game.findById(gameId)
            if(!game.isOpen && !game.isOver){
                console.log("hi")
                console.log(game.players,socket.id,playerId)
                let player = game.players.find((player)=>player.socketId === socket.id)
                // let player = game.players.find((player)=> player._id.toString() === playerId)
                console.log(player.cards)
                player.cards.push(userInputDrawn)  
                game = await game.save()
                console.log("bye")
                io.to(gameId).emit("update-game",game)
                console.log("success")
            }
        }catch(err){
            console.log(err)
        }
    })
    socket.on("userInputPlace",async({"item":userInputPlaced,gameId,"index":idx,"tobePlacedCardColor":color})=>{
        try{
            console.log(idx)
            let game = await Game.findById(gameId)
            
            if(!game.isOpen && !game.isOver){
                // game.pileOfCards.push(userInputPlaced)
                console.log("userInput",userInputPlaced)
                game.topMostCard = userInputPlaced
                game.color = color
                if(userInputPlaced === "D4W"){
                    // if(!game.penaltyAdditionAlarm)
                    console.log("Penalty 4 added")
                    game.penaltyAdditionAlarm = true
                    game.penalty+=4
                }
                else if(userInputPlaced=="D2B" || userInputPlaced=="D2R" || userInputPlaced=="D2G" || userInputPlaced=="D2Y")
                {
                    // if(!game.penaltyAdditionAlarm)
                    console.log("Penalty 2 added")
                    game.penaltyAdditionAlarm = true
                    game.penalty+=2
                }
                let player = game.players.find((player)=>player.socketId === socket.id)
                console.log(player.cards,idx)
                player.cards.splice(idx,1)
                if(player.cards.length == 0){
                    game.isOver = true
                    game.isOpen = true
                }
                if(player.cards.length == 1 && game.caught){
                    if(!game.uno){
                        let n=2
                        while(n){
                            randomIndex = Math.floor(Math.random() * PACKOFCARDS.length);
                            player.cards.push(PACKOFCARDS[randomIndex])
                            n-=1
                        }
                    }
                    else{
                        game.uno = false
                    }
                }
                // let player = game.players.find((player)=> player._id.toString() === playerId)
                let index = player.playerIndex
                player.isActive = false
                // for(let k =0;k<userInputDrawn.length;k++){
                //     player.cards.push(userInputDrawn[k])    
                // }
                if(["_R","_G","_B","_Y"].includes(userInputPlaced)){
                    game.operator =="+" ? game.operator = "-" : game.operator = "+" 
                }
                if(["skipR","skipG","skipB","skipY"].includes(userInputPlaced)){
                    if(game.operator === "+"){
                        index+=2 
                    }
                    else{
                        index-=2
                    }
                }
                else{
                    if(game.operator === "+"){
                        index+=1
                    }
                    else{
                        index-=1
                    }
                }
                let z
                if(index < 0 || index > game.players.length-1){
                    z = Math.abs(game.players.length - Math.abs(index))
                }
                else{
                    z = index
                }
                console.log("ZZZINPlaceCard",z,game.operator)
                let nextplayer = game.players.find((player)=>player.playerIndex === z)
                nextplayer.isActive = true
                game.caught = false
                game = await game.save()
                io.to(gameId).emit("update-game",game)
            }
            
        }catch(err){
            console.log(err)
        }
    })
    // socket.on("userInput",async({userInput,gameId})=>{
    //     try{
    //         let game = await Game.findById(gameId)
    //         if(!game.isOpen && !game.isOver){
    //             let player = game.players.find((player)=>player.socketId === socket.id)
    //             let word = game.words[player.currentWordIndex]
    //             if(word===userInput){
    //                 player.currentWordIndex +=1
    //                 if(player.currentWordIndex !== game.words.length)
    //                 {
    //                     game = await game.save()
    //                     io.to(gameId).emit("update-game",game)
    //                 }
    //                 else{
    //                     let endTime = new Date().getTime()
    //                     let {startTime} = game
    //                     player.WPM = calculateWPM(endTime,startTime,player)
    //                     game = await game.save()
    //                     io.to(gameId).emit("update-game",game)
    //                     socket.emit("done")
    //                 }
    //             }
    //         }
    //     }catch(err){
    //         console.log(err)
    //     }
    // })
    // socket.on("timer",async({playerId,gameId})=>{
    //     let countdown = 5
    //     let game = await Game.findById(gameId)
    //     let player = game.players.find((player)=> player._id.toString() === playerId)
    //     if(player.isPartyLeader){
    //         let timerId = setInterval(async()=>{
    //             if(countdown>=0){
    //                 io.to(gameId).emit("timer",{countDown:countdown.toString(),msg:"Starting Game"})
    //                 countdown-=1
    //             }
    //             else{
    //                 game.isOpen=false
    //                 game = await game.save()
    //                 io.to(gameId).emit("update-game",game)
    //                 startGameClock(gameId);
    //                 clearInterval(timerId);
    //             }
    //         },1000)
    //     }
    // })
    socket.on("gameStart",async({playerId,gameId})=>{
        console.log("gameStart")
        let game = await Game.findById(gameId)
        game.isOpen = false
        let player = game.players.find((player)=> player._id.toString() === playerId)
        if(player.isPartyLeader){
            
            let randomIndex = Math.floor(Math.random() * OPENINGDECK.length);
            let firstCard = OPENINGDECK[randomIndex]
            game.topMostCard = firstCard
            game.color = firstCard.charAt(firstCard.length -1)
            player.isActive = true
            game = await game.save()
            io.to(gameId).emit("update-game",game)
        }
    })
    socket.on("join-game",async({gameId:_id,nickName})=>{
        try{
            let game = await Game.findById(_id)
            if(game.isOpen){
                const gameId = game._id.toString()
                socket.join(gameId)
                let cardArray = []
                while(cardArray.length<7){
                    let randomIndex = Math.floor(Math.random() * PACKOFCARDS.length);
                    cardArray.push(PACKOFCARDS[randomIndex])
                }
                let player={
                    socketId:socket.id,
                    playerIndex:game.players.length,
                    cards:cardArray,
                    nickName
                }
                game.players.push(player)
                game = await game.save()
                io.to(gameId).emit("update-game",game)
            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on("create-game",async (nickName)=>{
        try{
            // const quotableData = await QuoatableAPI()
            let game = new Game()
            // let randomIndex = Math.floor(Math.random() * PACKOFCARDS.length);
            // let firstCard = PACKOFCARDS[randomIndex]
            // game.topMostCard = firstCard
            // game.color = firstCard.charAt(firstCard.length -1)
            let cardArray = []
            while(cardArray.length<7){
                let randomIndex = Math.floor(Math.random() * PACKOFCARDS.length);
                cardArray.push(PACKOFCARDS[randomIndex])
            }
            let player={
                socketId:socket.id,
                isPartyLeader:true,
                playerIndex:game.players.length,
                cards:cardArray,
                nickName
            }
            game.players.push(player)
            game = await game.save()
            const gameId = game._id.toString()
            socket.join(gameId)
            io.to(gameId).emit("update-game",game)
        }catch(err){
            console.log(err)
        }
    })
})

mongoose.connect("mongodb://localhost:27017/uno",()=>{console.log("Successfully connected to uno db")})
app.use(express.static('client/build'))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})
// mongoose.connect(process.env.MONGO_URL,()=>{console.log("Successfully connected to db")})

// const startGameClock =async(gameId)=>{
//     let game = await Game.findById(gameId)
//     game.startTime = new Date().getTime()
//     game = await game.save()
//     let time = 120
//     let timerId = setInterval(function gameIntervalFunc(){
//         const formatTime = calculateTime(time)
//         console.log(formatTime)
//         if(time>=0){
//             io.to(gameId).emit("timer",{countDown:formatTime,msg:"Time Remaining"})
//             time-=1
//         }
//         else{
//             (async()=>{
//                 let endTime = new Date().getTime()
//                 let game = await Game.findById(gameId)
//                 let {startTime} = game
//                 game.isOver = true
//                 game.players.forEach((player,index)=>{
//                     if(player.WPM === -1){
//                         game.players[index].WPM = calculateWPM(endTime,startTime,player)
//                     }
//                 })
//                 game = await game.save()
//                 io.to(gameId).emit("update-game",game)
//                 clearInterval(timerId)
//             })()

//         }
//         return gameIntervalFunc
//     }(),1000)
// }

// const calculateTime = (time)=>{
//     let minutes = Math.floor(time/60);
//     let seconds = time%60;
//     return `${minutes}:${seconds<10 ? "0"+seconds : seconds}`
// }

// const calculateWPM = (endTime,startTime,player)=>{
//     let numOfWords = player.currentWordIndex
//     const timeInSeconds = (endTime - startTime)/1000
//     const timeinMinutes = timeInSeconds/60
//     const WPM = Math.floor(numOfWords/timeinMinutes)
//     return WPM

// }