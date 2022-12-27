import React, { useState, useEffect, useContext } from "react";
import { Container, Group, Accordion, Button, Select } from "@mantine/core";
import { IconDeviceFloppy, IconBook2 } from "@tabler/icons";
import MaterialPicker from "./MaterialPicker";
import { contentService } from "../services/ContentService";
import { authService } from "../services/AuthService";
import ProgressContext, {
  ProgressContextType,
  Progress,
} from "../context/ProgressContext";
import Items from "./Items";

interface Item {
  id: number;
  name: string;
  checked?: boolean;
  passes?: number;
}

export interface SubChapter extends Item {
  chapter_id: number;
}

export interface SubTopic extends Item {
  subchapter_id: number;
}

const Tracker = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    ""
  ); //these needs to be renamed to something more appropriate
  const [subChapters, setSubChapters] = useState<any[]>([]); //figure out a more appropriate type for this and avoid using any
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const {
    updateProgress,
    fetchProgress,
    selectedMaterialIds,
    filteredMaterials,
  } = useContext(ProgressContext) as ProgressContextType;

  const getTextbooks = async () => {
    const textbooks = await contentService.getAllTextbooks();
    setTextbooks(
      textbooks.filter((t: any) => selectedMaterialIds.includes(t.textbook_id))
    );
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
    const subChapterProgress = subChapters.reduce((prev, curr) => {
      const prog: Progress = {
        id: curr.id,
        ...(curr.passes && { passes: curr.passes }),
      };
      curr.checked === true && prev.push(prog);
      return prev;
    }, []);
    updateProgress(id, subChapterProgress);
  };

  const recordCheckOrPasses = (
    itemId: number,
    items: (SubChapter | SubTopic)[],
    passes?: number
  ) => {
    const itemLookup = items.find((sC) => sC.id === itemId);
    if (itemLookup === undefined) {
      throw new TypeError("Item should always be there");
    }
    const item: SubChapter | SubTopic = itemLookup;
    const itemIdx = items.findIndex((sC) => sC.id === itemId);
    const deepFake: (SubChapter | SubTopic)[] = [...items];
    if (passes) {
      deepFake[itemIdx] = { ...item, passes };
      setSubChapters(deepFake);
      return;
    }
    if (Object.keys(item).includes("checked")) {
      deepFake[itemIdx] =
        item?.checked === true
          ? { ...item, checked: false }
          : { ...item, checked: true };
      setSubChapters(deepFake);
      return;
    }
    deepFake[itemIdx] = { ...item, checked: true };
    setSubChapters(deepFake);
  };

  interface WithAccordionProps {
    id: number;
    name: string;
    getter: (entityId: number) => Promise<void>;
    entities: (SubTopic | SubChapter)[];
  }

  const WithAccordion = ({
    id,
    name,
    getter,
    entities,
    children,
  }: React.PropsWithChildren<WithAccordionProps>) => {
    return (
      <Accordion.Item key={id} value={name} onClick={() => getter(id)}>
        <Accordion.Control>{name}</Accordion.Control>
        <Accordion.Panel>{entities.length > 0 && children}</Accordion.Panel>
      </Accordion.Item>
    );
  };

  // this needs to turn into fetch previosly selected textbooks (a part of progress)
  useEffect(() => {
    fetchProgress();
    getTextbooks();
  }, []);

  useEffect(() => {
    getTextbooks();
  }, [selectedMaterialIds]);

  useEffect(() => {
    var textbookId = Number(textbookSelectValue);
    if (textbookId !== 0) {
      getChapters(textbookId);
    }
  }, [textbookSelectValue]);

  return (
    <Container size="xl" px="md">
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
            <WithAccordion
              id={chapter_id}
              name={name}
              getter={getSubChaptersByChapterId}
              entities={subChapters}
            >
              <Items
                items={subChapters}
                parentItemId={chapter_id}
                record={recordCheckOrPasses}
              />
            </WithAccordion>
          );
        })}
      </Accordion>
      <MaterialPicker
        isModalView={true}
        isOpen={settingsModalOpen}
        closer={setSettingsModalOpen}
      />
    </Container>
  );
};

export default Tracker;
