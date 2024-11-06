import { CiEraser } from "react-icons/ci";
import { PiPencil } from "react-icons/pi";
import ToggleButton from "./ToggleButton";

interface Props {
  isNotesToggled: boolean;
  onErase: () => void;
  onToggle: () => void;
}

function Controls({ isNotesToggled, onErase, onToggle }: Props) {
  return (
    <div className="controls">
      <div>
        <button onClick={() => onErase()}>
          <CiEraser />
        </button>
        <p>Erase</p>
      </div>
      <div>
        <ToggleButton toggled={isNotesToggled} onToggle={onToggle}>
          <PiPencil />
        </ToggleButton>
        <p>Notes</p>
      </div>
    </div>
  );
}

export default Controls;
