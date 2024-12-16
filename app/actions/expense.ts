"use server";
import { db } from "@/db/drizzle";
import { expenses, InsertExpense } from "@/db/schema";
import { and, count, desc, eq, ilike, gte, lte } from "drizzle-orm";
import {
  ExpenseFilterParams,
  // ExpenseFormValues,
  expenseSchema,
} from "@/lib/validations/expenses";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ActionState, ExpenseFormState } from "@/types";

export async function getAllExpenses(params: ExpenseFilterParams) {
  const {
    page = 1,
    limit = 10,
    status = "ALL",
    category = "ALL",
    search,
    startDate,
    endDate,
  } = params;

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Build where conditions dynamically
  const whereConditions = [];

  // Status filter
  if (status !== "ALL") {
    whereConditions.push(eq(expenses.expenseStatus, status));
  }

  // Category filter
  if (category !== "ALL") {
    whereConditions.push(eq(expenses.category, category));
  }

  // Search filter (if search term provided)
  if (search) {
    whereConditions.push(ilike(expenses.description, `%${search}%`));
  }

  // Date range filters
  if (startDate) {
    whereConditions.push(gte(expenses.date, new Date(startDate)));
  }

  if (endDate) {
    whereConditions.push(lte(expenses.date, new Date(endDate)));
  }

  // Fetch total count for pagination
  const totalCountResult = await db
    .select({ count: count() })
    .from(expenses)
    .where(and(...whereConditions));

  const totalCount = totalCountResult[0]?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch paginated expenses
  const results = await db
    .select()
    .from(expenses)
    .where(and(...whereConditions))
    .orderBy(desc(expenses.date))
    .limit(limit)
    .offset(offset);

  return {
    expenses: results,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
    },
  };
}

 
// export async function createExpense(input: unknown) {
//   try {
//     // Log the input for debugging
//     console.log("Raw Input to createExpense:", input);

//     // Preprocess input to align types
//     const processedInput = {
//       ...input,
//       date: input.date ? new Date(input.date) : undefined,
//     };

//     // Validate and parse the input using zod schema
//     const parsed = expenseSchema.safeParse(processedInput);

//     if (!parsed.success) {
//       console.error("Validation Errors:", parsed.error.errors);
//       throw new Error("Invalid input data");
//     }

//     const data = parsed.data;

//     // Map to snake_case for database insertion
//     const dbData = {
//       date: data.date,
//       amount: data.amount.toString(), // Convert to string
//       description: data.description,
//       category: data.category,
//       expense_status: data.expenseStatus,
//       payment_method: data.paymentMethod,
//       transaction_id: data.transactionId ?? null,
//       notes: data.notes ?? null,
//       created_at: data.createdAt,
//       updated_at: data.updatedAt,
//     };

//     // Insert into the database
//     const [newExpense] = await db.insert(expenses).values(dbData).returning();

//     return newExpense;
//   } catch (error) {
//     console.error("Error in createExpense:", error);
//     throw error;
//   }
// }

export async function createExpense(
  prevState: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> { 

  try {
    const rawData = { 
      date: new Date(formData.get("date") as string),
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
      paymentMethod: formData.get("paymentMethod") as "CASH" | "CARD",
      paymentStatus: formData.get("paymentStatus") as "DUE" | "PAID",
      transactionId: formData.get("transactionId") || undefined,
      notes: formData.get("notes") || undefined,
    };

    const validatedData = expenseSchema.parse(rawData);

    const expenseData: InsertExpense = { 
      date: validatedData.date,
      amount: validatedData.amount.toString(),
      description: validatedData.description,
      paymentMethod: validatedData.paymentMethod,
      expenseStatus: validatedData.expenseStatus,
      transactionId: validatedData.transactionId,
      notes: validatedData.notes,
    };

    await db.insert(expenses).values(expenseData);

    revalidatePath("/payments");
    return { 
      status: "success",
      data: {
        message: "Payment added successfully!",
      },
    };
  } catch (error) {
    console.error("Error adding payment:", error);
    return { 
      status: "error",
      data: {
        issues: ["An unexpected error occurred. Please try again."],
      },
    };
  }
}


export async function deleteExpenseRecord(id: number): Promise<ActionState> {
  try {
    // Check if the record exists before trying to delete
    const existingRecord = await db.query.expenses.findFirst({
      where: eq(expenses.id, id),
    });

    if (!existingRecord) {
      return {
        errors: {
          root: ["Expense record not found"],
        },
      };
    }

    // Delete the record
    await db.delete(expenses).where(eq(expenses.id, id));

    revalidatePath("/expenses");
    return {
      message: "Expense deleted successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: {
          root: ["Failed to delete expense. Please try again."],
        },
      };
    }

    console.error("Unexpected error deleting expense record:", error);
    return {
      errors: {
        root: ["An unexpected error occurred. Please try again later."],
      },
    };
  }
}
