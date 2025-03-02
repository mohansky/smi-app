"use server";
import { z } from "zod";
import { InsertPayment, payments, students } from "@/db/schema";
import { db } from "@/db/drizzle";
import { revalidatePath } from "next/cache";
import {
  FilterParams,
  filterSchema,
  paymentSchema,
} from "@/lib/validations/payments";
import { eq, desc, like, sql, and, SQL } from "drizzle-orm";
import { ActionState, PaymentFormState } from "@/types";

export async function createPayment(
  prevState: PaymentFormState,
  formData: FormData
): Promise<PaymentFormState> {
  const studentId = prevState.studentId;

  try {
    const rawData = {
      studentId: studentId,
      date: new Date(formData.get("date") as string),
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
      paymentMethod: formData.get("paymentMethod") as "CASH" | "CARD",
      paymentStatus: formData.get("paymentStatus") as "DUE" | "PAID",
      transactionId: formData.get("transactionId") || undefined,
      notes: formData.get("notes") || undefined,
    };

    const validatedData = paymentSchema.parse(rawData);

    const paymentData: InsertPayment = {
      studentId: validatedData.studentId,
      date: validatedData.date,
      amount: validatedData.amount.toString(),
      description: validatedData.description,
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: validatedData.paymentStatus,
      transactionId: validatedData.transactionId,
      notes: validatedData.notes,
    };

    await db.insert(payments).values(paymentData);

    revalidatePath("/payments");
    return {
      studentId,
      status: "success",
      data: {
        message: "Payment added successfully!",
      },
    };
  } catch (error) {
    // console.error("Error adding payment:", error);
    if (error instanceof z.ZodError) {
      return {
        studentId,
        status: "error",
        data: {
          message: `Something went wrong: ${error.errors[0].message}`,
          issues: [error.errors[0].message],
        },
      };
    } else {
    return {
      studentId,
      status: "error",
      data: {
        message: `An unexpected error occurred. Please try again. ${error}`,
        issues: [`An unexpected error occurred. Please try again. ${error}`],
      },
    };
  }
}}

export async function getPaymentsByStudent(studentId: number) {
  try {
    const studentPayments = await db
      .select({
        id: payments.id,
        studentId: payments.studentId,
        date: payments.date,
        amount: payments.amount,
        description: payments.description,
        paymentMethod: payments.paymentMethod,
        paymentStatus: payments.paymentStatus,
        transactionId: payments.transactionId,
        notes: payments.notes,
      })
      .from(payments)
      .leftJoin(students, eq(payments.studentId, students.id))
      .where(eq(payments.studentId, studentId))
      .orderBy(payments.date);

    if (!studentPayments || studentPayments.length === 0) {
      return [];
    }

    return studentPayments;
  } catch (error) {
    console.error("Error fetching payment records:", error);
    return [];
  }
}

export async function getAllPayments(params?: Partial<FilterParams>) {
  try {
    // Validate and set default values for filters
    const { page, limit, status, search, startDate, endDate } =
      filterSchema.parse({
        page: params?.page || 1,
        limit: params?.limit || 10,
        status: params?.status || "ALL",
        search: params?.search,
        startDate: params?.startDate,
        endDate: params?.endDate,
      });

    // Calculate offset
    const offset = (page - 1) * limit;

    // Prepare where conditions
    const whereConditions: SQL[] = [];

    if (status !== "ALL") {
      whereConditions.push(eq(payments.paymentStatus, status));
    }

    if (search) {
      whereConditions.push(like(payments.description, `%${search}%`));
    }

    if (startDate && endDate) {
      whereConditions.push(
        sql`${payments.date} BETWEEN ${new Date(startDate)} AND ${new Date(
          endDate
        )}`
      );
    }

    // Construct where clause
    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count for pagination
    const totalPromise = db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(whereClause)
      .execute();

    // Get paginated results
    const paymentsPromise = db
      .select({
        id: payments.id,
        studentId: payments.studentId,
        studentName: students.name,
        date: payments.date,
        amount: payments.amount,
        description: payments.description,
        paymentMethod: payments.paymentMethod,
        paymentStatus: payments.paymentStatus,
        transactionId: payments.transactionId,
        notes: payments.notes,
        createdAt: payments.created_at,
        updatedAt: payments.updated_at,
      })
      .from(payments)
      .innerJoin(students, eq(payments.studentId, students.id)) // Add this line
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(payments.date))
      .execute();

    // Execute both queries concurrently
    const [total, paymentsData] = await Promise.all([
      totalPromise,
      paymentsPromise,
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total[0].count / limit);
    const hasMore = page < totalPages;

    // Calculate summary statistics
    const totalPaid = paymentsData
      .filter((payment) => payment.paymentStatus === "PAID")
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    const totalDue = paymentsData
      .filter((payment) => payment.paymentStatus === "DUE")
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    return {
      success: true,
      data: {
        payments: paymentsData,
        pagination: {
          currentPage: page,
          totalPages,
          hasMore,
          totalItems: total[0].count,
        },
        summary: {
          totalPaid,
          totalDue,
          totalPayments: paymentsData.length,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return {
      success: false,
      error: "Failed to fetch payments",
    };
  }
}

export async function deletePaymentRecord(id: number): Promise<ActionState> {
  try {
    // Check if the record exists before trying to delete
    const existingRecord = await db.query.payments.findFirst({
      where: eq(payments.id, id),
    });

    if (!existingRecord) {
      return {
        status: "error",
        data: {
          message: `Payment record with ID ${id} not found`,
          issues: [`Payment record with ID ${id} not found`],
        },
      };
    }

    // Delete the record
    await db.delete(payments).where(eq(payments.id, id));

    revalidatePath("/payments");
    return {
      status: "success",
      data: {
        message: "Payment deleted successfully",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        data: {
          message: `Something went wrong: ${error.errors[0].message}`,
          issues: [error.errors[0].message],
        },
      };
    } else {
      return {
        status: "error",
        data: {
          message: "An unexpected error occurred. Please try again.",
          issues: ["An unexpected error occurred. Please try again."],
        },
      };
    }
  }
}
