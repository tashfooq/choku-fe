import React, { useState, useEffect, useContext, Fragment } from "react";
import { Container, Group, Select, Table, Checkbox, Box } from "@mantine/core";
import { contentService } from "../services/ContentService";
import ProgressContext, {
  ProgressContextType,
  Progress,
} from "../context/ProgressContext";
import { useQuery } from "@tanstack/react-query";
import { progressService } from "../services/ProgressService";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { IconCaretDown, IconCaretRight } from "@tabler/icons";

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

const Tracker = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      localStorage.setItem("token", token);
    })();
  }, [isLoading, getAccessTokenSilently]);

  const [tabledata, setTableData] = useState([]);
  const [textbooks, setTextbooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [textbookSelectValue, setTextbookSelectValue] = useState<string | null>(
    null
  );
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

  const columnHelper = createColumnHelper<Chapter>();

  const columns = [
    columnHelper.accessor("name", {
      // cell: (info) => info.getValue(),
      cell: ({ row, getValue }) => (
        <>
          <Box style={{ display: "flex", gap: 10 }}>
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
            <button {...{ onClick: row.getToggleExpandedHandler() }} />
            {row.getIsExpanded() ? (
              <IconCaretDown />
            ) : (
              // <IconCaretRight
              //   onClick={() => {
              //     row.getToggleExpandedHandler();
              //     handleChapterSelect(Number(row.original.id));
              //   }}
              // />
              <IconCaretRight onClick={row.getToggleExpandedHandler} />
              // <button {...{ onClick: row.getToggleExpandedHandler() }} />
            )}
            {getValue()}
          </Box>
        </>
      ),
      footer: (info) => info.column.id,
    }),
  ];

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
    setChapters(chapters);
    // setTableData(chapters);
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

  const handleChapterSelect = async (id: number) => {
    console.log(id);
    const subchapters = await contentService.getSubChapters(id);
    console.log(subchapters);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            // <Fragment key={row.id}>
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            // </Fragment>
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

const renderSubComponent = ({ row }: { row: Row<Chapter> }) => {
  console.log(row.getIsExpanded);
  return (
    <>
      <div>Hello</div>
    </>
  );
};

export default Tracker;
