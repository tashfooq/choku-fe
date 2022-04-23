import { Box, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import React from "react";

const ChapterCard = ({ name, color }) => {
  return (
    <>
      <Box
        m={3}
        p={6}
        maxW="sm"
        borderWidth={1}
        borderLeftWidth={5}
        borderLeftColor={color}
        borderRadius="md"
      >
        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {name}
        </Box>
        <p>Completion:</p>
        <CircularProgress value={40}>
          <CircularProgressLabel>40</CircularProgressLabel>
        </CircularProgress>
      </Box>
    </>
  );
};

export default ChapterCard;
