import Image from "next/image";
import { Inter } from "next/font/google";
import { useSocket } from "@/context/socket";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  const socket = useSocket();

  useEffect(()=>{
    console.log("index mounted")
    socket?.on("connect",()=>{
      console.log(socket.id);
    })
  },[socket])

  return (
    <div className="flex justify-center items-center h-screen">Welcome</div>
  );
}
