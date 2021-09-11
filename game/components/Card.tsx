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
      disabled={isFlipped}
      cursor={isFlipped ? "not-allowed" : "pointer"}
      onClick={onFlip}
      borderWidth={1}
      borderBottomWidth={2}
      borderStyle="solid"
      borderColor={isFlipped ? "blue.200" : "gray.300"}
      bgColor={isFlipped ? "white" : "gray.100"}
      width={size}
      height={size}
      rounded="md"
      fontSize="5xl"
      transition="all 0.15s ease-in-out"
      _hover={{
        borderColor: "blue.200",
        boxShadow: isFlipped ? undefined : "md",
        bgColor: "white",
        transform: isFlipped ? undefined : "scale(1.05)",
      }}
    >
      {isFlipped ? value : ""}
    </Center>
  );
};
