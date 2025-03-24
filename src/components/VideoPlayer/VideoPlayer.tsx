import { useRef, useState, useEffect, useCallback } from "react";
import Timeline from "../Timeline/Timeline";
import TrimBar from "../TrimBar/TrimBar";
import { generateThumbnails } from "../../utils/generateThumbnails";
import "./VideoPlayer.css";

const VIDEO_SAMPLE_URL =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  useEffect(() => {
    if (videoRef.current !== null) {
      videoRef.current.onloadedmetadata = async () => {
        const newThumbnails = await generateThumbnails(videoRef);
        if (newThumbnails) setThumbnails(newThumbnails);
        setDuration(videoRef.current!.duration);
        setTrimEnd(videoRef.current!.duration);
        setIsLoaded(true);
      };
    }
  }, [videoRef]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;

      if (current < trimStart) {
        videoRef.current.currentTime = trimStart;
        return;
      } else if (current > trimEnd) {
        videoRef.current.currentTime = trimEnd;
        videoRef.current.pause();
        setIsPlaying(false);
        return;
      }

      if (current - trimStart > 0) {
        setCurrentTime(current - trimStart);
      } else {
        setCurrentTime(current);
      }
    }
  };

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying((prev) => !prev);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const seekTo = useCallback(
    (time: number) => {
      if (videoRef.current) {
        const clampedTime = Math.max(trimStart, Math.min(trimEnd, time));
        videoRef.current.currentTime = clampedTime;
        setCurrentTime(clampedTime - trimStart);
      }
    },
    [trimStart, trimEnd, videoRef]
  );

  const handleTrimStateChange = (isStart: boolean, newPos: number) => {
    if (isStart) {
      const newTrimStart = newPos;
      if (newTrimStart > trimEnd - newTrimStart) {
        setCurrentTime(0);
        if (videoRef.current) {
          videoRef.current.currentTime = newTrimStart;
        }
      }
      setTrimStart(newTrimStart);
    } else {
      const newTrimEnd = newPos;
      if (currentTime + trimStart > newTrimEnd) {
        setCurrentTime(newTrimEnd - trimStart);
        if (videoRef.current) {
          videoRef.current.currentTime = newTrimEnd;
        }
      }
      setTrimEnd(newTrimEnd);
    }
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        muted={isMuted}
        style={{ display: isLoaded ? "block" : "none" }}
        crossOrigin="anonymous"
      >
        <source src={VIDEO_SAMPLE_URL} type="video/mp4" />
      </video>
      {isLoaded && (
        <>
          <Timeline
            currentTime={currentTime}
            duration={trimEnd - trimStart}
            isMuted={isMuted}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            toggleMute={toggleMute}
            seekTo={seekTo}
            trimStart={trimStart}
          />
          <TrimBar
            trimStart={trimStart}
            trimEnd={trimEnd}
            frames={thumbnails}
            duration={duration}
            handleTrimStateChange={handleTrimStateChange}
          />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
