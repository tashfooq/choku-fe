import React, { useState, useEffect } from "react";
import {
  Container,
  Group,
  Accordion,
  Button,
  Select,
  Table,
  NumberInput,
} from "@mantine/core";
import { CircleDashed, CircleCheck, Book, DeviceFloppy, Settings } from "tabler-icons-react";

const Tracker = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    ""
  ); //these needs to be renamed to something more appropriate
  const [subTopics, setSubTopics] = useState<any[]>([]); //figure out a more appropriate type for this and avoid using any

  const getTextbooks = async () => {
    const response = await fetch("http://localhost:3001/course/textbooks");
    const { textbooks } = await response.json();
    setTextbooks(textbooks);
  };

  const getChapters = async (textbookId: number) => {
    const response = await fetch(
      `http://localhost:3001/course/textbooks/${textbookId}/chapters`
    );
    const { chapters } = await response.json();
    setChapters(chapters);
  };

  const getSubtopics = async (chapterId: number) => {
    const response = await fetch(
      `http://localhost:3001/course/subtopic/${chapterId}`
    );
    const { subtopics } = await response.json();
    if (
      subTopics.filter((topic) => topic.chapter_id === chapterId).length !== 0
    ) {
      return;
    }
    setSubTopics((prev) => [...prev, ...subtopics]);
  };

  const updateProgress = (
    subchapterId: number,
    markComplete: boolean,
    passes?: number
  ) => {
    const toMutate = subTopics.find(
      (topic) => topic.subchapter_id === subchapterId
    );
    const toMutateIdx = subTopics.findIndex(
      (topic) => topic.subchapter_id === subchapterId
    );
    const copy = [...subTopics];
    if (markComplete === true) {
      if (toMutate.checked === undefined || toMutate.checked === false) {
        const mutated = { ...toMutate, checked: true };
        copy[toMutateIdx] = mutated;
        setSubTopics(copy);
      } else {
        const mutated = { ...toMutate, checked: false };
        copy[toMutateIdx] = mutated;
        setSubTopics(copy);
      }
    } else {
      const mutated = { ...toMutate, passes };
      copy[toMutateIdx] = mutated;
      setSubTopics(copy);
    }
  };

  useEffect(() => {
    getTextbooks();
  }, []);

  useEffect(() => {
    var textbookId = Number(textbookSelectValue);
    if (textbookId !== 0) {
      getChapters(textbookId);
    }
  }, [textbookSelectValue]);

  return (
    <Container size="md" px="md">
      <Group style={{ margin: 10 }} position="apart">
        <Select
          value={textbookSelectValue}
          placeholder="Pick a resource"
          onChange={setTextbookSelectValue}
          data={textbooks.map(({ textbook_id, name }) => {
            return { value: textbook_id, label: name };
          })}
        />
        <div>
          <Button leftIcon={<Settings size={18} />} style={{marginRight: 10}}>Change tracker settings</Button>
          <Button leftIcon={<DeviceFloppy size={18} />} onClick={() => console.log(chapters)}>Save</Button>
        </div>
      </Group>
      <Accordion>
        {chapters?.map(({ chapter_id, name }) => {
          return (
            <Accordion.Item
              key={chapter_id}
              label={name}
              onClick={() => getSubtopics(chapter_id)}
            >
              <Table>
                <tbody>
                  {subTopics
                    .filter((topic) => topic.chapter_id === chapter_id)
                    .map(({ Name, subchapter_id }, index) => {
                      return (
                        <tr key={subchapter_id}>
                          <td>{Name}</td>
                          <td>
                            <div
                              onClick={() =>
                                updateProgress(subchapter_id, true)
                              }
                            >
                              {subTopics.find(
                                (ele) => ele.subchapter_id === subchapter_id
                              ).checked === undefined ||
                              subTopics.find(
                                (ele) => ele.subchapter_id === subchapter_id
                              ).checked === false ? (
                                <CircleDashed />
                              ) : (
                                <CircleCheck color="green" />
                              )}
                            </div>
                          </td>
                          <td>
                            <NumberInput
                              // label="Passes"
                              placeholder="Number of passes"
                              min={0}
                              icon={<Book size={18} />}
                              onChange={(value) =>
                                updateProgress(subchapter_id, false, value)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Container>
  );
};

export default Tracker;
