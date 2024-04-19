// import { useState, useEffect, useRef } from "react";

// const useMediaStream = () => {
//   const [stream, setStreamState] = useState(null);
//   const isStreamSet = useRef(false)

//   useEffect(() => {
//     if(isStreamSet.current) return;
//     isStreamSet.current=true;
//     (async function initStream() {
//       try {
//         const streamstate = navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         console.log("beginning your media stream");
//         setStreamState(streamstate);
//       } catch (e) {console.log("Error while getting media navigator",e)}
//     })();
//   }, []);

//   return stream;
// };

// export default useMediaStream;


import { useState, useEffect } from 'react';

const useMediaStream = () => {
    const [stream, setStream] = useState(null);

    useEffect(() => {
        const getMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        };

        getMedia();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return stream;
};

export default useMediaStream;
