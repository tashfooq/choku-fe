import React, { useContext, useState } from "react";
import { DataTable } from "mantine-datatable";
import { IconChevronRight, IconWriting } from "@tabler/icons-react";
import { Group, Text } from "@mantine/core";
import { SubChapter, SubTopic } from "../types";
import { useQuery } from "@tanstack/react-query";
import { contentService } from "../services/ContentService";
import { createStyles, px } from "@mantine/core";
import { useSubTopic } from "../common/queries";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = createStyles((theme) => ({
  subTopicName: {
    marginLeft: px(theme.spacing.xl) * 6,
  },
}));

const SubtopicTable = ({ subChapterId }: { subChapterId: number }) => {
  const { isAuthenticated } = useAuth0();
  const { data: subTopics, isLoading } = useSubTopic(
    subChapterId,
    isAuthenticated
  );
  const { selectedSubTopics, setSelectedSubTopics } = useContext(
    ProgressContext
  ) as ProgressContextType;
  const { classes } = useStyles();

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
      selectedRecords={selectedSubTopics}
      onSelectedRecordsChange={setSelectedSubTopics}
    />
  );
};

export default SubtopicTable;
