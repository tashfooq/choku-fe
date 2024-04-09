import { Button, Container, Group, Select } from "@mantine/core";
import { IconBook2 } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCustomQueries from "../common/queries";

const Tracker = () => {
  const { useProgress } = useCustomQueries();

  const onProgressFetch = () => {
    console.log("Fetching progress...");
  };
  const { data: progress } = useProgress(onProgressFetch);
  const navigate = useNavigate();

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
