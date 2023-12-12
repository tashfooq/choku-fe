import React, { useContext, useEffect, useState } from "react";
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
import { IconDeviceFloppy } from "@tabler/icons-react";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
    queryKey: ["textbooks"],
    queryFn: contentService.getAllTextbooks,
  });
  const navigate = useNavigate();
  const {
    saveProgressFromPicker,
    setSelectedTextbookIds,
    selectedTextbookIds,
  } = useContext(ProgressContext) as ProgressContextType;
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    setSelected(selectedTextbookIds);
  }, [selectedTextbookIds]);

  const formatForMultiSelect = (): (string | SelectItem)[] => {
    // add a check to see if textbooks is empty
    if (!isLoading && isSuccess) {
      return textbooks?.map(({ id, name }: SelectItem) => {
        return { value: id, label: name };
      });
    }
    return ["Was not able to retrieve"];
  };

  const saveMaterials = () => {
    try {
      setSelectedTextbookIds(selected);
      saveProgressFromPicker(selected);
      if (isModalView) {
        closer(false);
      } else {
        navigate("/tracker");
      }
    } catch (e) {
      console.error("Failed to save", e);
    }
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
