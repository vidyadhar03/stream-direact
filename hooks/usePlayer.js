import { useState } from "react"
import { cloneDeep } from "lodash";

const usePlayer = (myId) =>{
    const [ players,setPlayers] = useState({});
    const playerscopy = cloneDeep(players);

    const playerHighlighted = playerscopy[myId];
    delete playerscopy[myId];

    const nonHighlightedPlayers = playerscopy;


    return {players,setPlayers,playerHighlighted,nonHighlightedPlayers};
}

export default usePlayer;