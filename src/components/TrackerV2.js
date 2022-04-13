import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Select,
  HStack,
  Tag,
  TagLabel,
  Button,
  Heading,
} from "@chakra-ui/react";
import Header from "./Header";
import ChapterCard from "./ChapterCard";
import SubtopicModal from "./SubtopicModal";

const TrackerV2 = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedTextbook, setSelectedTextbook] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [colorIdx, setColor] = useState(-1);
  const [modalChapter, setModalChapter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getTextbooks = async () => {
    const response = await fetch("http://localhost:3001/course/textbooks");
    const { textbooks } = await response.json();
    setTextbooks(textbooks);
  };

  const getChapters = async (textbookId) => {
    const response = await fetch(
      `http://localhost:3001/course/textbooks/${textbookId}/chapters`
    );
    const { chapters } = await response.json();
    setChapters(chapters);
  };

  useEffect(() => {
    getChapters(1);
    getTextbooks();
  }, []);

  useEffect(() => {
    getChapters(selectedTextbook);
  }, [selectedTextbook]);

  const colorList = [
    "#00c7b0",
    "#eb2cff",
    "#00ffff",
    "#ffd27e",
    "#2b8fee",
    "#86e3dc",
    "#005893",
    "#ffd6ee",
    "#007cc7",
    "#007a93",
  ];

  const cycleColorList = () => {
    setColor((prevColor) => (prevColor < colorList.length ? prevColor + 1 : 0));
  };

  const addChapter = (chapterId) => {
    if (
      selectedChapters.filter((selChap) => selChap.chapter_id === chapterId)
        .length === 0
    ) {
      const chapter = chapters.find(
        (chap) => chap.chapter_id === parseInt(chapterId)
      );
      cycleColorList();
      setSelectedChapters((prevSelected) => [
        ...prevSelected,
        { ...chapter, colorIdx },
      ]);
    }
  };

  const onChapterClick = (chapter) => {
    setModalChapter(chapter);
    setShowModal(true);
  };

  return (
    <>
      <Container maxW="1100">
        <Header />
        <Flex mt={2} justify="space-between">
          {!!chapters?.length ? (
            <HStack maxW="50%">
              {chapters.slice(0, 3).map(({ chapter_id, name }) => {
                return (
                  <Button
                    onClick={() => addChapter(chapter_id)}
                    size="sm"
                    textOverflow="ellipsis"
                    variant="outline"
                    key={chapter_id}
                  >
                    {name}
                  </Button>
                );
              })}
              <Select
                maxW="10%"
                size="sm"
                onChange={(e) => addChapter(e.target.value)}
              >
                {chapters
                  .slice(3, chapters.length)
                  .map(({ chapter_id, name }) => {
                    return (
                      <option key={chapter_id} value={chapter_id}>
                        {name}
                      </option>
                    );
                  })}
              </Select>
            </HStack>
          ) : (
            <Box></Box>
          )}
          <Select
            size="sm"
            maxW="40%"
            onChange={(e) => setSelectedTextbook(e.target.value)}
          >
            {textbooks.map(({ textbook_id, name }) => {
              return (
                <option key={textbook_id} value={textbook_id}>
                  {name}
                </option>
              );
            })}
          </Select>
        </Flex>
        <Button onClick={() => onChapterClick(1)}>Test</Button>
        <Flex wrap="wrap">
          {selectedChapters.map((chapter) => {
            return (
              <span key={chapter.chapter_id} onClick={() => onChapterClick(chapter)}>
                <ChapterCard
                  name={chapter.name}
                  color={colorList[chapter.colorIdx]}
                />
              </span>
            );
          })}
        </Flex>
        {showModal && (
          <SubtopicModal chapter={modalChapter} isOpen={showModal} onClose={setShowModal} />
        )}
      </Container>
    </>
  );
};

export default TrackerV2;
