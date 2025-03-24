import { FC } from "react";
import { modifyTimeToString } from "../../utils/modifyTimeToString";

interface EditLineProps {
  position: number;
  onMouseDown: () => void;
  time: number;
}
const EditLine: FC<EditLineProps> = ({ position, onMouseDown, time }) => {
  const stringTime = modifyTimeToString(time);
  return (
    <div
      className="trim-handle"
      style={{ left: `${position}px` }}
      onMouseDown={onMouseDown}
    >
      <div className="tooltip">{stringTime}</div>
    </div>
  );
};

export default EditLine;
