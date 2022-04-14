import React,{useState} from 'react'
import socket from '../socketConfig'

const CreateGame = () => {
    const [nickName, setnickName] = useState("")
    const onChange=(e)=>{
        // console.log(nickName)
        setnickName(e.target.value)
    }

    const onSubmit = (e)=>{
        e.preventDefault()
        // console.log("hi",nickName)
        console.log("gsdaguygsda")
        socket.emit("create-game",nickName)
    }
    return (
        <div className='row mb-2'>
            <div className="col-sm"></div>
            <div className="col-sm-8">
                <h1 className="text-center">Create Game</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                    <label htmlFor="nickName">Enter Nick Name</label>
                    <input type="text" name="nickName" value={nickName} onChange={onChange} placeholder="Enter Nick Name" className="form-control"/>
                    </div>  
                    <button className="btn btn-primary" type="submit">Submit</button>            
                </form>
            </div>
            
            <div className="col-sm"></div>

            
        </div>
    )
}

export default CreateGame

