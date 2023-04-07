import { IconArrowDown, IconArrowRight, IconHomeDown } from "@tabler/icons";
import {
  createColumnHelper,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

export type RandomData = {
  name: string;
  phone: string;
  address: string;
  email: string;
};

export const data: RandomData[] = [
  {
    name: "Vivian Perez",
    phone: "1-229-382-1075",
    address: "Ap #806-5811 Vestibulum Rd.",
    email: "sollicitudin.a@hotmail.com",
  },
  {
    name: "Felicia Boyd",
    phone: "(672) 435-2568",
    address: "P.O. Box 729, 2506 Non, Road",
    email: "metus.sit@outlook.ca",
  },
  {
    name: "Victoria Avila",
    phone: "(365) 562-5179",
    address: "292-6777 Aenean St.",
    email: "lorem@hotmail.com",
  },
  {
    name: "Farrah Ware",
    phone: "1-821-540-2111",
    address: "236-6425 Semper Rd.",
    email: "montes.nascetur@protonmail.edu",
  },
  {
    name: "Kadeem Mercado",
    phone: "1-752-477-5245",
    address: "857-1093 Dui Ave",
    email: "quis.turpis@hotmail.org",
  },
];

const Test = () => {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const columnHelper = createColumnHelper<RandomData>();
  const columns = [
    columnHelper.accessor("name", {
      cell: ({ row, getValue }) => {
        return (
          <>
            {row.getCanExpand() && (
              <button onClick={row.getToggleExpandedHandler}>
                {row.getIsExpanded() ? <IconArrowDown /> : <IconArrowRight />}
              </button>
            )}
            {getValue()}
          </>
        );
      },
    }),
    // columnHelper.accessor("phone", {
    //   cell: (info) => info.getValue(),
    // }),
    // columnHelper.accessor("address", {
    //   cell: (info) => info.getValue(),
    // }),
    // columnHelper.accessor("email", {
    //   cell: (info) => info.getValue(),
    // }),
  ];

  //   const table = useReactTable({
  //     data,
  //     columns,
  //     state: {
  //       expanded,
  //     },
  //     getCoreRowModel: getCoreRowModel(),
  //     // enableExpanding: true,
  //     onExpandedChange: setExpanded,
  //     getExpandedRowModel: getExpandedRowModel(),
  //     enableExpanding: true,
  //   });
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });
  return (
    <div className="p-2">
      <table>
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
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default Test;
