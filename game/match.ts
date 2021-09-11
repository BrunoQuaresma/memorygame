import { assign, createMachine, sendParent } from "xstate";
import { CardIndex, CardValue } from "./types";
import { animals } from "./emojis";
import { shuffle, takeRandom } from "./utils/array";
import { playEndAudio, playFlipAudio, playMatchAudio } from "./audio";

type MatchContext = {
  flippedCards: Array<CardIndex>;
  board: Array<CardValue | undefined>;
  rows: number;
  columns: number;
  score: number;
};

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

const addTwoScores = assign<MatchContext, MatchEvent>((context) => {
  return {
    score: context.score + 2,
  };
});

const removeOneScore = assign<MatchContext, MatchEvent>((context) => {
  return {
    score: context.score - 1,
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
        board: createBoard({ numberOfPairs: 8 }),
        columns: 4,
        rows: 4,
        score: 0,
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
                actions: [
                  "removeFlippedCards",
                  "playMatchAudio",
                  "addTwoScores",
                ],
              },
              { target: "fail", actions: ["untapCards", "removeOneScore"] },
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
        addTwoScores,
        removeOneScore,
      },
      guards: {
        flippedCardsAreMatching,
        hasNoAvailableCards,
        isNotFlipped,
      },
    }
  );
