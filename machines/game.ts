import { assign, createMachine } from "xstate";

type CardValue = string;
type CardIndex = number;

type GameContext = {
  flippedCards: Array<CardIndex>;
  board: Array<CardValue | undefined>;
  rows: number;
  columns: number;
};

type FlipCardEvent = {
  type: "FLIP_CARD";
  index: CardIndex;
};

type GameEvent = FlipCardEvent;

const flipCard = assign<GameContext, GameEvent>((context, event) => ({
  flippedCards: context.flippedCards.concat(event.index),
}));

const untapCards = assign<GameContext, GameEvent>(() => ({
  flippedCards: [],
}));

const removeFlippedCards = assign<GameContext, GameEvent>((context) => {
  const [first, second] = context.flippedCards;
  let updatedBoard = context.board;
  updatedBoard[first] = undefined;
  updatedBoard[second] = undefined;

  return {
    flippedCards: [],
    board: updatedBoard,
  };
});

const flippedCardsAreMatching = (context: GameContext) => {
  const [first, second] = context.flippedCards;
  return context.board[first] === context.board[second];
};

const hasNoAvailableCards = (context: GameContext) => {
  return context.board.every((card) => card === undefined);
};

export const gameMachine = createMachine<GameContext, GameEvent>(
  {
    id: "Game",
    initial: "idle",
    context: {
      flippedCards: [],
      board: ["a", "b", "a", "b"],
      columns: 2,
      rows: 2,
    },
    states: {
      idle: {
        on: {
          FLIP_CARD: {
            target: "flipedFirstCard",
            actions: "flipCard",
          },
        },
      },
      flipedFirstCard: {
        on: {
          FLIP_CARD: {
            target: "checkResult",
            actions: "flipCard",
          },
        },
      },
      checkResult: {
        after: {
          1000: [
            {
              target: "success",
              cond: "flippedCardsAreMatching",
              actions: "removeFlippedCards",
            },
            { target: "fail", actions: "untapCards" },
          ],
        },
      },
      success: {
        always: [
          { target: "end", cond: "hasNoAvailableCards" },
          { target: "idle" },
        ],
      },
      fail: {
        always: "idle",
      },
      end: {
        type: "final",
      },
    },
  },
  {
    actions: {
      flipCard,
      removeFlippedCards,
      untapCards,
    },
    guards: {
      flippedCardsAreMatching,
      hasNoAvailableCards,
    },
  }
);
