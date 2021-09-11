type CardValue = string;
export type CardIndex = number;

export type MatchContext = {
  flippedCards: Array<CardIndex>;
  board: Array<CardValue | undefined>;
  rows: number;
  columns: number;
};
