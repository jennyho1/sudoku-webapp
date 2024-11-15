import { useState, ChangeEvent, useEffect } from "react";
import "../styles/Board.css";
import Board from "./Board";
import Controls from "./Controls";
import Settings from "./Settings";
import Modal from "./Modal";
import { createBoard, getSolution } from "../utils/board";
import { CellData, CellState, Difficulty } from "../utils/types";

function Game() {
  const [board, setBoard] = useState<CellData[][]>([]);
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
  const [showSolvedModal, setShowSolvedModal] = useState<boolean>(false);
  const [showNewGameModal, setShowNewGameModal] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);

  useEffect(() => initializeBoard(), []);

  const initializeBoard = () => setBoard(createBoard(Difficulty.Easy));

  const resetGame = () => {
    setSelectedCell({ row: -1, col: -1, box: -1 });
    setUndoStack([]);
    setRedoStack([]);
  };

  const createNewGame = (gameDifficulty: Difficulty) => {
    if (undoStack.length > 0 && !showNewGameModal) {
      setShowNewGameModal(true);
      return;
    }
    resetGame();
    setBoard(createBoard(gameDifficulty));
    setShowSolvedModal(false);
    setShowNewGameModal(false);
    setSolved(false);
  };

  const handleCellClick = (row: number, col: number, box: number) => {
    if (solved) return;
    setSelectedCell((prev) =>
      prev.row === row && prev.col === col
        ? { row: -1, col: -1, box: -1 }
        : { row, col, box }
    );
  };

  const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(() => {
      createNewGame(event.target.value as Difficulty);
      return event.target.value as Difficulty;
    });
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setTheme(event.target.value);

  const handleToggle = () => setNotesToggle(!notesToggled);

  const handleNewGame = () => createNewGame(difficulty);

  const savePreviousState = (row: number, col: number, state: CellData) => {
    setUndoStack((prev) => [...prev, { row, col, state }]);
    setRedoStack([]); // Clear redo stack after a new move
  };

  const handleErase = () => {
    if (selectedCell.row === -1 && selectedCell.col === -1) return;

    setBoard(
      board.map((row, rowIndex) =>
        row.map((cellData, colIndex) => {
          if (rowIndex === selectedCell.row && colIndex === selectedCell.col) {
            savePreviousState(rowIndex, colIndex, cellData);
            return { ...cellData, value: null, notes: [], incorrect: false };
          }
          return cellData;
        })
      )
    );
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
                incorrect: false,
              };
            } else if (cellData.value !== number) {
              return {
                ...cellData,
                value: number,
                notes: [],
                incorrect: false,
              };
            }
          }
          return cellData;
        })
      )
    );
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

  const handleCheck = () => {
    const solution = getSolution();
    let correct = true;

    setBoard(
      board.map((row, rowIndex) =>
        row.map((cellData, colIndex) => {
          if (cellData.value !== parseInt(solution[rowIndex * 9 + colIndex])) {
            correct = false;
            return { ...cellData, incorrect: true };
          }
          return cellData;
        })
      )
    );

    if (correct) {
      setShowSolvedModal(true);
      setSolved(true);
      resetGame();
    }
  };

  return (
    <>
      <div className={`game-container ${theme}`}>
        <div className={`main ${solved ? "solved" : ""}`}>
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

        <Controls
          notesToggled={notesToggled}
          onErase={handleErase}
          onToggle={handleToggle}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onNumberClick={handleNumberClick}
          onCheck={handleCheck}
        />
      </div>
      {showSolvedModal && (
        <Modal onClose={() => setShowSolvedModal(false)}>
          <p>Congratulations! You solved sudoku on {difficulty} mode.</p>
          <button onClick={handleNewGame}>Play New Game</button>
        </Modal>
      )}

      {showNewGameModal && (
        <Modal onClose={() => setShowNewGameModal(false)}>
          <p>Start a new game?</p>
          <p>Current game progress will be lost</p>
          <div style={{ display: "flex", justifyContent: "space-evenly", marginBottom:"8px" }}>
            <button onClick={handleNewGame}>OK</button>
            <button onClick={() => setShowNewGameModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Game;
