import React, { useState } from "react";
import { Accordion, NumberInput, Table } from "@mantine/core";
import { IconBook, IconCircleDashed, IconCircleDotted } from "@tabler/icons";
import { SubChapter, SubTopic } from "./Tracker";

export interface ItemsProps {
  items: (SubChapter | SubTopic)[];
  parentItemId: number;
  record: (
    itemId: number,
    items: (SubChapter | SubTopic)[],
    passes?: number
  ) => void;
}

const Items = ({ items, parentItemId, record }: ItemsProps) => {
  const [shouldWrap, setShouldWrap] = useState(false);

  const instanceOfSubChapter = (object: any): object is SubChapter => {
    return "chapter_id" in object;
  };

  const filterSubChapters = (arg: SubChapter[]) => {
    return arg.filter((each) => each.chapter_id === parentItemId);
  };

  const filterSubTopics = (arg: SubTopic[]) => {
    return arg.filter((each) => each.subchapter_id === parentItemId);
  };

  const filterByType = (arg: SubTopic | SubChapter) => {
    if (instanceOfSubChapter(arg)) {
      return filterSubChapters(items as SubChapter[]);
    }
    return filterSubTopics(items as SubTopic[]);
  };

  return (
    <Table>
      <tbody>
        {filterByType(items[0]).map(({ name, id }) => {
          return (
            <tr key={id}>
              <td>{name}</td>
              <td>
                <div onClick={() => record(id, items)}>
                  {items.find((item) => item.id === id)?.checked ? (
                    <IconCircleDashed color="green" />
                  ) : (
                    <IconCircleDotted />
                  )}
                </div>
              </td>
              <td>
                <NumberInput
                  placeholder="Number of passes"
                  min={1}
                  icon={<IconBook size={18} />}
                  onChange={(passNumber) => record(id, items, passNumber)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default Items;
