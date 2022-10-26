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
import {
  IconCircleDashed,
  IconCircleCheck,
  IconBook,
  IconDeviceFloppy,
  IconSettings,
} from "@tabler/icons";
import TrackerSettings from "./TrackerSettings";
import axios from "axios";
import { contentService } from "../services/ContentService";

const Tracker = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    ""
  ); //these needs to be renamed to something more appropriate
  const [subTopics, setSubTopics] = useState<any[]>([]); //figure out a more appropriate type for this and avoid using any
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const getTextbooks = async () => {
    // probably should destructure this as well
    const textbooks = await contentService.getTextbooksService();
    setTextbooks(textbooks);
  };

  // rename to something like filtered chapters
  const getChapters = async (textbookId: number) => {
    const chapters = await contentService.getChapters(textbookId);
    setChapters(chapters);
  };

  const getSubtopics = async (chapterId: number) => {
    const subtopics = await contentService.getSubtopics(chapterId);
    if (
      subTopics.filter((topic) => topic.chapter_id === chapterId).length !== 0
    ) {
      return;
    }
    setSubTopics((prev) => [...prev, ...subtopics]);
  };

  const getUser = async () => {
    const { data } = await axios.get("http://localhost:3001/auth/user", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
    return data;
  };

  const saveProgress = async () => {
    const { id } = await getUser();
    // console.log(id);
    const filteredProgress = subTopics.filter(
      (topic) => topic.checked === true
    );
    console.log(filteredProgress);
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
          <Button
            leftIcon={<IconSettings size={18} />}
            style={{ marginRight: 10 }}
            onClick={() => setSettingsModalOpen(true)}
          >
            Change tracker settings
          </Button>
          <Button
            leftIcon={<IconDeviceFloppy size={18} />}
            onClick={saveProgress}
          >
            Save
          </Button>
        </div>
      </Group>
      <Accordion>
        {chapters?.map(({ chapter_id, name }) => {
          return (
            <Accordion.Item
              key={chapter_id}
              value={name}
              // label={name}
              onClick={() => getSubtopics(chapter_id)}
            >
              <Accordion.Control>{name}</Accordion.Control>
              <Accordion.Panel>
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
                                  <IconCircleDashed />
                                ) : (
                                  <IconCircleCheck color="green" />
                                )}
                              </div>
                            </td>
                            <td>
                              <NumberInput
                                // label="Passes"
                                placeholder="Number of passes"
                                min={1}
                                icon={<IconBook size={18} />}
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
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
      <TrackerSettings
        isOpen={settingsModalOpen}
        closer={setSettingsModalOpen}
      />
    </Container>
  );
};

export default Tracker;
