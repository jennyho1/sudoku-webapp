import { useState } from "react";
import Board from "./Board";
import Numpad from "./Numpad";
import Controls from "./Controls";

export type CellData = {
  value: number | null;
  notes: number[];
  fixed: boolean;
};

// 9x9 array with initial values (0 represents empty cells)
const initialBoard = [
  [1, 3, 0, 0, 0, 4, 0, 0, 0],
  [9, 8, 0, 0, 7, 0, 2, 4, 1],
  [6, 7, 0, 8, 0, 1, 3, 0, 0],
  [0, 0, 8, 0, 0, 2, 9, 3, 5],
  [0, 0, 0, 0, 1, 7, 4, 8, 0],
  [0, 0, 3, 0, 0, 0, 7, 0, 0],
  [4, 0, 0, 1, 0, 6, 0, 9, 3],
  [3, 6, 9, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 9, 0, 0, 4],
];

const createBoard = (initialBoard: number[][]): CellData[][] => {
  return initialBoard.map((row) =>
    row.map((cellValue) => ({
      value: cellValue || null,
      notes: [],
      fixed: cellValue !== 0,
    }))
  );
};

function Game() {
  const [board, setBoard] = useState<CellData[][]>(createBoard(initialBoard));
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
    box: number;
  }>({ row: -1, col: -1, box: -1 });
  const [isNotesToggled, setNotesToggle] = useState<boolean>(false);

  const handleToggle = () => setNotesToggle(!isNotesToggled);

  const handleCellClick = (row: number, col: number, box: number) => {
    setSelectedCell((prev) =>
      prev.row === row && prev.col === col
        ? { row: -1, col: -1, box: -1 }
        : { row, col, box }
    );
  };

  const handleErase = () => {
    if (selectedCell.row !== -1 && selectedCell.col !== -1) {
      const updatedBoard = [...board];
      updatedBoard[selectedCell.row][selectedCell.col].value = null;
      updatedBoard[selectedCell.row][selectedCell.col].notes = [];
      setBoard(updatedBoard);
    }
  };

  const handleNumberClick = (number: number) => {
    const { row, col } = selectedCell;
    if (row === -1 || col === -1 || board[row][col].fixed) return;

    const updatedBoard = [...board];
    const cell = updatedBoard[row][col];
    if (isNotesToggled) {
      cell.value = null;
      if (cell.notes.includes(number)) {
        cell.notes = cell.notes.filter((num) => num !== number);
      } else {
        cell.notes.push(number);
      }
    } else {
      cell.value = number;
      cell.notes = [];
    }

    setBoard(updatedBoard);
  };

  return (
    <div className="game-container">
      <Board
        board={board}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />

      <div className="sidebar">
        <Controls
          isNotesToggled={isNotesToggled}
          onErase={handleErase}
          onToggle={handleToggle}
        />
        <Numpad onNumberClick={handleNumberClick} />
      </div>
    </div>
  );
}

export default Game;
