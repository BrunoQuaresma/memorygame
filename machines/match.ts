import { assign, createMachine, sendParent } from "xstate";
import { CardIndex, MatchContext } from "../types";

type FlipCardEvent = {
  type: "FLIP_CARD";
  index: CardIndex;
};

type MatchEvent = FlipCardEvent;

const flipCard = assign<MatchContext, MatchEvent>((context, event) => ({
  flippedCards: context.flippedCards.concat(event.index),
}));

const untapCards = assign<MatchContext, MatchEvent>(() => ({
  flippedCards: [],
}));

const removeFlippedCards = assign<MatchContext, MatchEvent>((context) => {
  const [first, second] = context.flippedCards;
  let updatedBoard = context.board;
  updatedBoard[first] = undefined;
  updatedBoard[second] = undefined;

  return {
    flippedCards: [],
    board: updatedBoard,
  };
});

const flippedCardsAreMatching = (context: MatchContext) => {
  const [first, second] = context.flippedCards;
  return context.board[first] === context.board[second];
};

const hasNoAvailableCards = (context: MatchContext) => {
  return context.board.every((card) => card === undefined);
};

export const matchMachine = createMachine<MatchContext, MatchEvent>(
  {
    id: "match",
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
          {
            target: "end",
            cond: "hasNoAvailableCards",
            actions: sendParent("END"),
          },
          { target: "idle" },
        ],
      },
      fail: {
        always: "idle",
      },
      end: {},
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
