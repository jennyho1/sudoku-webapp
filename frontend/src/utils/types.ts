export type CellData = {
  value: number | null;
  notes: number[];
  fixed: boolean;
	incorrect: boolean;
};

export type CellState = {
  row: number;
  col: number;
  state: CellData;
};

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Expert = "expert",
}