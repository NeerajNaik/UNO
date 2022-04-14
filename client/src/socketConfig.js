import io from "socket.io-client"
//  const socket = io("http://localhost:3001",{transports: ['websocket']})

const socket = io("https://youno26.herokuapp.com/",{transports: ['websocket']})
 export default socket;