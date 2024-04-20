import ReactPlayer from "react-player";

import cx from "classnames";

import styles from "@/components/Player/index.module.css";

const Player = (props) => {
  const { playerid, url, muted, playing, isActive } = props;
  return (
    <div
      className={cx(styles.playerContainer, {
        [styles.notActive]: !isActive,
        [styles.active]: isActive,
        [styles.notPlaying]: !playing,
      })}
    >
      <ReactPlayer
        muted={muted}
        url={url}
        playing={playing}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default Player;
