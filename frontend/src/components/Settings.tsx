import { ChangeEvent } from "react";
import "../styles/Settings.css";

interface Props {
  onDifficultyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onThemeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onNewGame: () => void;
}

function Settings({ onDifficultyChange, onThemeChange, onNewGame }: Props) {
  return (
    <div className="settings">
      <div className="settings-item">
        <label>
          Difficulty:
          <select
            name="difficulties"
            id="difficulties"
            defaultValue="easy"
            onChange={onDifficultyChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </label>
      </div>
      <div className="settings-item">
        <label>
          Theme:
          <select
            name="themes"
            id="themes"
            defaultValue="purple"
            onChange={onThemeChange}
          >
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
          </select>
        </label>
      </div>
      <div className="settings-item">
        <button onClick={onNewGame}>New Game</button>
      </div>
    </div>
  );
}

export default Settings;
