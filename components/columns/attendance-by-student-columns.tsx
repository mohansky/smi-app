"use client";
import { ColumnDef } from "@tanstack/react-table";
import DateFormatter from "../custom-ui/date-format";
import { AttendanceFormValues } from "@/lib/validations/attendance";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

export const attendanceByStudentColumns: ColumnDef<AttendanceFormValues>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <DateFormatter dateString={row.getValue("date")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("notes")}</div>
    ),
  },
];
