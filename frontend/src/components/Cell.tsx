import { CellData } from "../utils/types";

interface Props {
  row: number;
  col: number;
  cellData: CellData;
  isSelected: boolean;
  onCellClicked: (row: number, col: number, box: number) => void;
}

function Cell({ row, col, cellData, isSelected, onCellClicked }: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);

  return (
    <div
      className={`cell r${row} c${col} b${box} ${
        isSelected ? "selected" : ""
      } ${cellData.incorrect ? "incorrect" : ""}`}
      onClick={() => onCellClicked(row, col, box)}
    >
      <div className="cell-content">
        <div className={`cell-number + ${cellData.fixed ? "fixed" : ""}`}>
          {cellData.value ? cellData.value : ""}
        </div>
      </div>
      <div className="cell-content">
        <div className="cell-notes">
          {numbers.map((number) => (
            <div className="cell-notes-item" key={number}>
              {/* Conditionally render the number or an empty space */}
              {cellData.notes.includes(number) ? number : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cell;
