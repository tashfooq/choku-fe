import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Checkbox,
  CheckboxGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
} from "@chakra-ui/react";

const SubtopicModal = ({ chapter, isOpen, onClose }) => {
  const { name, chapter_id } = chapter;
  const [subtopics, setSubTopics] = useState([]);
  const [checkedTopicIds, setCheckedTopicIds] = useState([]);
  const [numPasses, setNumPasses] = useState({});

  const getSubtopics = async (chapterId) => {
    const response = await fetch(
      `http://localhost:3001/course/subtopic/${chapterId}`
    );
    const { subtopics } = await response.json();
    setSubTopics(subtopics);
  };

  const onCheckboxChange = (e) => {
    const ids = e.map(Number);
    setCheckedTopicIds(ids);
  };

  const onStepperChange = (stepperValue, subchapterId) => {
    setNumPasses((prev) => {
      return { ...prev, [subchapterId]: stepperValue };
    });
  };

  const onSave = () => {
    const progress = subtopics.filter(({ subchapter_id }) =>
      checkedTopicIds.includes(subchapter_id)
    );
    const progressWithPasses = progress.map((each) => {
      return {
        ...each,
        ...(numPasses[each.subchapter_id] && {
          passes: numPasses[each.subchapter_id],
          complete: true,
        }),
      };
    });
    console.log(progressWithPasses);
  };

  useEffect(() => {
    getSubtopics(chapter_id);
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!!subtopics && (
              <CheckboxGroup
                onChange={onCheckboxChange}
                value={checkedTopicIds}
              >
                {subtopics.map(({ Name, subchapter_id }) => {
                  return (
                    <Flex key={subchapter_id} justify="space-between">
                      <Text>{Name}</Text>
                      <Flex gap={2}>
                        <NumberInput
                          size="xs"
                          maxW={16}
                          onChange={(value) =>
                            onStepperChange(value, subchapter_id)
                          }
                          min={0}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Checkbox value={subchapter_id} />
                      </Flex>
                    </Flex>
                  );
                })}
              </CheckboxGroup>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => onClose(false)}>
              Close
            </Button>
            <Button colorScheme="teal" variant="outline" onClick={onSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubtopicModal;
