"use client";
import { ColumnDef } from "@tanstack/react-table";
import DateFormatter from "../custom-ui/date-format";
import { PaymentFormValues } from "@/lib/validations/payments";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
// import { DeletePaymentButton } from "../buttons/old/delete-payment-button";
import { DeleteButton } from "../buttons/delete-button";
import { deletePaymentRecord } from "@/app/actions/payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Calendar,
  CreditCard,
  Tag,
  CheckCircle2,
  MessageCircle,
  BadgeIndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const studentPaymentColumns: ColumnDef<PaymentFormValues>[] = [
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
    cell: ({ row }) => {
      const {
        id,
        date,
        // description,
        paymentMethod,
        paymentStatus,
        transactionId,
        notes,
        amount,
      } = row.original;
      if (typeof id !== "number") return null;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="p-0">
              <span className="sr-only">Open payment details</span>
              <div className="capitalize hover:underline">
                {row.getValue("description")}
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Payment Details
              </DialogTitle>
            </DialogHeader>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg capitalize">
                  {row.getValue("description")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    <DateFormatter dateString={date} />
                  </div>

                  <div className="flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Transaction ID:</span>
                    <span className="ml-2 text-sm">{transactionId}</span>
                  </div>

                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Payment Method:</span>
                    <span className="ml-2 capitalize">{paymentMethod}</span>
                  </div>

                  <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Payment Status:</span>
                    <span
                      className={`ml-2 capitalize ${
                        paymentStatus === "PAID"
                          ? "text-active"
                          : paymentStatus === "DUE"
                          ? "text-yellow-600"
                          : "text-destructive"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <BadgeIndianRupee className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Amount:</span>
                    <span className="ml-2 font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(amount)}
                    </span>
                  </div>

                  {notes && (
                    <div className="flex items-start">
                      <MessageCircle className="mr-2 h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <span className="font-medium">Notes:</span>
                        <p className="text-sm text-muted-foreground ml-2">
                          {notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      );
    },
    // cell: ({ row }) => (
    //   <Dialog>
    //     <DialogTrigger asChild>
    //       <Button variant="link" className="p-0">
    //         <span className="sr-only">Open menu</span>
    //         <div className="capitalize">{row.getValue("description")}</div>
    //       </Button>
    //     </DialogTrigger>
    //     <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto">
    //       <DialogHeader>
    //         <DialogTitle className="sr-only">
    //           <div className="capitalize">{row.getValue("description")}</div>
    //         </DialogTitle>
    //       </DialogHeader>
    //       <div className="capitalize">{row.getValue("date")}</div>
    //       <div className="capitalize">{row.getValue("description")}</div>
    //       <div className="capitalize">{row.getValue("paymentMethod")}</div>
    //       <div className="capitalize">{row.getValue("paymentStatus")}</div>
    //     </DialogContent>
    //   </Dialog>
    //   // <div className="capitalize">{row.getValue("description")}</div>
    // ),
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
          identifier={transactionId as string}
          deleteAction={deletePaymentRecord}
          entityType="Delete payment record"
          additionalDescription={`Are you sure you want to delete this payment record for ${transactionId}? This action cannot be undone.`}
        />
      );
    },
  },
];
