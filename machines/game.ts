import { createMachine, spawn, assign, ActorRefFrom } from "xstate";
import { matchMachine } from "./match";

type GameContext = {
  match?: ActorRefFrom<typeof matchMachine>;
};

type GameStartEvent = {
  type: "START";
};

type GameEndEvent = {
  type: "END";
};

type GameRestartEvent = {
  type: "RESTART";
};

type GameEvent = GameStartEvent | GameEndEvent | GameRestartEvent;

const startNewMatch = assign<GameContext, GameEvent>(() => ({
  match: spawn(matchMachine),
}));

export const gameMachine = createMachine<GameContext, GameEvent>(
  {
    id: "game",
    initial: "idle",
    states: {
      idle: {
        on: {
          START: "started",
        },
      },

      started: {
        entry: "startNewMatch",
        on: {
          END: "ended",
        },
      },

      ended: {
        on: {
          RESTART: "started",
        },
      },
    },
  },
  {
    actions: {
      startNewMatch,
    },
  }
);
