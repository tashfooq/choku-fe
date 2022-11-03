import React, { useState } from "react";
import { Button, Card, Image, Text } from "@mantine/core";

type MaterialCardProps = {
  title: string;
  author: string;
  // need to pass in state handler for onclick of select
};

const MaterialPicker = ({ title, author }: MaterialCardProps) => {
  return (
    <Card>
      <Card.Section>
        <Image
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Text weight={500}>{title}</Text>

      <Text size="sm" color="dimmed">
        {author}
      </Text>

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Select
      </Button>
    </Card>
  );
};

export default MaterialPicker;
