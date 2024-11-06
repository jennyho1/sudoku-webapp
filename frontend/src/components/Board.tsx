import Cell from "./Cell";
import { CellData } from "./Game";

interface Props {
  board: CellData[][];
  selectedCell: {
    row: number;
    col: number;
    box: number;
  };
  onCellClick: (row: number, col: number, box: number) => void;
}

function Board({ board, selectedCell, onCellClick }: Props) {
  return (
    <div
      className={
        "board r" +
        selectedCell.row +
        " c" +
        selectedCell.col +
        " b" +
        selectedCell.box
      }
    >
      {board.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cellData, colIndex) => (
            <Cell
              row={rowIndex}
              col={colIndex}
              cellData={cellData}
              isSelected={
                selectedCell.row === rowIndex && selectedCell.col === colIndex
              }
              onCellClicked={onCellClick}
              key={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
