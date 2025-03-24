import React, { FC } from "react";
import Controls from "../Controls/Controls";
import { modifyTimeToString } from "../../utils/modifyTimeToString";
import "./timeline.css";

interface TimelineProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  trimStart: number;
}

const Timeline: FC<TimelineProps> = ({
  currentTime,
  duration,
  isPlaying,
  isMuted,
  togglePlay,
  toggleMute,
  seekTo,
  trimStart,
}) => {
  let progress = (currentTime / duration) * 100;
  if (progress > 100) progress = 100;

  const currentTimeString = modifyTimeToString(currentTime);
  const durationString = modifyTimeToString(duration);

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const timeline = event.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = trimStart + (clickX / rect.width) * duration;
    seekTo(newTime);
  };

  return (
    <div className="timelineContainer">
      <Controls
        currentTimeString={currentTimeString}
        durationString={durationString}
        isPlaying={isPlaying}
        isMuted={isMuted}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
      />
      <div className="timeline" onClick={handleProgressClick}>
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default Timeline;
