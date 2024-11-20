import { CiEraser, CiUndo, CiRedo } from "react-icons/ci";
import { PiPencil } from "react-icons/pi";

import ToggleButton from "./ToggleButton";
import "../styles/Sidebar.css";

interface Props {
  notesToggled: boolean;
  onErase: () => void;
  onToggle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onNumberClick: (number: number) => void;
	onCheck: () => void;
}

function Controls({
  notesToggled,
  onErase,
  onToggle,
  onUndo,
  onRedo,
  onNumberClick,
	onCheck
}: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="sidebar">
      <div className="controls">
        <div>
          <button onClick={onErase}>
            <CiEraser />
          </button>
          <p>Erase</p>
        </div>
        <div>
          <ToggleButton toggled={notesToggled} onToggle={onToggle}>
            <PiPencil />
          </ToggleButton>
          <p>Notes</p>
        </div>
        <div>
          <button onClick={onUndo}>
            <CiUndo />
          </button>
          <p>Undo</p>
        </div>
        <div>
          <button onClick={onRedo}>
            <CiRedo />
          </button>
          <p>Redo</p>
        </div>
      </div>
      <div className="numpad">
        {numbers.map((number) => (
          <button
            key={number}
            className="numpad-button"
            onClick={() => onNumberClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
			<div className="controls-2">
				<button onClick={onCheck} style={{padding: '10px 30px'}}>Check</button>
			</div>
    </div>
  );
}

export default Controls;
