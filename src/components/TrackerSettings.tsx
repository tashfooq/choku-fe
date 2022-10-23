import React, { useState } from "react";
import { Modal, Title, MultiSelect, Button, Group, Switch} from "@mantine/core";

type TrackerSettingsProps = { isOpen: boolean; closer(state: boolean): void };

const TrackerSettings = ({ isOpen, closer }: TrackerSettingsProps) => {
  const [showPasses, setShowPasses] = useState(true)

  const data = [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
    { value: "riot", label: "Riot" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
  ];

  return (
    <>
      <Modal
        title={<Title order={4}>Tracker Settings</Title>}
        opened={isOpen}
        onClose={() => closer(false)}
      >
        <MultiSelect
          data={data}
          label="Your favorite frameworks/libraries"
          placeholder="Pick all that you like"
          searchable
        />
        <Switch label="Track passes" onChange={() => setShowPasses((prev) => !prev)} />
        <Group position="right">
        <Button mt={10}>Change settings</Button>
        </Group>
      </Modal>
    </>
  );
};

export default TrackerSettings;
