import { Button, Container, Group, Select } from "@mantine/core";
import { IconBook2 } from "@tabler/icons-react";
import useProgressFetch from "../hooks/useProgressFetch";

const Tracker = () => {
  const { fetchProgressInitial } = useProgressFetch();

  const progress = fetchProgressInitial();
  console.log(progress);

  return (
    <Container size="xl" px="md">
      <Group position="apart">
        <Select
          value={null}
          placeholder="Pick a resource"
          onChange={() => console.log(null)}
          data={["string"]}
        />
        <Button
          leftIcon={<IconBook2 />}
          style={{ marginRight: 10 }}
          onClick={() => console.log(null)}
        >
          Update Tracker Material
        </Button>
      </Group>
    </Container>
  );
};

export default Tracker;
