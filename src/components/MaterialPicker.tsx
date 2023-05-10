import React, { useContext, useState } from "react";
import {
  Modal,
  Title,
  MultiSelect,
  Button,
  Group,
  Center,
  SelectItem,
  GroupPosition,
  Stack,
} from "@mantine/core";
import { contentService } from "../services/ContentService";
import { IconDeviceFloppy } from "@tabler/icons";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import produce from "immer";

type MaterialPickerProps = {
  isModalView: boolean;
  isOpen?: boolean;
  closer?: (state: boolean) => void;
};

const MaterialPicker = ({
  isModalView,
  isOpen = false,
  closer = () => void 0,
}: MaterialPickerProps) => {
  const {
    data: textbooks,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["allTextbooks"],
    queryFn: contentService.getAllTextbooks,
  });
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any[]>([]);
  const { setSelectedTextbookIds, updateProgress, progress } = useContext(
    ProgressContext
  ) as ProgressContextType;

  const formatForMultiSelect = (): (string | SelectItem)[] => {
    if (!isLoading && isSuccess) {
      return textbooks?.map(({ id, name }: SelectItem) => {
        return { value: id, label: name };
      });
    }
    return ["Was not able to retrieve"];
  };

  const saveMaterials = () => {
    if (isModalView) {
      setSelectedTextbookIds(selected);
      closer(false);
      if (progress !== null) {
        const modifiedProgress = produce(progress, (draft) => {
          draft.selectedTextbookIds = selected;
        });
        updateProgress(modifiedProgress);
      }
      // this needs to update progress with react-query data
      // updateProgress(selected);
      return;
    }
    setSelectedTextbookIds(selected);
    if (progress !== null) {
      const modifiedProgress = produce(progress, (draft) => {
        draft.selectedTextbookIds = selected;
      });
      updateProgress(modifiedProgress);
    }
    // updateProgress(selected);
    navigate("/tracker");
  };

  const nonModalView = (pos: GroupPosition) => {
    return (
      <Stack spacing={30}>
        <MultiSelect
          data={formatForMultiSelect()}
          label="Pick material you want to track!"
          placeholder="Type in material name"
          value={selected}
          onChange={setSelected}
          searchable
          clearable
          size="md"
        />
        <Group position={pos}>
          <Button mt={10}>Change settings</Button>
          <Button
            mt={10}
            leftIcon={<IconDeviceFloppy />}
            onClick={saveMaterials}
          >
            Save
          </Button>
        </Group>
      </Stack>
    );
  };

  if (isModalView) {
    return (
      <>
        <Modal
          size="lg"
          title={<Title order={4}>Tracker Settings</Title>}
          opened={isOpen}
          onClose={() => closer(false)}
        >
          {nonModalView("right")}
        </Modal>
      </>
    );
  }

  return <Center>{nonModalView("left")}</Center>;
};

export default MaterialPicker;
