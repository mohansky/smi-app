"use server"
import { db } from "@/db/drizzle";
import { payments, expenses, students, INSTRUMENTS } from "@/db/schema";
import { CombinedStats } from "@/types";
import { endOfMonth, startOfMonth, subYears } from "date-fns";
import { sql } from "drizzle-orm";

interface MonthlyDataProps {
  month: string;
  payments: number;
  expenses: number;
}

export async function getMonthlyPaymentsAndExpenses(): Promise<
  MonthlyDataProps[]
> {
  try {
    // Query for payments
    const paymentsData = await db
      .select({
        month: sql<string>`to_char("date", 'YYYY-MM')`.as("month"),
        payments: sql<number>`SUM(amount)`.as("total_payments"),
      })
      .from(payments)
      .groupBy(sql`to_char("date", 'YYYY-MM')`)
      .orderBy(sql`MIN("date")`);

    // Query for expenses
    const expensesData = await db
      .select({
        month: sql<string>`to_char("date", 'YYYY-MM')`.as("month"),
        expenses: sql<number>`SUM(amount)`.as("total_expenses"),
      })
      .from(expenses)
      .groupBy(sql`to_char("date", 'YYYY-MM')`)
      .orderBy(sql`MIN("date")`);

    // Merge the data for both payments and expenses
    const mergedData: MonthlyDataProps[] = paymentsData.map((paymentItem) => {
      const expenseItem = expensesData.find(
        (expenseItem) => expenseItem.month === paymentItem.month
      );
      return {
        month: paymentItem.month,
        payments: Number(paymentItem.payments ?? 0),
        expenses: Number(expenseItem?.expenses ?? 0),
      };
    });

    // Add any months from expensesData that don't exist in paymentsData
    expensesData.forEach((expenseItem) => {
      if (!mergedData.some((item) => item.month === expenseItem.month)) {
        mergedData.push({
          month: expenseItem.month,
          payments: 0,
          expenses: Number(expenseItem.expenses ?? 0),
        });
      }
    });

    return mergedData;
  } catch (error) {
    console.error("Error fetching monthly payments and expenses data:", error);
    return [];
  }
}

export async function getCombinedStats(month: string): Promise<CombinedStats> {
  const selectedDate = new Date(month);
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const yearStart = startOfMonth(subYears(selectedDate, 1));

  // Get active students and their instruments for the month
  const activeStudents = await db
    .select({
      id: students.id,
      instrument: students.instrument,
    })
    .from(students)
    .where(sql`is_active = true AND joining_date <= ${monthEnd}`);

  // Get active students for the past year
  const yearlyActiveStudents = await db
    .select({
      id: students.id,
      instrument: students.instrument,
    })
    .from(students)
    .where(
      sql`is_active = true AND joining_date <= ${monthEnd} AND joining_date >= ${yearStart}`
    );

  // Get monthly payments
  const monthlyPayments = await db
    .select({
      total: sql`SUM(amount)::numeric`,
    })
    .from(payments).where(sql`
        date >= ${monthStart} AND
        date <= ${monthEnd} AND
        payment_status = 'PAID'
      `);

  // Get yearly payments
  const yearlyPayments = await db
    .select({
      total: sql`SUM(amount)::numeric`,
    })
    .from(payments).where(sql`
        date >= ${yearStart} AND
        date <= ${monthEnd} AND
        payment_status = 'PAID'
      `);

  // Get monthly expenses
  const monthlyExpenses = await db
    .select({
      total: sql`SUM(amount)::numeric`,
    })
    .from(expenses).where(sql`
      date >= ${monthStart} AND
      date <= ${monthEnd} AND
      expense_status = 'PAID'
    `);

  // Get yearly expenses
  const yearlyExpenses = await db
    .select({
      total: sql`SUM(amount)::numeric`,
    })
    .from(expenses).where(sql`
      date >= ${yearStart} AND
      date <= ${monthEnd} AND
      expense_status = 'PAID'
    `);

  // Calculate instrument breakdowns
  const monthlyInstrumentCounts = Object.values(INSTRUMENTS).map(
    (instrument) => ({
      instrument,
      count: activeStudents.filter(
        (student) => student.instrument === instrument
      ).length,
    })
  );

  const yearlyInstrumentCounts = Object.values(INSTRUMENTS).map(
    (instrument) => ({
      instrument,
      count: yearlyActiveStudents.filter(
        (student) => student.instrument === instrument
      ).length,
    })
  );

  const hasData =
    activeStudents.length > 0 || Number(monthlyPayments[0]?.total) > 0;

  return {
    monthly: {
      activeStudents: activeStudents.length,
      totalPayments: Number(monthlyPayments[0]?.total || 0),
      totalExpenses: Number(monthlyExpenses[0]?.total || 0),
      instrumentBreakdown: monthlyInstrumentCounts,
    },
    yearly: {
      activeStudents: yearlyActiveStudents.length,
      totalPayments: Number(yearlyPayments[0]?.total || 0),
      totalExpenses: Number(yearlyExpenses[0]?.total || 0),
      instrumentBreakdown: yearlyInstrumentCounts,
    },
    hasData,
  };
}
