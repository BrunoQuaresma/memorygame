import { Button, Center, Heading } from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import React from "react";
import { gameMachine } from "../game";
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
    return (
      <Center p={10}>
        <Board match={game.context.match} />
      </Center>
    );
  }

  if (game.matches("ended")) {
    return (
      <Center p={10}>
        <Heading>End!</Heading>
        <Button onClick={() => sendGameEvent("RESTART")}>Restart</Button>
      </Center>
    );
  }

  return <Heading>Oops. Something wrong happened.</Heading>;
};
