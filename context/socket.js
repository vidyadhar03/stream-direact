import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(socketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState(null);

  

  useEffect(() => {
    console.log("context mounted ");
     
    // Initialize the socket connection
    const connection = io();
    console.log("socket connection", connection);

    // Set up the socket event listeners
    connection.on('connect_error', async (err) => {
      console.log("Error establishing socket", err);
      await fetch('/api/socket');
    });

    // Store the socket in state
    setSocket(connection);

    // Clean up function to disconnect the socket when the component unmounts
    // return () => connection.disconnect(); 
  }, []);

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};
