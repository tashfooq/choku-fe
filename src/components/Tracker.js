import {
  Center,
  Text,
  Heading,
  Box,
  Flex,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Button,
} from "@chakra-ui/react";
import { RiSaveFill } from 'react-icons/ri'
import React, { useEffect, useState } from "react";

const Tracker = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);

  const getTextbooks = async () => {
    const response = await fetch("http://localhost:3001/course/textbooks");
    const { textbooks } = await response.json();
    setTextbooks(textbooks);
  };

  const getChapters = async (textbookId) => {
    if (
      chapters.filter((chap) => chap.textbookId === textbookId).length === 0
    ) {
      const response = await fetch(
        `http://localhost:3001/course/textbooks/${textbookId}/chapters`
      );
      const { chapters } = await response.json();
      setChapters((prevState) => [...prevState, { textbookId, chapters }]);
    }
  };

  useEffect(() => {
    getTextbooks();
  }, []);

  return (
    <>
      {/* <Flex> */}
      <Box m={6}>
        <Accordion allowMultiple>
          {textbooks.map((book, index) => {
            return (
              <AccordionItem key={index}>
                <AccordionButton onClick={() => getChapters(book.textbook_id)}>
                  <Box flex="1" textAlign="left">
                    <Heading>{book.name}</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {chapters
                    .filter((e) => e.textbookId === book.textbook_id)[0]
                    ?.chapters?.map((e, idx) => {
                      return (
                        <Flex justify="space-between">
                          <Box>
                            <Text key={idx}>{e.name}</Text>
                          </Box>
                          <Flex justify="space-evenly" width="500px">
                            <Box>
                              <Text>Passes: </Text>
                              <NumberInput
                                maxWidth="200px"
                                size="sm"
                                defaultValue={0}
                                min={0}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </Box>
                            <Box>
                            <Text>Finished: </Text>
                            <Checkbox colorScheme="green"></Checkbox>
                            </Box>
                          </Flex>
                        </Flex>
                      );
                    })}
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
        <Button leftIcon={<RiSaveFill />}>Save</Button>
        {/* </Flex> */}
      </Box>
    </>
  );
};

export default Tracker;
