import { assign, createMachine, sendParent } from "xstate";
import { CardIndex, MatchContext } from "../types";
import { animals } from "./emojis";
import { shuffle, takeRandom } from "./utils/array";
import { playEndAudio, playFlipAudio, playMatchAudio } from "./audio";

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

const isNotFlipped = (context: MatchContext, event: MatchEvent) => {
  return !context.flippedCards.includes(event.index);
};

const flippedCardsAreMatching = (context: MatchContext) => {
  const [first, second] = context.flippedCards;
  return context.board[first] === context.board[second];
};

const hasNoAvailableCards = (context: MatchContext) => {
  return context.board.every((card) => card === undefined);
};

const createBoard = ({ numberOfPairs }: { numberOfPairs: number }) => {
  const emojis = takeRandom(animals, numberOfPairs);
  const cards = [...emojis, ...emojis];
  return shuffle(cards);
};

export const createMatchMachine = () =>
  createMachine<MatchContext, MatchEvent>(
    {
      initial: "idle",
      context: {
        flippedCards: [],
        board: createBoard({ numberOfPairs: 2 }),
        columns: 2,
        rows: 2,
      },
      states: {
        idle: {
          on: {
            FLIP_CARD: {
              target: "flipedFirstCard",
              actions: ["flipCard", "playFlipAudio"],
            },
          },
        },
        flipedFirstCard: {
          on: {
            FLIP_CARD: {
              target: "checkResult",
              actions: ["flipCard", "playFlipAudio"],
              cond: "isNotFlipped",
            },
          },
        },
        checkResult: {
          after: {
            500: [
              {
                target: "success",
                cond: "flippedCardsAreMatching",
                actions: ["removeFlippedCards", "playMatchAudio"],
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
              actions: [sendParent("END"), "playEndAudio"],
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
        playFlipAudio,
        removeFlippedCards,
        playMatchAudio,
        untapCards,
        playEndAudio,
      },
      guards: {
        flippedCardsAreMatching,
        hasNoAvailableCards,
        isNotFlipped,
      },
    }
  );
