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
// import { toast } from "sonner";
import { AddPaymentForm } from "../forms/add-payment-form";
import { createPayment } from "@/app/actions/payment";

export default function AddPaymentButton({ id, className }: { id: number, className?: string }) {
  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button title="Add Fee Payment" size="sm">
            <span className="sr-only">Open menu</span>
            Add Payment
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Add Fee Payment</DialogTitle>
          </DialogHeader>
          <AddPaymentForm
            studentId={id}
            createPayment={createPayment} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
