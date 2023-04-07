import { useReactTable } from "@tanstack/react-table";
import React, { useMemo } from "react";
// import { useTable, useExpanded } from "react-table";

const ExpandableTable = ({ columns }) => {
  type RandomData = {
    name: string;
    phone: string;
    address: string;
    email: string;
  };

  const data: RandomData[] = [
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useReactTable({
      columns,
      data,
    });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <React.Fragment key={row.getRowProps().key}>
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
              {row.isExpanded && (
                <tr>
                  <td colSpan={columns.length}>
                    {/* The content to be displayed when the row is expanded */}
                    <p>{row.original.description}</p>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default ExpandableTable;
