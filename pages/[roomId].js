import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/components/Player";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { cloneDeep } from "lodash";
import Bottom from "@/components/Bottom";

const room = () => {
  const socket = useSocket();
  const { roomId } = useRouter().query;
  const { peer, myId } = usePeer();
  const stream = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId,peer);

  const [users, setUsers] = useState([])

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

        setUsers((prev)=>({
          ...prev,
          [newUser]: call
        }))

      });
    };

    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, socket, stream, setPlayers]);

  useEffect(() => {
    if (!socket) return;
    const handleToggleAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);
    };
  }, [players, setPlayers, socket, users]);

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

        setUsers((prev)=>({
          ...prev,
          [callerId]: call
        }))

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
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive={true}
          />
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
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default room;
