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

            socket?.on('join-room',(roomId,userid)=>{
                console.log(`New user ${userid} in room ${roomId}`);
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-connected',userid);
            })

            socket?.on('user-toggle-audio',(userId,roomId)=>{
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-toggle-audio',userId);
            })

            socket?.on('user-toggle-video',(userId,roomId)=>{
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-toggle-video',userId);
            })

            socket?.on('user-leave',(userId,roomId)=>{
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-leave',userId);
            })


        })
    }
    res.end();
}

export default SocketInitApi;
