// import { Container } from "@/components/custom-ui/container";
import { paymentColumns } from "@/components/columns/payments-columns";
import { getAllPayments } from "@/app/actions/payment";
import { CustomDataTable } from "@/components/custom-ui/custom-data-table";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";
import { Suspense } from "react";

export default async function PaymentsPage() {
  const result = await getAllPayments();

  if (result.success && result.data?.payments) {
    const transformedPayments = result.data.payments.map((payment) => ({
      ...payment,
      studentId:
        typeof payment.studentId === "string"
          ? parseInt(payment.studentId)
          : payment.studentId,
      studentName: payment.studentName,
      amount:
        typeof payment.amount === "string"
          ? parseFloat(payment.amount)
          : payment.amount,
      notes: payment.notes ?? undefined,
      transactionId: payment.transactionId ?? undefined,
    }));

    return (
      <Suspense fallback={<StudentDetailsLoading />}>
        <div className="w-[98vw] md:w-[75vw] mb-10">
          <CustomDataTable
            tableTitle="All Payments"
            pgSize={10}
            columns={paymentColumns}
            data={transformedPayments}
            showDatePicker={true}
            filters={[{ column: "studentName", placeholder: "Find by Name" }]}
          />
        </div>
      </Suspense>
    );
  } else {
    return <div>Error loading Payments</div>;
  }
}
