import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/components/Player";
import { useEffect } from "react";

const room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const stream = useMediaStream();

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("your socket id is", socket.id);
    });
  }, [socket]);

  return (
    <div className="flex justify-center">
        <Player url={stream} muted playing playerid={myId} />
    </div>
  );
};

export default room;
