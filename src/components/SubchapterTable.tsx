import React, { useState } from "react";
import { DataTable } from "mantine-datatable";
import { IconChevronRight, IconPencil } from "@tabler/icons-react";
import { Group, Text } from "@mantine/core";
import { SubChapter } from "../types";
import { useQuery } from "@tanstack/react-query";
import { contentService } from "../services/ContentService";
import { createStyles, px } from "@mantine/core";
import SubtopicTable from "./SubtopicTable";

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

const SubchapterTable = ({ chapterId }: { chapterId: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["subChapters", chapterId],
    queryFn: () => contentService.getSubChapters(chapterId),
  });
  const [expandedRecordIds, setExpandedRecordIds] = useState<number[]>([]);
  const [subChapters, setSubChapters] = useState<SubChapter[]>(data); //figure out a more appropriate type for this and avoid using any
  const { cx, classes } = useStyles();

  //   const getSubChapters = async (chapterId: number) => {
  //     // use immer here to append
  //     const subChapters = await contentService.getSubChapters(chapterId);
  //     setSubChapters(subChapters);
  //   };

  //   const handleSubChapterSelect = (subChapterId: number) => {
  //     const index = subChapters.findIndex(
  //       (subChapter) => subChapter.id === subChapterId
  //     );
  //     const updatedSubChapters = immer.produce(subChapters, (draft) => {
  //       draft[index].checked = !draft[index].checked;
  //     });
  //     setSubChapters(updatedSubChapters);
  //   };

  return (
    <DataTable
      noHeader
      minHeight={100}
      columns={[
        {
          accessor: "name",
          render: ({ id, name }) => (
            <Group ml="lg" spacing="xs" noWrap>
              <IconChevronRight
                size="0.9em"
                className={cx(classes.expandIcon, {
                  [classes.expandIconRotated]: expandedRecordIds.includes(id),
                })}
              />
              <IconPencil size="0.9em" />
              <Text>{name}</Text>
            </Group>
          ),
        },
      ]}
      records={subChapters}
      fetching={isLoading}
      rowExpansion={{
        allowMultiple: false,
        expanded: {
          recordIds: expandedRecordIds,
          onRecordIdsChange: setExpandedRecordIds,
        },
        content: ({ record }) => <SubtopicTable subchapterId={record.id} />,
      }}
    />
  );
};

export default SubchapterTable;
