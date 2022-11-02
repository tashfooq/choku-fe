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
  IconBook2,
} from "@tabler/icons";
import TrackerSettings from "./TrackerSettings";
import { contentService } from "../services/ContentService";
import { authService } from "../services/AuthService";

type SubChapter = {
  id: number;
  name: string;
  chapter_id: number;
  checked?: boolean;
  passes?: number;
};

const Tracker = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    ""
  ); //these needs to be renamed to something more appropriate
  const [subChapters, setSubChapters] = useState<any[]>([]); //figure out a more appropriate type for this and avoid using any
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const getTextbooks = async () => {
    const textbooks = await contentService.getTextbooksService();
    setTextbooks(textbooks);
  };

  const getChapters = async (textbookId: number) => {
    const chapters = await contentService.getChapters(textbookId);
    setChapters(chapters);
  };

  const getSubChaptersByChapterId = async (chapterId: number) => {
    const subChaps = await contentService.getSubChapters(chapterId);
    if (
      subChapters.filter((sC: any) => sC.chapter_id === chapterId).length !== 0
    ) {
      return;
    }
    setSubChapters((prev: any) => [...prev, ...subChaps]);
  };

  const saveProgress = async () => {
    const { id } = await authService.getUser();
    const reduced = subChapters.reduce((prev, curr) => {
      const prog = {
        id: curr.id,
        ...(curr.passes && { passes: curr.passes }),
      };
      curr.checked === true && prev.push(prog);
      return prev;
    }, []);
    console.log(reduced);
    const progject = { userId: id, subChapterProgress: reduced };
    console.log(progject);
    // console.log(filteredProgress);
  };

  const checkOrPasses = (subChapterId: number, passes?: number) => {
    const subChap = subChapters.find((sC) => sC.id === subChapterId);
    const subChapIdx = subChapters.findIndex((sC) => sC.id === subChapterId);
    const deepFake: SubChapter[] = [...subChapters];
    if (passes) {
      deepFake[subChapIdx] = { ...subChap, passes };
      setSubChapters(deepFake);
      return;
    }
    if (Object.keys(subChap).includes("checked")) {
      deepFake[subChapIdx] =
        subChap?.checked === true
          ? { ...subChap, checked: false }
          : { ...subChap, checked: true };
      setSubChapters(deepFake);
      return;
    }
    deepFake[subChapIdx] = { ...subChap, checked: true };
    setSubChapters(deepFake);
  };

  // this needs to turn into fetch previosly selected textbooks (a part of progress)
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
            leftIcon={<IconBook2 size={18} />}
            style={{ marginRight: 10 }}
            onClick={() => setSettingsModalOpen(true)}
          >
            Update Tracker Material
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
              onClick={() => getSubChaptersByChapterId(chapter_id)}
            >
              <Accordion.Control>{name}</Accordion.Control>
              <Accordion.Panel>
                <Table>
                  <tbody>
                    {subChapters
                      .filter((sC) => sC.chapter_id === chapter_id)
                      .map(({ name, id }) => {
                        return (
                          <tr key={id}>
                            <td>{name}</td>
                            <td>
                              <div onClick={() => checkOrPasses(id)}>
                                {subChapters.find((sC) => sC.id === id)
                                  ?.checked ? (
                                  <IconCircleCheck color="green" />
                                ) : (
                                  <IconCircleDashed />
                                )}
                              </div>
                            </td>
                            <td>
                              <NumberInput
                                placeholder="Number of passes"
                                min={1}
                                icon={<IconBook size={18} />}
                                onChange={(passNumber) =>
                                  checkOrPasses(id, passNumber)
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
