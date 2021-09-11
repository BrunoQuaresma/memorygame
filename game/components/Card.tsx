import { Box, Center } from "@chakra-ui/react";
import React from "react";

type CardProps = {
  onFlip: () => void;
  isFlipped: boolean;
  value: string;
  size: number | string;
};

export const Card: React.FC<CardProps> = ({
  onFlip,
  isFlipped,
  value,
  size,
}) => {
  return (
    <Center
      as="button"
      cursor="pointer"
      onClick={onFlip}
      borderWidth={1}
      borderStyle="solid"
      borderColor="gray.200"
      width={size}
      height={size}
      rounded="md"
      fontSize="5xl"
    >
      {isFlipped ? value : ""}
    </Center>
  );
};
