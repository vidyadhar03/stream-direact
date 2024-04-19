const { useState, useEffect,useRef } = require("react")

const usePeer = () =>{
    const [peer,setPeer] = useState(null)
    const [myId,setmyId] = useState('')
    let isPeerSet = useRef(false)

    useEffect(()=>{
        if(isPeerSet.current) return;
        isPeerSet.current=true;
        let myPeer;
        (async function initPeer(){
            myPeer = new (await import('peerjs')).default()
            setPeer(myPeer)

            myPeer.on('open',(id)=>{
                console.log("your peer id is",id);
                setmyId(id);
            })
        })()
    })

    return{peer,myId};
}

export default usePeer;