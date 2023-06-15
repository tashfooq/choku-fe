import React, { useContext, useEffect, useState } from "react";
import { DataTable, DataTableRowExpansionProps } from "mantine-datatable";
import { IconChevronRight, IconPencil } from "@tabler/icons-react";
import { Group, Text } from "@mantine/core";
import { SubChapter } from "../types";
import { useQuery } from "@tanstack/react-query";
import { contentService } from "../services/ContentService";
import { createStyles, px } from "@mantine/core";
import SubtopicTable from "./SubtopicTable";
import { useSubChapter } from "../common/queries";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = createStyles((theme) => ({
  expandIcon: {
    transition: "transform 0.2s ease",
  },
  expandIconRotated: {
    transform: "rotate(90deg)",
  },
}));

const SubchapterTable = ({ chapterId }: { chapterId: number }) => {
  const { isAuthenticated } = useAuth0();
  const { data: subChapters, isLoading } = useSubChapter(
    chapterId,
    isAuthenticated
  );
  const [expandedRecordIds, setExpandedRecordIds] = useState<number[]>([]);
  // FIGURE OUT CONDITIONAL EXPANSION
  // const [shouldExpand, setShouldExpand] =
  //   useState<DataTableRowExpansionProps<SubChapter>["trigger"]>("click");
  const { selectedSubChapters, setSelectedSubChapters } = useContext(
    ProgressContext
  ) as ProgressContextType;
  const { cx, classes } = useStyles();

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
      selectedRecords={selectedSubChapters}
      onSelectedRecordsChange={setSelectedSubChapters}
      rowExpansion={{
        allowMultiple: false,
        expanded: {
          recordIds: expandedRecordIds,
          onRecordIdsChange: setExpandedRecordIds,
        },
        content: ({ record }) => <SubtopicTable subChapterId={record.id} />,
      }}
    />
  );
};

export default SubchapterTable;
