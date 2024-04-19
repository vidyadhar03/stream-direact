import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/components/Player";
import usePlayer from "@/hooks/usePlayer";
import { useEffect } from "react";

const room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const stream = useMediaStream();
  const {players,setPlayers} = usePlayer();

  useEffect(()=>{
    if(!socket || !peer || !stream) return;

    const handleUserConnected = (newUser) =>{
      console.log(`user connected in room with userId ${newUser}`);

      const call = peer.call(newUser,stream)

      call.on('stream',(incomingStream)=>{
        console.log(`incoming stream from ${newUser}`);

        setPlayers((prev)=>({
          ...prev,
          [newUser]:{
            url:incomingStream,
            muted:false,
            playing:true
          }
        }))

      })
    }

    socket.on('user-connected',handleUserConnected);

    return ()=> {
      socket.off('user-connected',handleUserConnected);
    }
  },[peer,socket,stream,setPlayers])

  useEffect(()=>{
    if(!peer || !stream) return;

    peer.on('call',(call)=>{
      const {peer:callerId} = call;
      call.answer(stream)
      call.on('stream',(incomingStream)=>{
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev)=>({
          ...prev,
          [callerId]:{
            url:incomingStream,
            muted:false,
            playing:true
          }
        }))
      })
    })
  },[peer,stream,setPlayers])

  useEffect(()=>{
    if(!stream || !myId) return;
    setPlayers((prev)=>({
      ...prev,
      [myId]:{
        url:stream,
        muted:false,
        playing:true
      }
    }))
  },[myId,setPlayers,stream])

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("your socket id is", socket.id);
    });
  }, [socket]);

  return (
    <div className="flex flex-col justify-center">
      {Object.keys(players).map((playerId)=>{
        const  {url,muted,playing} = players[playerId]
        return <Player key={playerId} url={stream} muted={muted} playing={playing} />
      })}
        
    </div>
  );
};

export default room;
