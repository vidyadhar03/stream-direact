import { Server } from "socket.io"

export const SocketInitApi=(req,res)=>{
    if(res.socket.server.io){
        console.log("server exists!");
    }else{
        const io= new Server(res.socket.server)
        res.socket.server=io

        io.on('connection',(socket)=>{
            console.log("New server connected!");
        })
    }
    res.end();
}
