import { getAllExpenses } from "@/app/actions/expense";
import { z } from "zod";

// Define the expense schema
export const expenseSchema = z.object({
  id: z.number().int().positive().optional(),  
  date: z.date().default(() => new Date()),
  amount: z.coerce.number().positive({ message: "Please enter a valid expense amount." }),
  description: z.string().min(3, { message: "Description is required" }),
  category: z.enum(["UTILITIES", "RENT", "MISC"]).default("MISC"),
  expenseStatus: z.enum(["DUE", "PAID"]).default("PAID"),
  paymentMethod: z.enum(["CASH", "CARD"]).default("CASH"),
  transactionId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

// Define the filter schema
export const expenseFilterSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  status: z.enum(["ALL", "DUE", "PAID"]).default("ALL"),
  category: z.enum(["ALL", "UTILITIES", "RENT", "MISC"]).default("ALL"),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ExpenseFilterParams = z.infer<typeof expenseFilterSchema>;

export type ExpensesResponse = Awaited<ReturnType<typeof getAllExpenses>>;
