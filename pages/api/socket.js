import { Server } from "socket.io"

const SocketInitApi=(req,res)=>{
    console.log("called socket init api");
    if(res.socket.server.io){
        console.log("server exists!");
    }else{
        const io= new Server(res.socket.server)
        res.socket.server.io=io

        io.on('connection',(socket)=>{
            console.log("New server connected!");   
        })
    }
    res.end();
}

export default SocketInitApi;
