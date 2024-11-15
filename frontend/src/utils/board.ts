import { getSudoku } from "sudoku-gen";
import { CellData, Difficulty } from "./types"

let solution: string = "";

function setSolution(newSolution: string): void {
	solution = newSolution;
}

export function getSolution(): string {
	return solution;
}

export function createBoard(difficulty: Difficulty): CellData[][] {
  const sudoku = getSudoku(difficulty);
  setSolution(sudoku.solution);
  return parseSudokuBoard(sudoku.puzzle);
};

export function parseSudokuBoard(boardString: string): CellData[][] {
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
				incorrect: false
      });
    }
    board.push(rowCells);
  }

  return board;
}

