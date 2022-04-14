import React,{useState} from 'react'
import socket from '../socketConfig'

const JoinGame = () => {
    const [userInput, setuserInput] = useState({gameId:"",nickName:""})
    const onChange=(e)=>{
        setuserInput({...userInput,[e.target.name]:e.target.value})
    }

    const onSubmit = (e)=>{
        e.preventDefault()
        socket.emit("join-game",userInput)
    }
    return (
        <div className='row'>
            <div className="col-sm"></div>
            <div className="col-sm-8">
                <h1 className="text-center">Join Game</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                    <label htmlFor="gameId">Enter Nick Name</label>
                    <input type="text" name="gameId" value={userInput.gameId} 
                                                       onChange={onChange} 
                                                       placeholder="Enter Game Id" 
                                                       className="form-control"/>
                    <input type="text" name="nickName" value={userInput.nickName} 
                                                       onChange={onChange} 
                                                       placeholder="Enter Nick Name" 
                                                       className="form-control"/>
                    </div>  
                    <button className="btn btn-primary" type="submit">Submit</button>            
                </form>

            </div>
            <div className="col-sm"></div>

            
        </div>
    )
}

export default JoinGame

