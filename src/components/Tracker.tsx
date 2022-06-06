import React, { useState, useEffect } from "react";
import { Accordion, Button, Select, Tab, Table } from "@mantine/core";

const Tracker = () => {
  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [value, setValue] = useState<string | null>(""); //these needs to be renamed to something more appropriate
  const [subTopics, setSubTopics] = useState<any[]>([]); //figure out a more appropriate type for this and avoid using any

  const getTextbooks = async () => {
    const response = await fetch("http://localhost:3001/course/textbooks");
    const { textbooks } = await response.json();
    setTextbooks(textbooks);
  };

  const getChapters = async (textbookId: number) => {
    const response = await fetch(
      `http://localhost:3001/course/textbooks/${textbookId}/chapters`
    );
    const { chapters } = await response.json();
    setChapters(chapters);
  };

  const getSubtopics = async (chapterId: number) => {
    const response = await fetch(
      `http://localhost:3001/course/subtopic/${chapterId}`
    );
    const { subtopics } = await response.json();
    if (
      subTopics.filter((topic) => topic.chapter_id === chapterId).length !== 0
    ) {
      return;
    }
    setSubTopics((prev) => [...prev, ...subtopics]);
  };

  useEffect(() => {
    getTextbooks();
  }, []);

  useEffect(() => {
    var textbookId = Number(value);
    if (textbookId !== 0) {
      getChapters(textbookId);
    }
  }, [value]);

  return (
    <>
      <Button onClick={() => console.log(chapters)}>Tracker</Button>
      <Select
        value={value}
        placeholder="Pick a resource"
        onChange={setValue}
        data={textbooks.map(({ textbook_id, name }) => {
          return { value: textbook_id, label: name };
        })}
      />
      <Accordion>
        {chapters.map(({ chapter_id, name }) => {
          return (
            <Accordion.Item
              key={chapter_id}
              label={name}
              onClick={() => getSubtopics(chapter_id)}
            >
              <Table>
                <tbody>
                  {subTopics
                    .filter((topic) => topic.chapter_id === chapter_id)
                    .map(({ Name, subchapter_id }) => {
                      return (
                        <tr>
                          <td>{Name}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Accordion.Item>
          );
        })}
      </Accordion>
      <p>{value}</p>
    </>
  );
};

export default Tracker;
