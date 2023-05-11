import React, { useState } from "react";
import { DataTable } from "mantine-datatable";
import { IconChevronRight, IconWriting } from "@tabler/icons-react";
import { Group, Text } from "@mantine/core";
import { SubChapter, SubTopic } from "../types";
import { useQuery } from "@tanstack/react-query";
import { contentService } from "../services/ContentService";
import { createStyles, px } from "@mantine/core";

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

const SubtopicTable = ({ subchapterId }: { subchapterId: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["subTopics", subchapterId],
    queryFn: () => contentService.getSubtopics(subchapterId),
  });
  const [expandedRecordIds, setExpandedRecordIds] = useState<number[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>(data);
  const { classes } = useStyles();

  console.log(subTopics);
  //   const { cx, classes } = useStyles();

  //   const getSubChapters = async (chapterId: number) => {
  //     // use immer here to append
  //     const subChapters = await contentService.getSubChapters(chapterId);
  //     setSubChapters(subChapters);
  //   };

  return (
    <DataTable
      noHeader
      minHeight={100}
      columns={[
        {
          accessor: "name",
          render: ({ name }) => (
            <Group spacing="xs" noWrap className={classes.subTopicName}>
              <IconWriting size="0.9em" />
              <Text>{name}</Text>
            </Group>
          ),
        },
      ]}
      records={subTopics}
      fetching={isLoading}
      rowExpansion={{
        allowMultiple: false,
        expanded: {
          recordIds: expandedRecordIds,
          onRecordIdsChange: setExpandedRecordIds,
        },
        content: ({ record }) => <span>{JSON.stringify(record)}</span>,
      }}
    />
  );
};

export default SubtopicTable;
