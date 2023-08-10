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
import { useProgress } from "../common/queries";
import { useAuth0 } from "@auth0/auth0-react";

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
  const { isAuthenticated } = useAuth0();
  const {
    data: textbooks,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["textbooks"],
    queryFn: contentService.getAllTextbooks,
  });
  const { data: progress } = useProgress(isAuthenticated);
  const navigate = useNavigate();
  const { saveProgressFromPicker, setSelectedTextbookIds } = useContext(
    ProgressContext
  ) as ProgressContextType;
  const [selected, setSelected] = useState<any[]>([]);

  // maybe move this to the onSuccess portion of the react query
  useEffect(() => {
    if (progress && progress.selectedTextbookIds.length > 0) {
      setSelected(progress.selectedTextbookIds);
      setSelectedTextbookIds(progress.selectedTextbookIds);
    }
  }, [progress, setSelected, setSelectedTextbookIds]);

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
      try {
        setSelectedTextbookIds(selected);
        saveProgressFromPicker(selected);
        closer(false);
      } catch (e) {
        console.log("failed to save");
      }
      return;
    }
    try {
      setSelectedTextbookIds(selected);
      saveProgressFromPicker(selected);
      navigate("/tracker");
    } catch (e) {
      console.log("failed to save");
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
