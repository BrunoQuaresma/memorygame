import { Box, BoxProps } from "@chakra-ui/layout";
import { useActor } from "@xstate/react";
import React from "react";
import { ActorRefFrom } from "xstate";
import { createMatchMachine } from "../match";

type ScoreProps = {
  match: ActorRefFrom<ReturnType<typeof createMatchMachine>>;
} & BoxProps;

export const Score: React.FC<ScoreProps> = ({
  match: matchActor,
  ...boxProps
}) => {
  const [match] = useActor(matchActor);

  return (
    <Box
      textTransform="uppercase"
      textAlign="center"
      py={4}
      fontSize="xs"
      letterSpacing={1}
      fontWeight="medium"
      {...boxProps}
    >
      Score: {match.context.score}
    </Box>
  );
};
