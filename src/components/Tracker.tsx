import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Container,
  Group,
  Select,
  Button,
  Text,
  createStyles,
  px,
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
import {
  IconBook2,
  IconBrush,
  IconChevronRight,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import MaterialPicker from "./MaterialPicker";
import { DataTable } from "mantine-datatable";
import SubchapterTable from "./SubchapterTable";
import { useChapter } from "../common/queries";
import HeaderMenu from "./Header";
import { Item, ProgressDto } from "../types";

const useStyles = createStyles((theme) => ({
  expandIcon: {
    transition: "transform 0.2s ease",
  },
  expandIconRotated: {
    transform: "rotate(90deg)",
  },
  subTopicName: {
    marginLeft: px(theme.spacing.xl) * 2,
  },
}));

const Tracker = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { cx, classes } = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        localStorage.setItem("token", token);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [isLoading, getAccessTokenSilently]);

  const {
    saveProgressFromTracker,
    selectedTextbookIds,
    selectedChapters,
    setSelectedChapters,
    progress,
    progressError,
  } = useContext(ProgressContext) as ProgressContextType;
  const { data: allTextbooks } = useQuery<Item[]>({
    queryKey: ["textbooks"],
    queryFn: contentService.getAllTextbooks,
  });

  useEffect(() => {
    if (progress) {
      // looking at progress.selectedTextbookIds instead of selectedTextbookIds because the latter is not updated yet
      console.log(progress);
      if (
        progress.selectedTextbookIds &&
        progress.selectedTextbookIds.length === 0
      ) {
        navigate("/picker");
      }
    }
    if (progressError && progressError instanceof AxiosError) {
      if (progressError?.response?.status === 404) {
        console.log("progressError", progressError);
        navigate("/picker");
      }
    }
  }, [progress, progressError, selectedTextbookIds, navigate]);

  const textbooks = useMemo(() => {
    return allTextbooks
      ? allTextbooks.filter(({ id }) => selectedTextbookIds.includes(id))
      : [];
  }, [allTextbooks, selectedTextbookIds]);

  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    null
  );
  const [expandedRecordIds, setExpandedRecordIds] = useState<number[]>([]);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // wrap the entire table to render if chapter exists
  const { data: chapters, isLoading: isChaptersLoading } = useChapter(
    Number(textbookSelectValue),
    isAuthenticated && textbookSelectValue !== null
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container size="xl" px="md">
        <Group style={{ margin: 10 }} position="apart">
          <Select
            value={textbookSelectValue}
            placeholder="Pick a resource"
            onChange={setTextbookSelectValue}
            data={textbooks.map(({ id, name }) => {
              return { value: id.toString(), label: name };
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
            <Button
              leftIcon={<IconDeviceFloppy />}
              onClick={saveProgressFromTracker}
            >
              Save
            </Button>
          </div>
        </Group>

        {textbookSelectValue === null ? (
          <Text ml="sm">Choose a textbook to get started</Text>
        ) : (
          <DataTable
            columns={[
              {
                accessor: "name",
                title: "Name",
                render: ({ id, name }) => (
                  <Group spacing="xs">
                    <IconChevronRight
                      size="0.9em"
                      className={cx(classes.expandIcon, {
                        [classes.expandIconRotated]:
                          expandedRecordIds.includes(id),
                      })}
                    />
                    <IconBrush size="0.9em" />
                    <Text>{name}</Text>
                  </Group>
                ),
              },
            ]}
            records={chapters}
            fetching={isChaptersLoading}
            selectedRecords={selectedChapters}
            onSelectedRecordsChange={setSelectedChapters}
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
        )}

        <MaterialPicker
          isModalView={true}
          isOpen={settingsModalOpen}
          closer={setSettingsModalOpen}
        />
      </Container>
    </>
  );
};

export default Tracker;
