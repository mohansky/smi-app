"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { StudentFormValues } from "@/lib/validations/student";
import Link from "next/link"; 
import MarkAttendanceButton from "../buttons/mark-attendance-button";
import AddPaymentButton from "../buttons/add-payment-button";

export const addStudentsAttendancePaymentsColumns: ColumnDef<StudentFormValues>[] =
  [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID No.
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link
          className="capitalize"
          href={`/dashboard/admin/students/${row.getValue("id")}`}
        >
          <Button variant="link" className="p-0">
            {row.getValue("name")}
          </Button>
        </Link>
      ),
    },
    {
      id: "markAttendance",
      header: "Mark Attendance",
      cell: ({ row }) => {
        const { id } = row.original;
        if (typeof id !== "number") return null;
        return <MarkAttendanceButton id={id} />;
      },
    },
    {
      id: "addFeePayment",
      header: "Add Fee Payment",
      cell: ({ row }) => {
        const { id } = row.original;
        if (typeof id !== "number") return null;
        return <AddPaymentButton id={id} />;
      },
    },
  ];
