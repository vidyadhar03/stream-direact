import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(socketContext);
  return socket;
};

export const SocketProvider = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connection = io();
    console.log("socket connection", connection);
    setSocket(socketContext);
  }, []);

  socket?.on("connect_error", async (err) => {
    console.log("Error establishing socket", err);
    await fetch("/api/socket");
  });

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};
