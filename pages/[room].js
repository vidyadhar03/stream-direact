import { useSocket } from "@/context/socket"
import usePeer from "@/hooks/usePeer"
import { useEffect } from "react"

const room = ()=>{
    const socket = useSocket()
    const {peer,myId} = usePeer()

    useEffect(()=>{
        socket?.on("connect",()=>{
            console.log("your socket id is",socket)
        })
    },[socket])

    return(<div>
        room page
    </div>)
    
}

export default room;