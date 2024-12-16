import { expenseColumns } from "@/components/columns/expenses-columns";
import { getAllExpenses } from "@/app/actions/expense";
import { CustomDataTable } from "@/components/custom-ui/custom-data-table";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";
import { Suspense } from "react";
import AddExpenseButton from "@/components/buttons/add-expenses-button";

export default async function ExpensesPage() {
  const result = await getAllExpenses({
    page: 1,
    limit: 10,
    status: "ALL",
    category: "ALL",
  });

  if (result.expenses) {
    const transformedExpenses = result.expenses.map((expense) => ({
      ...expense,
      amount:
        typeof expense.amount === "string"
          ? parseFloat(expense.amount)
          : expense.amount,
      notes: expense.notes ?? undefined,
      transactionId: expense.transactionId ?? undefined,
      createdAt: expense.created_at,
      updatedAt: expense.updated_at,
    }));

    return (
      <Suspense fallback={<StudentDetailsLoading />}>
        <div className="w-[98vw] md:w-[75vw] mb-10">
          <AddExpenseButton className="flex justify-end" />
          <CustomDataTable
            tableTitle="All Expenses"
            pgSize={10}
            columns={expenseColumns}
            data={transformedExpenses}
            showDatePicker={true}
            filters={[
              { column: "description", placeholder: "Find by Description" },
              { column: "category", placeholder: "Filter by Category" },
            ]}
          />
        </div>
      </Suspense>
    );
  } else {
    return <div>Error loading Expenses</div>;
  }
}
