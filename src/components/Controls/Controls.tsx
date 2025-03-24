import React from "react";
import "./controls.css";
import muteIcon from "../../assets/volume_on.svg";
import unmuteIcon from "../../assets/volume_off.svg";
import playIcon from "../../assets/play_icon.svg";
import pauseIcon from "../../assets/pause_icon.svg";

interface ControlsProps {
  currentTimeString: string;
  durationString: string;
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  currentTimeString,
  durationString,
  isPlaying,
  isMuted,
  togglePlay,
  toggleMute,
}) => {
  return (
    <div className="controls">
      <div className="button" onClick={toggleMute}>
        <img
          src={isMuted ? unmuteIcon : muteIcon}
          alt={isMuted ? "unmute" : "mute"}
        />
      </div>
      <div className="button" onClick={togglePlay}>
        <img
          src={isPlaying ? pauseIcon : playIcon}
          alt={isPlaying ? "pause" : "play"}
        />
      </div>
      <div className="time">
        <span>{`${currentTimeString} / `}</span>
        <span>{durationString}</span>
      </div>
    </div>
  );
};

export default Controls;
