import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Group,
  Select,
  Table,
  Checkbox,
  Box,
  Button,
  ScrollArea,
} from "@mantine/core";
import { contentService } from "../services/ContentService";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";
import { useQuery } from "@tanstack/react-query";
import { progressService } from "../services/ProgressService";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { IconBook2, IconDeviceFloppy } from "@tabler/icons-react";
import MaterialPicker from "./MaterialPicker";
import { Chapter, Progress, ProgressDto, SubChapter, SubTopic } from "../types";
import { DataTable } from "mantine-datatable";
import * as immer from "immer";
import SubchapterTable from "./SubchapterTable";

const Tracker = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      localStorage.setItem("token", token);
    })();
  }, [isLoading, getAccessTokenSilently]);

  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    null
  );
  const [subChapters, setSubChapters] = useState<SubChapter[]>([]); //figure out a more appropriate type for this and avoid using any
  const [expandedRecordIds, setExpandedRecordIds] = useState<number[]>([]);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { updateProgress, selectedTextbookIds, setSelectedTextbookIds } =
    useContext(ProgressContext) as ProgressContextType;

  const { data: progy, isSuccess } = useQuery({
    queryKey: ["progress"],
    queryFn: progressService.getProgress,
    onError(err: AxiosError) {
      if (err.response?.status === 404) {
        navigate("/picker");
      }
    },
  });

  const getTextbooks = async () => {
    // this needs to be updated to look at selectedTextbookIds
    const allTextbooks = await contentService.getAllTextbooks();
    if (isSuccess) {
      if (!!allTextbooks) {
        setTextbooks(
          allTextbooks.filter(({ id }: any) =>
            progy.selectedTextbookIds.includes(id)
          )
        );
      }
      setSelectedTextbookIds(progy.selectedTextbookIds);
      return;
    }
    setSelectedTextbookIds([]);
  };

  const getChapters = async (textbookId: number) => {
    const chapters = await contentService.getChapters(textbookId);
    setChapters(chapters);
    // setTableData(chapters);
  };

  const handleChapterSelect = (chapterId: number) => {
    const index = chapters.findIndex((chapter) => chapter.id === chapterId);
    const updatedChapters = immer.produce(chapters, (draft) => {
      draft[index].checked = !draft[index].checked;
    });
    setChapters(updatedChapters);
  };

  const saveProgress = async () => {
    // reduced list of ids for checked chapters
    const checkedChapterIds = chapters
      .filter((chapter) => chapter.checked)
      .map((chapter) => chapter.id);
    // reduced list of ids for checked subchapters
    const checkedSubChapterIds = subChapters
      .filter((subChapter) => subChapter.checked)
      .map((subChapter) => subChapter.id);
    // reduced list of ids for checked subtopics
    // const checkedSubTopicIds = subTopics
    //   .filter((subTopic) => subTopic.checked)
    //   .map((subTopic) => subTopic.id);

    const modifiedProgress = immer.produce(progy, (draft: ProgressDto) => {
      const chaptersIdsToBeAdded = checkedChapterIds.filter(
        (id) => !draft.chapterProgress.includes(id)
      );
      const subchapterIdsToBeAdded = checkedSubChapterIds.filter(
        (id) => !draft.subchapterProgress.includes(id)
      );
      draft.chapterProgress.push(...chaptersIdsToBeAdded);
      draft.subchapterProgress.push(...subchapterIdsToBeAdded);
    });
    const {
      selectedTextbookIds,
      chapterProgress,
      subchapterProgress,
      subtopicProgress,
    } = modifiedProgress as unknown as ProgressDto;
    const updatedProgress: Progress = {
      selectedTextbookIds,
      chapterProgress,
      subchapterProgress,
      subtopicProgress,
    };
    updateProgress(updatedProgress);
  };

  // useEffect(() => {
  //   getTextbooks();
  // }, [selectedTextbookIds]);

  useEffect(() => {
    var textbookId = Number(textbookSelectValue);
    if (textbookId !== 0) {
      getChapters(textbookId);
    }
  }, [textbookSelectValue]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container size="xl" px="md">
      <Group style={{ margin: 10 }} position="apart">
        <Select
          value={textbookSelectValue}
          placeholder="Pick a resource"
          onClick={getTextbooks}
          onChange={setTextbookSelectValue}
          data={textbooks.map(({ id, name }) => {
            return { value: id, label: name };
          })}
        />
        <div>
          <Button
            leftIcon={<IconBook2 />}
            style={{ marginRight: 10 }}
            onClick={() => setSettingsModalOpen(true)}
          >
            Update Tracker Material
          </Button>
          <Button leftIcon={<IconDeviceFloppy />} onClick={saveProgress}>
            Save
          </Button>
        </div>
      </Group>

      <DataTable
        columns={[{ accessor: "name", title: "Name" }]}
        records={chapters}
        rowExpansion={{
          allowMultiple: false,
          expanded: {
            recordIds: expandedRecordIds,
            onRecordIdsChange: setExpandedRecordIds,
          },
          content: ({ record, recordIndex }) => (
            <SubchapterTable chapterId={record.id} />
          ),
        }}
      />

      <MaterialPicker
        isModalView={true}
        isOpen={settingsModalOpen}
        closer={setSettingsModalOpen}
      />
    </Container>
  );
};

export default Tracker;
