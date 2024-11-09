import { getSudoku } from "sudoku-gen";

export type CellData = {
  value: number | null;
  notes: number[];
  fixed: boolean;
	incorrect: boolean;
};

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Expert = "expert",
}

let solution: string = "";

function setSolution(newSolution: string): void {
	solution = newSolution;
}

// Function to get the solution, if needed
export function getSolution(): string {
	return solution;
}


export function createBoard(difficulty: Difficulty): CellData[][] {
  const sudoku = getSudoku(difficulty);
  setSolution(sudoku.solution);
  const board = parseSudokuBoard(sudoku.puzzle);
  return board;
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

