import { createMachine, spawn, assign, ActorRefFrom } from "xstate";
import { preloadAudios } from "./audio";
import { createMatchMachine } from "./match";

type GameContext = {
  match?: ActorRefFrom<ReturnType<typeof createMatchMachine>>;
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

const startNewMatch = assign<GameContext, GameEvent>(() => {
  const match = spawn(createMatchMachine());

  return { match };
});

export const gameMachine = createMachine<GameContext, GameEvent>(
  {
    id: "game",
    initial: "idle",
    states: {
      idle: {
        entry: "preloadAudios",
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
          RESTART: {
            target: "started",
          },
        },
      },
    },
  },
  {
    actions: {
      preloadAudios,
      startNewMatch,
    },
  }
);
