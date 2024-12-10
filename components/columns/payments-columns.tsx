"use client";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentFormValues } from "@/lib/validations/payments";
import { CaretSortIcon } from "@radix-ui/react-icons"; 
import { deletePaymentRecord } from "@/app/actions/payment";
import { Button } from "../ui/button";
import { DeleteButton } from "../buttons/delete-button";
import DateFormatter from "../custom-ui/date-format";

export const paymentColumns: ColumnDef<PaymentFormValues>[] = [
  {
    accessorKey: "studentId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="m-0 p-0 "
          size="sm"
        >
          Student ID
          <CaretSortIcon className="ml-1 h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("studentId")}</div>
    ),
  },
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => (
      <div
        className={`capitalize ${
          row.getValue("paymentMethod") === "CASH"
            ? "text-active"
            : "text-destructive"
        }`}
      >
        {row.getValue("paymentMethod") === "CASH" ? "Cash" : "Card"}
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`capitalize ${
          row.getValue("paymentStatus") === "PAID"
            ? "text-active"
            : "text-destructive"
        }`}
      >
        {row.getValue("paymentStatus") === "PAID" ? "Paid" : "Due"}
      </div>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("transactionId")}</div>
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
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;
      const total = rows.reduce((sum, row) => {
        return sum + parseFloat(row.getValue("amount") || "0");
      }, 0);

      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      }).format(total);

      return (
        <div className="text-right font-bold py-2">Total: {formatted}</div>
      );
    },
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const { id, transactionId } = row.original;
      if (typeof id !== "number") return null;
      return ( 
        <DeleteButton
          id={id}
          identifier={`Transaction ${transactionId}`} 
          deleteAction={deletePaymentRecord}
          entityType="Payment Record"
        />
      );
    },
  },
];
