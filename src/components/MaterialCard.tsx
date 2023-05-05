import React, { useState } from "react";
import { Button, Card, Image, Text } from "@mantine/core";

type MaterialCardProps = {
  id: number;
  title: string;
  author?: string;
  handleMaterialCardSelect: (id: number) => void;
  // need to pass in state handler for onclick of select
};

const MaterialPicker = ({
  id,
  title,
  author,
  handleMaterialCardSelect,
}: MaterialCardProps) => {
  return (
    <Card>
      <Card.Section></Card.Section>

      <Text weight={500}>{title}</Text>

      <Text size="sm" color="dimmed">
        {author}
      </Text>

      <Button
        value={id}
        onClick={() => handleMaterialCardSelect(id)}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
      >
        Select
      </Button>
    </Card>
  );
};

export default MaterialPicker;
