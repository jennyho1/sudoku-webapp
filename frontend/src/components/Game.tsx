import { useState } from "react";
import Board from "./Board";
import Numpad from "./Numpad";
import Controls from "./Controls";

export type CellData = {
  value: number | null;
  notes: number[];
  fixed: boolean;
};

type CellState = {
  row: number;
  col: number;
  state: CellData;
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
  const [notesToggled, setNotesToggle] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<CellState[]>([]);
  const [redoStack, setRedoStack] = useState<CellState[]>([]);

  const handleToggle = () => setNotesToggle(!notesToggled);

  const handleCellClick = (row: number, col: number, box: number) => {
    setSelectedCell((prev) =>
      prev.row === row && prev.col === col
        ? { row: -1, col: -1, box: -1 }
        : { row, col, box }
    );
  };

  const handleErase = () => {
    if (selectedCell.row !== -1 && selectedCell.col !== -1) {
      setBoard(
        board.map((row, rowIndex) =>
          row.map((cellData, colIndex) => {
            if (
              rowIndex === selectedCell.row &&
              colIndex === selectedCell.col
            ) {
              return { ...cellData, value: null, notes: [] };
            }
            return cellData;
          })
        )
      );
    }
  };

  const handleNumberClick = (number: number) => {
    if (selectedCell.row === -1 && selectedCell.col === -1) return;

    setBoard(
      board.map((row, rowIndex) =>
        row.map((cellData, colIndex) => {
          if (rowIndex === selectedCell.row && colIndex === selectedCell.col) {
            if (notesToggled || number !== cellData.value)
              savePreviousState(rowIndex, colIndex, cellData);
            if (notesToggled) {
              return {
                ...cellData,
                value: null,
                notes: cellData.notes.includes(number)
                  ? cellData.notes.filter((num) => num !== number)
                  : [...cellData.notes, number],
              };
            } else if (cellData.value !== number) {
              return {
                ...cellData,
                value: number,
                notes: [],
              };
            }
          }
          return cellData;
        })
      )
    );
  };

  const savePreviousState = (
    row: number,
    col: number,
    previousState: CellData
  ) => {
    setUndoStack((prev) => [...prev, { row, col, state: previousState }]);
    setRedoStack([]); // Clear redo stack after a new move
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [
      ...prev,
      { ...lastState, state: board[lastState.row][lastState.col] },
    ]);

    setBoard(
      board.map((row, rowIndex) =>
        row.map((cellData, colIndex) =>
          rowIndex === lastState.row && colIndex === lastState.col
            ? lastState.state
            : cellData
        )
      )
    );
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const lastUndoneState = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [
      ...prev,
      {
        ...lastUndoneState,
        state: board[lastUndoneState.row][lastUndoneState.col],
      },
    ]);

    setBoard(
      board.map((row, rowIndex) =>
        row.map((cellData, colIndex) =>
          rowIndex === lastUndoneState.row && colIndex === lastUndoneState.col
            ? lastUndoneState.state
            : cellData
        )
      )
    );
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
          notesToggled={notesToggled}
          onErase={handleErase}
          onToggle={handleToggle}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
        <Numpad onNumberClick={handleNumberClick} />
      </div>
    </div>
  );
}

export default Game;
