import { useContext, useEffect, useState } from "react";
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
// import { contentService } from "../hooks/services/ContentService";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import useCustomQueries from "../common/queries";
// import useTextbookSelect from "../hooks/useTextbookSelect";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";

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
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any[]>([]);
  const { useTextbooks } = useCustomQueries();
  const { selectedTextbookIds, setSelectedTextbookIds } = useContext(
    ProgressContext,
  ) as ProgressContextType;

  const { data: textbooks, isLoading, isSuccess } = useTextbooks();

  const formatForMultiSelect = (): (string | SelectItem)[] => {
    if (!isLoading && isSuccess) {
      return textbooks?.map(({ id, name }: SelectItem) => {
        return { value: id, label: name };
      });
    }
    return ["Was not able to retrieve"];
  };

  const saveMaterials = async () => {
    try {
      console.log("Selected", selected);
      if (isModalView) {
        closer(false);
      } else {
        navigate("/tracker");
      }
    } catch (e) {
      console.error("Failed to save", e);
    }
  };

  const PickerContent = ({ position }: { position: GroupPosition }) => {
    return (
      <Stack spacing={30}>
        <MultiSelect
          data={formatForMultiSelect()}
          label="Pick material you want to track"
          placeholder="Type in material name"
          value={selected}
          onChange={setSelected}
          searchable
          clearable
          size="md"
        />
        <Group position={position}>
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
      <Modal
        size="lg"
        title={<Title order={4}>Tracker Settings</Title>}
        opened={isOpen}
        onClose={() => closer(false)}
      >
        <PickerContent position="right" />
      </Modal>
    );
  }

  return (
    <Center>
      <PickerContent position="left" />
    </Center>
  );
};

export default MaterialPicker;
