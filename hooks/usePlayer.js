import { useState } from "react"
import { clone, cloneDeep } from "lodash";
import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";

const usePlayer = (myId,roomId,peer) =>{
    const socket = useSocket();
    const [ players,setPlayers] = useState({});
    const playerscopy = cloneDeep(players);
    const router = useRouter();
    const playerHighlighted = playerscopy[myId];
    delete playerscopy[myId];

    const nonHighlightedPlayers = playerscopy;

    const leaveRoom = () => {
        socket.emit('user-leave', myId, roomId)
        console.log("leaving room", roomId)
        peer?.disconnect();
        router.push('/')
    }

    const toggleAudio = () =>{
        setPlayers((prev)=>{
            const copy = cloneDeep(prev);
            copy[myId].muted=!copy[myId].muted;
            return {...copy};
        })

        socket.emit('user-toggle-audio',myId,roomId)
    }

    const toggleVideo = () =>{
        setPlayers((prev)=>{
            const copy = cloneDeep(prev);
            copy[myId].playing=!copy[myId].playing;
            return {...copy};
        })

        socket.emit('user-toggle-video',myId,roomId)
    }


    return {players,setPlayers,playerHighlighted,nonHighlightedPlayers,toggleAudio,toggleVideo, leaveRoom};
}

export default usePlayer;