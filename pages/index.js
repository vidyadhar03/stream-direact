import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const createAndJoin = () => {
    const roomId = uuidv4();
    router.push(`/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId) {
      router.push(`/${roomId}`);
    } else {
      alert("Room ID is not provided.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center mt-20 mb-8 text-4xl font-semibold">
        STREAM DIRECT
      </div>
      <div className="border border-gray-400 rounded-xl shadow-xl flex flex-col px-12 py-8">
        <input
          placeholder="Enter a Room ID"
          className="border border-gray-800 p-4 my-2 rounded-lg"
          onChange={(e) => {
            setRoomId(e?.target?.value);
          }}
        ></input>
        <button
          className="w-96 rounded-md text-white bg-blue-400 px-6 py-2 mt-4 hover:bg-blue-600"
          onClick={joinRoom}
        >
          {" "}
          Join Room
        </button>
        <span className="my-2 flex justify-center text-gray-600">OR</span>
        <button
          className="w-96 rounded-md text-white bg-blue-400 px-6 py-2 hover:bg-blue-600"
          onClick={createAndJoin}
        >
          {" "} 
          Create a New Room
        </button>
      </div>
    </div>
  );
}
