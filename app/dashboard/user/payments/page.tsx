import { Container } from "@/components/custom-ui/container";
import { getPaymentsByStudent } from "@/app/actions/payment";
import { paymentByStudentColumns } from "@/components/columns/payments-by-student-columns";
import { paymentSchema } from "@/lib/validations/payments";
import { getStudentByUserEmail } from "@/app/actions/users";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import CustomDataTable from "@/components/custom-ui/custom-data-table";
import { Heading } from "@/components/custom-ui/heading";

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
        <Container width="marginy">
          <Heading size="xs" className="text-destructive">
            No student data found for this user. Please contact administrator.
          </Heading>
        </Container>
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
      <Container width="marginy">
        <CustomDataTable
          columns={paymentByStudentColumns}
          data={parsedPaymentRecords}
          tableTitle="Payments"
        />
      </Container>
    );
  } catch (error) {
    console.error("Error in AttendancePage:", error);
    return (
      <Container width="marginxy">
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading attendance records"}
          </p>
        </div>
      </Container>
    );
  }
}
