import React, { useContext, useEffect, useState } from "react";
import { Modal, Title, MultiSelect, Button, Group } from "@mantine/core";
import { contentService } from "../services/ContentService";
import { IconDeviceFloppy } from "@tabler/icons";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";

type MaterialPickerProps = {
  isModalView: boolean;
  isOpen: boolean;
  closer(state: boolean): void;
};

const MaterialPicker = ({
  isModalView,
  isOpen,
  closer,
}: MaterialPickerProps) => {
  const [multiSelectData, setMultiSelectData] = useState([]);
  // replacing this with setter from context
  // type issue here
  const [selected, setSelected] = useState<any[]>([]);
  const { selectedMaterialIds, setSelectedMaterialIds } = useContext(
    ProgressContext
  ) as ProgressContextType;

  const getMaterial = async () => {
    const books = await contentService.getAllTextbooks();
    console.log(books);
    const formatted = books.map((b: any) => {
      return { value: b.textbook_id, label: b.name };
    });
    console.log(formatted);
    setMultiSelectData(formatted);
  };

  const saveMaterials = () => {
    console.log(selectedMaterialIds);
    setSelectedMaterialIds(selected);
  };

  useEffect(() => {
    getMaterial();
  }, []);

  if (isModalView) {
    return (
      <>
        <Modal
          size="lg"
          title={<Title order={4}>Tracker Settings</Title>}
          opened={isOpen}
          onClose={() => closer(false)}
        >
          <MultiSelect
            data={multiSelectData}
            label="Pick material you want to track!"
            placeholder="Type in material name"
            value={selected}
            onChange={setSelected}
            searchable
            clearable
          />
          <Group position="right">
            <Button mt={10}>Change settings</Button>
            <Button
              mt={10}
              leftIcon={<IconDeviceFloppy size={18} />}
              onClick={saveMaterials}
            >
              Save
            </Button>
          </Group>
        </Modal>
      </>
    );
  }

  return (
    <>
      {multiSelectData.map((e) => {
        <div>{e}</div>;
      })}
    </>
  );
};

export default MaterialPicker;
