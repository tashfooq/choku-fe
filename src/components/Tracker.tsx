import React, { useState, useEffect, useContext, ComponentType } from "react";
import {
  Container,
  Group,
  Select,
  Button,
  Text,
  createStyles,
  px,
  Center,
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

  const [textbooks, setTextbooks] = useState([]);
  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    null
  );
  const [expandedRecordIds, setExpandedRecordIds] = useState<number[]>([]);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const {
    saveProgress,
    setSelectedTextbookIds,
    selectedChapters,
    setSelectedChapters,
  } = useContext(ProgressContext) as ProgressContextType;

  // this needs using useProgress hook and then navigating to picker if no progress
  const { data: progress, isSuccess } = useQuery({
    queryKey: ["progress"],
    queryFn: progressService.getProgress,
    onError(err: AxiosError) {
      if (err?.response?.status === 404) {
        navigate("/picker");
      }
    },
    enabled: isAuthenticated,
  });

  // wrap the entire table to render if chapter exists
  const { data: chapters, isLoading: isChaptersLoading } = useChapter(
    Number(textbookSelectValue),
    isAuthenticated || textbookSelectValue !== null
  );

  const getTextbooks = async () => {
    // this needs to be updated to look at selectedTextbookIds
    const allTextbooks = await contentService.getAllTextbooks();
    if (isSuccess) {
      if (!!allTextbooks) {
        setTextbooks(
          allTextbooks.filter(({ id }: any) =>
            progress.selectedTextbookIds.includes(id)
          )
        );
      }
      setSelectedTextbookIds(progress.selectedTextbookIds);
      return;
    }
    setSelectedTextbookIds([]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container size="xl" px="md">
        <HeaderMenu />
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
