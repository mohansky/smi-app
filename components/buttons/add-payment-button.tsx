"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { AddPaymentForm } from "../forms/add-payment-form";
import { createPayment } from "@/app/actions/payment";

export default function AddPaymentButton({ id }: { id: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Add Fee Payment" size="sm">
          <span className="sr-only">Open menu</span>
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Fee Payment</DialogTitle>
        </DialogHeader>
        <AddPaymentForm
          studentId={id}
          createPayment={createPayment}
          onSuccess={() => toast.success("Payment added successfully!")}
        />
      </DialogContent>
    </Dialog>
  );
}
