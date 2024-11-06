import { CiEraser, CiUndo, CiRedo } from "react-icons/ci";
import { PiPencil } from "react-icons/pi";
import ToggleButton from "./ToggleButton";

interface Props {
  notesToggled: boolean;
  onErase: () => void;
  onToggle: () => void;
	onUndo: () => void;
  onRedo: () => void;
}

function Controls({ notesToggled, onErase, onToggle, onUndo, onRedo }: Props) {
  return (
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
  );
}

export default Controls;
