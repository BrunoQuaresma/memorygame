import { Box, Grid } from "@chakra-ui/react";
import { useActor } from "@xstate/react";
import React from "react";
import { ActorRefFrom } from "xstate";
import { matchMachine } from "../machines/match";

type BoardProps = {
  match: ActorRefFrom<typeof matchMachine>;
};

export const Board: React.FC<BoardProps> = ({ match: matchActor }) => {
  const [match, sendMatchEvent] = useActor(matchActor);

  return (
    <Grid
      gap={1}
      templateColumns={`repeat(${match.context.columns}, 40px)`}
      templateRows={`repeat(${match.context.rows}, 40px)`}
    >
      {match.context.board.map((cardValue, cardIndex) => {
        if (cardValue === undefined) {
          return <div key={cardIndex} />;
        }

        const isFlipped = match.context.flippedCards.includes(cardIndex);

        return (
          <Box
            cursor="pointer"
            onClick={() =>
              sendMatchEvent({ type: "FLIP_CARD", index: cardIndex })
            }
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
