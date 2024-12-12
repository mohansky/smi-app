import { getPaymentsByStudent } from "@/app/actions/payment";
import { paymentByStudentColumns } from "@/components/columns/payments-by-student-columns";
import { paymentSchema } from "@/lib/validations/payments";
import { getStudentByUserEmail } from "@/app/actions/users";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import CustomDataTable from "@/components/custom-ui/custom-data-table";
import { Heading } from "@/components/custom-ui/heading";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";
import { Suspense } from "react";

export default async function PaymentsPage() {
  const session = await getServerSession(options);

  if (!session) {
    return <p>You must be logged in to view this page.</p>;
  }

  try {
    const { user } = session;
    const studentById = await getStudentByUserEmail(user?.email as string);
    if (!studentById) {
      return (
        <Heading size="xs" className="text-destructive">
          No student data found for this user. Please contact administrator.
        </Heading>
      );
    }
    const records = await getPaymentsByStudent(studentById.studentId);

    const parsedPaymentRecords = records.map((record) => {
      const transformedRecord = {
        ...record,
        date:
          typeof record.date === "string" ? new Date(record.date) : record.date,
      };
      return paymentSchema.parse(transformedRecord);
    });

    return (
      <Suspense fallback={<StudentDetailsLoading />}>
        <div className="w-[98vw] md:w-[75vw] mb-10">
          <CustomDataTable
            columns={paymentByStudentColumns}
            data={parsedPaymentRecords}
            tableTitle="Payments"
          />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error("Error in Payments Page:", error);
    return (
      <div>
        Error loading payment records:{" "}
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred while loading payment records"}
      </div>
    );
  }
}
