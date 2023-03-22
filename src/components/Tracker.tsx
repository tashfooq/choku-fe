import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Group,
  Accordion,
  Button,
  Select,
  Table,
} from "@mantine/core";
import { IconDeviceFloppy, IconBook2 } from "@tabler/icons";
import MaterialPicker from "./MaterialPicker";
import { contentService } from "../services/ContentService";
import ProgressContext, {
  ProgressContextType,
  Progress,
} from "../context/ProgressContext";
import Items from "./Items";
import AccordionItem from "./AccordionItem";
import { useQuery } from "@tanstack/react-query";
import { progressService } from "../services/ProgressService";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import AuthContext, { AuthContextType } from "../context/AuthContext";
import { AxiosError } from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface Item {
  id: number;
  name: string;
  checked?: boolean;
  passes?: number;
}

type Chapter = {
  id: number;
  name: string;
  textbookId: number;
};

export interface SubChapter extends Item {
  chapter_id: number;
  st_count: number;
}

export interface SubTopic extends Item {
  subchapter_id: number;
}

const columnHelper = createColumnHelper<Chapter>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

const Tracker = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // if (!isLoading && !isAuthenticated) {
      //   navigate("/home");
      // } else {
      //   const token = await getAccessTokenSilently();
      //   console.log(token);
      //   localStorage.setItem("token", token);
      // }
      const token = await getAccessTokenSilently();
      console.log(token);
      localStorage.setItem("token", token);
    })();
  }, [isLoading, isAuthenticated, navigate, getAccessTokenSilently]);

  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    null
  ); //these needs to be renamed to something more appropriate
  // const [subChapters, setSubChapters] = useState<any[]>([]); //figure out a more appropriate type for this and avoid using any
  // const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { updateProgress, selectedTextbookIds, setSelectedTextbookIds } =
    useContext(ProgressContext) as ProgressContextType;

  const { data: progy, isSuccess } = useQuery({
    queryKey: ["progress"],
    queryFn: progressService.getProgress,
    onError(err: AxiosError) {
      if (err.response?.status === 404) {
        navigate("/picker");
      }
    },
  });

  const getTextbooks = async () => {
    const allTextbooks = await contentService.getAllTextbooks();
    // this is actually retarded because why would i get all textbooks and filter on the front end
    // right now it's not a big deal because there are so few textbook
    if (isSuccess) {
      if (!!allTextbooks) {
        setTextbooks(
          allTextbooks.filter(({ id }: any) =>
            progy.selectedTextbookIds.includes(id)
          )
        );
      }
      setSelectedTextbookIds(progy.selectedTextbookIds);
      return;
    }
    setSelectedTextbookIds([]);
  };

  const getChapters = async (textbookId: number) => {
    const chapters = await contentService.getChapters(textbookId);
    console.log(chapters);
    setChapters(chapters);
  };

  // const saveProgress = async () => {
  //   const subChapterProgress = subChapters.reduce((prev, curr) => {
  //     const prog: Progress = {
  //       id: curr.id,
  //       ...(curr.passes && { passes: curr.passes }),
  //     };
  //     curr.checked === true && prev.push(prog);
  //     return prev;
  //   }, []);
  //   updateProgress(subChapterProgress);
  // };

  // useEffect(() => {
  //   getTextbooks();
  // }, [selectedTextbookIds]);

  useEffect(() => {
    var textbookId = Number(textbookSelectValue);
    if (textbookId !== 0) {
      getChapters(textbookId);
    }
  }, [textbookSelectValue]);

  const table = useReactTable({
    data: chapters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(chapters);

  return (
    <Container size="xl" px="md">
      <Group style={{ margin: 10 }} position="apart">
        <Select
          value={textbookSelectValue}
          placeholder="Pick a resource"
          onClick={getTextbooks}
          onChange={setTextbookSelectValue}
          data={textbooks.map(({ id, name }) => {
            return { value: id, label: name };
          })}
        />
        {/* <div>
          <Button
            leftIcon={<IconBook2 size={18} />}
            style={{ marginRight: 10 }}
            onClick={() => setSettingsModalOpen(true)}
          >
            Update Tracker Material
          </Button>
          <Button
            leftIcon={<IconDeviceFloppy size={18} />}
            onClick={saveProgress}
          >
            Save
          </Button>
        </div> */}
      </Group>
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {/* <Accordion>
        {chapters?.map(({ id, name }) => {
          return (
            <AccordionItem
              id={id}
              name={name}
              getter={getSubChaptersByChapterId}
              entities={subChapters}
            >
              <Items
                items={subChapters}
                parentItemId={id}
                record={recordCheckOrPasses}
              />
            </AccordionItem>
          );
        })}
      </Accordion> */}
      {/* <MaterialPicker
        isModalView={true}
        isOpen={settingsModalOpen}
        closer={setSettingsModalOpen}
      /> */}
    </Container>
  );
};

export default Tracker;
