import { getSudoku } from "sudoku-gen";
import { useState, ChangeEvent } from "react";
import Board from "./Board";
import Numpad from "./Numpad";
import Controls from "./Controls";
import Settings from "./Settings";

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

enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Expert = "expert",
}

const createBoard = (difficulty: Difficulty): CellData[][] => {
  const sudoku = getSudoku(difficulty);
  const board = parseSudokuBoard(sudoku.puzzle);
  return board;
};

function parseSudokuBoard(boardString: string): CellData[][] {
  const board: CellData[][] = [];

  for (let row = 0; row < 9; row++) {
    const rowCells: CellData[] = [];
    for (let col = 0; col < 9; col++) {
      const char = boardString[row * 9 + col];
      const value = char === "-" ? null : parseInt(char);
      rowCells.push({
        value,
        fixed: value !== null,
        notes: [],
      });
    }
    board.push(rowCells);
  }

  return board;
}

function Game() {
  const [board, setBoard] = useState<CellData[][]>(
    createBoard(Difficulty.Easy)
  );
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
    box: number;
  }>({ row: -1, col: -1, box: -1 });
  const [notesToggled, setNotesToggle] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<CellState[]>([]);
  const [redoStack, setRedoStack] = useState<CellState[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [theme, setTheme] = useState<string>("purple");

  const resetGame = () => {
    setSelectedCell({ row: -1, col: -1, box: -1 });
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setDifficulty(()=>{
			createNewGame(event.target.value as Difficulty);
			return event.target.value as Difficulty
		});

  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  const handleNewGame = () => {
    createNewGame(difficulty)
  };

	const createNewGame = (gameDifficulty: Difficulty) => {
    resetGame();
    setBoard(createBoard(gameDifficulty));
  };

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
              savePreviousState(rowIndex, colIndex, cellData);
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
    <div className={"game-container " + theme}>
      <div className="main">
        <Settings
          onDifficultyChange={handleDifficultyChange}
					onThemeChange={handleThemeChange}
          onNewGame={handleNewGame}
        />
        <Board
          board={board}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />
      </div>

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
