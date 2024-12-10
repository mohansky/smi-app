"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { StudentFormValues } from "@/lib/validations/student";
import DateFormatter from "../custom-ui/date-format";
import Link from "next/link";
// import { EyeIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { DeleteButton } from "../buttons/delete-button";
import { deleteStudent } from "@/app/actions/student";

export const studentsColumns: ColumnDef<StudentFormValues>[] = [
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <Button variant="link" className="p-0">
        <a
          href={`mailto:${row.getValue("email")}`}
          title={`Mail ${row.getValue("name")}`}
        >
          {row.getValue("email")}
        </a>
      </Button>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <Button variant="link" className="p-0">
        <a
          href={`tel:${row.getValue("phone")}`}
          title={`Call ${row.getValue("name")}`}
        >
          {row.getValue("phone")}
        </a>
      </Button>
    ),
  },
  {
    accessorKey: "instrument",
    header: "Instrument",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("instrument")}</div>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => (
      <DateFormatter dateString={row.getValue("dateOfBirth")} />
    ),
  },
  {
    accessorKey: "joiningDate",
    header: "Joining Date",
    cell: ({ row }) => (
      <DateFormatter dateString={row.getValue("joiningDate")} />
    ),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <Badge
        className={`capitalize ${
          row.getValue("isActive")
            ? "bg-active hover:text-active"
            : "bg-destructive hover:text-destructive"
        }`}
      >
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "viewStudent",
    header: "View Student",
    cell: ({ row }) => (
      <Link className="capitalize" href={`/students/${row.getValue("id")}`}>
        <Button size="sm">
          {/* <EyeIcon className="mr-1 h-4 w-4" /> */}
          View
        </Button>
      </Link>
    ),
  },
  {
    id: "actions",
    header: "Delete",
    cell: ({ row }) => {
      const { id, name } = row.original;
      if (typeof id !== "number") return null;
      return ( 
        <DeleteButton
          id={id}
          identifier={name}
          deleteAction={deleteStudent}
          entityType="Student Record"
          additionalDescription="If the student record is associated with payment or attendance records, they will also be deleted."
        />
      );
    },
  },
];
