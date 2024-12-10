import { getAllPayments } from "@/app/actions/payment";
import { z } from "zod";

// Define the payment schema
export const paymentSchema = z.object({
  id: z.number().int().positive().optional(),
  studentId: z
    .number()
    .int()
    .positive({ message: "Student ID must be a positive integer" }),
  studentName: z.string().optional(),
  date: z.date(),
  amount: z.coerce.number().positive({ message: "Please enter an amount." }),
  description: z.string().min(1, { message: "Description is required" }),
  paymentMethod: z.enum(["CASH", "CARD"]),
  paymentStatus: z.enum(["DUE", "PAID"]),
  transactionId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

// Define the filter schema
export const filterSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  status: z.enum(["ALL", "DUE", "PAID"]).default("ALL"),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type FilterParams = z.infer<typeof filterSchema>;

export type PaymentsResponse = Awaited<ReturnType<typeof getAllPayments>>;
