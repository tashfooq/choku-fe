import React, { useEffect, useState } from "react";
import { Accordion, NumberInput, Table } from "@mantine/core";
import { IconBook, IconCircleDashed, IconCircleDotted } from "@tabler/icons";
import { SubChapter, SubTopic } from "./Tracker";
import AccordionItem from "./AccordionItem";
import { contentService } from "../services/ContentService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface ItemsProps {
  items: SubChapter[];
  parentItemId: number;
  record: (
    itemId: number,
    items: (SubChapter | SubTopic)[],
    passes?: number
  ) => void;
}

const Items = ({ items, parentItemId, record }: ItemsProps) => {
  // const queryClient = useQueryClient();
  // const query = useQuery({queryKey: ['subtopics', subchapterId], })
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);

  const instanceOfSubChapter = (object: any): object is SubChapter => {
    return "chapter_id" in object;
  };

  const filterSubchapters = (subchapterList: SubChapter[]) => {
    return subchapterList.filter((each) => each.chapter_id === parentItemId);
  };

  const filterSubtopics = (
    subtopicList: SubTopic[],
    parentSubchapterId: number
  ) => {
    return subtopicList.filter(
      (each) => each.subchapter_id === parentSubchapterId
    );
  };

  // const filterByType = (list: SubTopic | SubChapter) => {
  //   if (instanceOfSubChapter(list)) {
  //     return filterSubchapters(items as SubChapter[]);
  //   }
  //   return filterSubtopics(items as SubTopic[]);
  // };

  const getSubtopicsBySubchapterId = async (subchapterId: number) => {
    const subtopics = await contentService.getSubtopics(subchapterId);
    setSubtopics(filterSubtopics(subtopics, subchapterId));
    return subtopics;
  };

  const tableRow = (id: number, name: string) => {
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
  };

  return (
    <Table>
      <tbody>
        {filterSubchapters(items).map((item) => {
          if (item.st_count > 0) {
            return (
              <AccordionItem
                id={item.id}
                name={item.name}
                getter={() => getSubtopicsBySubchapterId(item.id)}
                entities={items}
              >
                {tableRow(item.id, item.name)}
              </AccordionItem>
            );
          } else {
            return tableRow(item.id, item.name);
          }
        })}
      </tbody>
    </Table>
  );
};

export default Items;
