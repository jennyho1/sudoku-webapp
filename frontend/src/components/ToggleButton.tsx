import { ReactNode } from "react";

interface Props {
  toggled: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function ToggleButton({ toggled, onToggle, children }: Props) {
  return (
    <div className="toggle-container">
      <button className="toggle" onClick={onToggle}>
        {children}
      </button>
      <div className={"toggle-indicator " + toggled}>
        {toggled ? "On" : "Off"}
      </div>
    </div>
  );
}

export default ToggleButton;
