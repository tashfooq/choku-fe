import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

const Header = () => {
  return (
    <>
      <Flex justify="space-between">
        <Heading>Choku</Heading>
        <Box w="400px" backgroundColor="black"></Box>
      </Flex>
    </>
  );
};

export default Header;
