import ReactPlayer from "react-player"

const Player = (props) => {
    const {playerid,url,muted, playing} = props
    return(
        <div>
            <ReactPlayer key={playerid} muted={muted} url={url} playing={playing} />
        </div>
    )
}

export default Player;