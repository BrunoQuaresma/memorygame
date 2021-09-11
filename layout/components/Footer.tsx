import { Box, Icon, Link } from "@chakra-ui/react";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { AiOutlineGithub } from "react-icons/ai";

export default function Footer() {
  return (
    <Box
      as="footer"
      textAlign="center"
      fontSize="sm"
      color="blue.700"
      py={12}
      lineHeight="160%"
      mx="auto"
    >
      <Box mb={1}>
        It is an open-source project.{" "}
        <Link
          fontWeight="bold"
          isExternal
          href="https://github.com/BrunoQuaresma/memorygame"
        >
          <Icon as={AiOutlineGithub} /> Check the GitHub repo
        </Link>
      </Box>

      <Box fontSize="xs">
        Made with <Icon color="red.500" as={FaHeart} /> by{" "}
        <Link isExternal href="https://twitter.com/bruno__quaresma">
          @bruno__quaresma
        </Link>
      </Box>
    </Box>
  );
}
