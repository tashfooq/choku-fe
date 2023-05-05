import { Accordion } from "@mantine/core";
import React from "react";
import { SubChapter, SubTopic } from "./Tracker";

interface AccordionItemProps {
  id: number;
  name: string;
  getter: (entityId: number) => Promise<void>;
  entities: (SubTopic | SubChapter)[];
}
const AccordionItem = ({
  id,
  name,
  getter,
  entities,
  children,
}: React.PropsWithChildren<AccordionItemProps>) => {
  return (
    <Accordion.Item key={id} value={name} onClick={() => getter(id)}>
      <Accordion.Control>{name}</Accordion.Control>
      <Accordion.Panel>{entities.length > 0 && children}</Accordion.Panel>
    </Accordion.Item>
  );
};

export default AccordionItem;
