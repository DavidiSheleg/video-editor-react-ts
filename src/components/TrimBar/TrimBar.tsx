import { useState, useRef, useEffect, FC, memo } from "react";
import "./trimbar.css";
import EditLine from "./EditLine";

interface TrimBarProps {
  trimStart: number;
  trimEnd: number;
  frames: string[];
  duration: number;
  handleTrimStateChange: (isStart: boolean, newPos: number) => void;
}

const TrimBar: FC<TrimBarProps> = memo(
  ({ trimStart, trimEnd, frames, duration, handleTrimStateChange }) => {
    const [positionStart, setPositionStart] = useState<number>(0);
    const [positionEnd, setPositionEnd] = useState<number>(0);
    const [isDraggingFirstLine, setIsDraggingFirstLine] =
      useState<boolean>(false);
    const [isDraggingSecondLine, setisDraggingSecondLine] =
      useState<boolean>(false);
    const trimBarRef = useRef<HTMLDivElement>(null);

    const MIN_DISTANCE = 50;

    useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        if (trimBarRef.current) {
          const rect = trimBarRef.current.getBoundingClientRect();
          let newPosition = event.clientX - rect.left;
          newPosition = Math.max(0, Math.min(newPosition, rect.width));

          if (isDraggingFirstLine) {
            if (newPosition < positionEnd - MIN_DISTANCE) {
              setPositionStart(newPosition);
              handleTrimStateChange(
                true,
                calculateTimeFromPosition(newPosition)
              );
            }
          } else if (isDraggingSecondLine) {
            if (newPosition > positionStart + MIN_DISTANCE) {
              setPositionEnd(newPosition);
              handleTrimStateChange(
                false,
                calculateTimeFromPosition(newPosition)
              );
            }
          }
        }
      };

      const handleMouseUp = () => {
        setIsDraggingFirstLine(false);
        setisDraggingSecondLine(false);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDraggingFirstLine, isDraggingSecondLine]);

    const handleMouseDownFirstLine = () => {
      setIsDraggingFirstLine(true);
    };

    const handleMouseDownSecondLine = () => {
      setisDraggingSecondLine(true);
    };

    const calculateTimeFromPosition = (position: number) => {
      if (trimBarRef.current) {
        const rect = trimBarRef.current.getBoundingClientRect();
        return (position / rect.width) * duration;
      }
      return 0;
    };

    const calculatePositionFromTime = (time: number) => {
      if (trimBarRef.current) {
        const rect = trimBarRef.current.getBoundingClientRect();
        return (time / duration) * rect.width;
      }
      return 0;
    };

    useEffect(() => {
      setPositionStart(calculatePositionFromTime(trimStart));
      setPositionEnd(calculatePositionFromTime(trimEnd));
    }, [trimStart, trimEnd, duration]);

    return (
      <div className="trimBarWrap">
        <div className="trimBarConatiner" ref={trimBarRef}>
          {frames.map((frame, index) => (
            <div key={index} className="trim-bar-frame">
              <img
                className="trim-bar-image"
                src={frame}
                alt={`Frame ${index}`}
                unselectable="on"
              />
            </div>
          ))}
          <EditLine
            time={trimStart}
            position={positionStart}
            onMouseDown={handleMouseDownFirstLine}
          />
          <EditLine
            time={trimEnd}
            position={positionEnd}
            onMouseDown={handleMouseDownSecondLine}
          />

          <div
            className="trim-bar-overlay-left"
            style={{ width: `${positionStart}px` }}
          />
          <div
            className="trim-bar-overlay-right"
            style={{ left: `${positionEnd + 5}px`, right: 0 }}
          />
          <div
            className="trim-bar-between"
            style={{
              left: `${positionStart}px`,
              width: `${positionEnd - positionStart + 5}px`,
            }}
          />
        </div>
      </div>
    );
  }
);

export default TrimBar;
