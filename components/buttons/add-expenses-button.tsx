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
import { AddExpenseForm } from "../forms/add-expenses-form";
import { createExpense } from "@/app/actions/expense";

export default function AddExpenseButton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button title="Add Expense" size="sm">
            <span className="sr-only">Open menu</span>
            Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Add Expense</DialogTitle>
          </DialogHeader>
          <AddExpenseForm createExpense={createExpense} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
