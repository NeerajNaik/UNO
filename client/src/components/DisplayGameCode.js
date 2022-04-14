import React,{useRef,useState} from 'react'
import "./DisplayGameCode.css"
const DisplayGameCode = ({gameId}) => {
    const [copySuccess, setcopySuccess] = useState(false)
    const textInputRef = useRef(null)
    const copyToClipBoard = ()=>{
        textInputRef.current.select()
        document.execCommand("copy")
        setcopySuccess(true)
    }

    return (
        <div className="row my-3 text-center gameCode">
            <div className="col-sm"></div>
            <div className="col-sm-8">
                <p>Send This Code To your Friends To Join</p>
                <div className="input-group mb-3">
                    <input type="text"  value={gameId}
                                        ref={textInputRef}
                                        readOnly 
                                        className="form-control"/>
                </div>
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={copyToClipBoard}>
                        Copy Game Code
                    </button>
                </div>
                
                {copySuccess ? <div className="alert alert-success" 
                                    role="alert">Successfully Copied Game Code
                                </div>:null}
            </div>
            
            <div className="col-sm"></div>  
        </div>
    )
}

export default DisplayGameCode
