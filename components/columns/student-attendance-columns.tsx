"use client";
import { ColumnDef } from "@tanstack/react-table";
import { AttendanceFormValues } from "@/lib/validations/attendance";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { DeleteButton } from "../buttons/delete-button";
import { deleteAttendanceRecord } from "@/app/actions/attendance";
import DateFormatter from "../custom-ui/date-format";

export const studentAttendanceColumns: ColumnDef<AttendanceFormValues>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-20"
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
          identifier={studentId}
          deleteAction={deleteAttendanceRecord}
          entityType="Delete Attendance Record"
          additionalDescription={`Are you sure you want to delete the attendance record for ${studentId}? This action cannot be undone.`}
        />
      );
    },
  },
];
