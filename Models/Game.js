const mongoose = require("mongoose")

const playerSchema = new mongoose.Schema({
    cards:[{type:String}],
    socketId:{
        type:String
    },
    isPartyLeader:{
        type:Boolean,
        default:false
    },
    nickName:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:false
    },
    playerIndex:{
        type:Number
    }

});

const gameSchema = new mongoose.Schema({
    // pileOfCards:[{type:String}],
    isOpen:{
        type:Boolean,
        default:true
    },
    isOver:{
        type:Boolean,
        default:false
    },
    players:[playerSchema],
    operator:{
        type:String,
        default:"+"
    },
    color:{
        type:String
    },
    penalty:{
        type:Number,
        default:0
    },
    penaltyAdditionAlarm:{
        type:Boolean,
        default:false
    },
    topMostCard:{
        type:String
    },
    uno:{
        type:Boolean,
        default:false
    },
    caught:{
        type:Boolean,
        default:false
    }
    // startTime:{
    //     type:Number
    // }
});

module.exports = mongoose.model('Game',gameSchema)
