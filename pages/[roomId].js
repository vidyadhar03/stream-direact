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
  const { players, setPlayers, playerHighlighted, nonHighlightedPlayers } =
    usePlayer(myId);

  useEffect(() => {
    if (!socket || !peer || !stream) return;

    const handleUserConnected = (newUser) => {
      console.log(`user connected in room with userId ${newUser}`);

      const call = peer.call(newUser, stream);

      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${newUser}`);

        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));
      });
    };

    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, socket, stream, setPlayers]);

  useEffect(() => {
    if (!peer || !stream) return;

    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));
      });
    });
  }, [peer, stream, setPlayers]);

  useEffect(() => {
    if (!stream || !myId) return;
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: false,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("your socket id is", socket.id);
    });
  }, [socket]);

  return (
    <>
      <div className="absolute w-9/12 left-0 right-0 mx-auto">
        {playerHighlighted && (
          <Player url={playerHighlighted.url} muted={playerHighlighted.muted} playing={playerHighlighted.playing} isActive={true} />
        )}
      </div>
      <div className="absolute flex flex-col overflow-y-auto">
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={stream}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
    </>
  );
};

export default room;
