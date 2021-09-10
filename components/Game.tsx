import { Box, Grid } from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import React from "react";
import { gameMachine } from "../machines/game";

export const Game = () => {
  const [game, sendGameEvent] = useMachine(gameMachine);

  return (
    <Grid
      gap={1}
      templateColumns={`repeat(${game.context.columns}, 40px)`}
      templateRows={`repeat(${game.context.rows}, 40px)`}
    >
      {game.context.board.map((cardValue, cardIndex) => {
        if (cardValue === undefined) {
          return <div key={cardIndex} />;
        }

        const isFlipped = game.context.flippedCards.includes(cardIndex);

        return (
          <Box
            cursor="pointer"
            onClick={() => sendGameEvent("FLIP_CARD", { index: cardIndex })}
            key={cardIndex}
            borderWidth={1}
            borderStyle="solid"
            borderColor="gray.200"
            width="40px"
            height="40px"
            rounded="md"
          >
            {isFlipped ? cardValue : ""}
          </Box>
        );
      })}
    </Grid>
  );
};
