"use client";
import { ColumnDef } from "@tanstack/react-table";
import DateFormatter from "../custom-ui/date-format";
import { AttendanceFormValues } from "@/lib/validations/attendance";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { DeleteButton } from "../buttons/delete-button";
import { deleteAttendanceRecord } from "@/app/actions/attendance";

export const attendanceColumns: ColumnDef<AttendanceFormValues>[] = [
  // {
  //   accessorKey: "studentId",
  //   header: "Student ID",
  //   cell: ({ row }) => (
  //     <div className="capitalize w-10">{row.getValue("studentId")}</div>
  //   ),
  // },
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
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
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const { id, studentId } = row.original;
      if (typeof id !== "number") return null;
      return (
        <DeleteButton
          id={id}
          identifier={`Student ${studentId}`}
          deleteAction={deleteAttendanceRecord}
          entityType="Attendance Record"
        />
      );
    },
  },
];
