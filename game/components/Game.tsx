import { Box, Button, Center, Heading } from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import React from "react";
import { gameMachine } from "../game";
import { Board } from "./Board";
import { Score } from "./Score";

export const Game = () => {
  const [game, sendGameEvent] = useMachine(gameMachine);

  if (game.matches("idle")) {
    return (
      <Center p={20}>
        <Box textAlign="center">
          <Heading as="h1" fontSize="6xl" mb={8}>
            Memory Game
          </Heading>
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => sendGameEvent("START")}
          >
            Start the game
          </Button>
        </Box>
      </Center>
    );
  }

  if (game.matches("started") && game.context.match) {
    return (
      <Center p={10}>
        <Box>
          <Score py={4} match={game.context.match} />
          <Board match={game.context.match} />
        </Box>
      </Center>
    );
  }

  if (game.matches("ended") && game.context.match) {
    return (
      <Center p={20}>
        <Box textAlign="center">
          <Heading as="h1" fontSize="6xl">
            Completed!
          </Heading>
          <Score
            match={game.context.match}
            fontSize="2xl"
            mb={8}
            fontWeight="medium"
          />
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => sendGameEvent("RESTART")}
          >
            Restart the game
          </Button>
        </Box>
      </Center>
    );
  }

  return <Heading>Oops. Something wrong happened.</Heading>;
};
