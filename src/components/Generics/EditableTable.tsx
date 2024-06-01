import { useState } from "react";
import React from "react";
import { MagicMotion } from "react-magic-motion";

type Row = { [key: string]: number };

export const useEditableTable = (initialRows: Row[] | null) => {
  const [rows, setRows] = useState<Row[]>(initialRows || []);

  const updateRow = (rowIndex: number, key: string, value: any) => {
    if (isNaN(value) || value < 0) {
      return;
    }

    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex][key] = value;
      return newRows;
    });
  };

  const updateRows = (rowsUpdate: Row[]) => {
    setRows(rowsUpdate);
  };

  const areAllRowsGreaterThanZero = () => {
    return rows.every((row) => {
      return Object.values(row).every((value) => {
        return typeof parseFloat(value.toString()) === "number" && value > 0;
      });
    });
  };

  return { rows, updateRow, areAllRowsGreaterThanZero, updateRows };
};

type DataTableProps = {
  title: string;
  subtitle: string;
  headers: string[];
  isEditable?: boolean;
  updateRow: (rowIndex: number, key: string, value: any) => void;
  rows: Row[];
};

export const EditDataTable: React.FC<DataTableProps> = ({
  title,
  subtitle,
  headers,
  isEditable = false,
  updateRow,
  rows,
}) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    key: string
  ) => {
    updateRow(rowIndex, key, event.target.value);
  };

  return (
    <MagicMotion>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            {title}
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headers.map((header, index) => (
                <th scope="col" key={index} className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                {Object.keys(row).map((key, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {isEditable ? (
                      <input
                        type="number"
                        value={row[key]}
                        onChange={(event) => handleChange(event, rowIndex, key)}
                        className="min-w-[65px] max-w-1 w-max px-2 py-1 border rounded"
                      />
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MagicMotion>
  );
};
