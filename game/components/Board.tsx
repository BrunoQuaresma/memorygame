import { Box, Grid, Icon } from "@chakra-ui/react";
import { useActor } from "@xstate/react";
import React from "react";
import { ActorRefFrom } from "xstate";
import { createMatchMachine } from "../match";
import { Card } from "./Card";

type BoardProps = {
  match: ActorRefFrom<ReturnType<typeof createMatchMachine>>;
};

export const Board: React.FC<BoardProps> = ({ match: matchActor }) => {
  const [match, sendMatchEvent] = useActor(matchActor);
  const size = "80px";

  return (
    <Grid
      gap={3}
      templateColumns={`repeat(${match.context.columns}, ${size})`}
      templateRows={`repeat(${match.context.rows}, ${size})`}
    >
      {match.context.board.map((cardValue, cardIndex) => {
        if (cardValue === undefined) {
          return <div key={cardIndex} />;
        }

        const isFlipped = match.context.flippedCards.includes(cardIndex);

        return (
          <Card
            onFlip={() =>
              sendMatchEvent({ type: "FLIP_CARD", index: cardIndex })
            }
            isFlipped={isFlipped}
            value={cardValue}
            key={cardIndex}
            size={size}
          />
        );
      })}
    </Grid>
  );
};
