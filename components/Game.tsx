import { Button, Center } from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import React from "react";
import { gameMachine } from "../machines/game";
import { Board } from "./Board";

export const Game = () => {
  const [game, sendGameEvent] = useMachine(gameMachine);

  if (game.matches("idle")) {
    return (
      <Center>
        <Button onClick={() => sendGameEvent("START")}>Start the game</Button>
      </Center>
    );
  }

  if (game.matches("started") && game.context.match) {
    return <Board match={game.context.match} />;
  }

  if (game.matches("ended")) {
    return <h1>END!</h1>;
  }

  return null;
};
