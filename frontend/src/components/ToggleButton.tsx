import { ReactNode } from "react";

interface Props {
  toggled: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function ToggleButton({ toggled, onToggle, children }: Props) {
  return (
    <button className="toggle" onClick={onToggle}>
      {children}
      <div className={"toggle-indicator " + toggled}>
        {toggled ? "On" : "Off"}
      </div>
    </button>
  );
}

export default ToggleButton;
