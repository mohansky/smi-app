import { Suspense } from "react";
import { getAttendanceRecordsByStudent } from "@/app/actions/attendance";
import { getPaymentsByStudent } from "@/app/actions/payment";
import { getStudentById } from "@/app/actions/student";
// import { Container } from "@/components/custom-ui/container";
import { studentPaymentColumns } from "@/components/columns/student-payments-columns";
import { studentAttendanceColumns } from "@/components/columns/student-attendance-columns";
import StudentDetails from "@/components/custom-ui/stutent-details";
import { PaymentFormValues } from "@/lib/validations/payments";
import { AttendanceFormValues } from "@/lib/validations/attendance";
import { CustomDataTable } from "@/components/custom-ui/custom-data-table";
import { Card } from "@/components/ui/card";
import MarkAttendanceButton from "@/components/buttons/mark-attendance-button";
import AddPaymentButton from "@/components/buttons/add-payment-button";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";
import { StudentPageProps, StudentResponse } from "@/types";

export default async function StudentDetailsPage(props: StudentPageProps) {
  const params = await props.params;
  try {
    const studentResponse = (await getStudentById(
      params.studentId
    )) as StudentResponse;

    if (!studentResponse || !studentResponse.student) {
      throw new Error("Student not found");
    }

    const student = studentResponse.student;
    const paymentRecords = await getPaymentsByStudent(params.studentId);
    const attendanceRecords = await getAttendanceRecordsByStudent(
      params.studentId
    );

    const payments = (paymentRecords || []) as unknown as PaymentFormValues[];
    const attendance = (attendanceRecords ||
      []) as unknown as AttendanceFormValues[];

    return (
      <Suspense fallback={<StudentDetailsLoading />}>
        <div className="w-[98vw] md:w-[75vw] mb-10">
          <div className="grid md:grid-cols-9 gap-4 mb-10">
            <div className="p-4 col-span-4">
              <StudentDetails student={student} />
            </div>
            <Card className="p-4 col-span-5">
              <MarkAttendanceButton id={student.id as number} />
              <CustomDataTable
                tableTitle="Attendance"
                columns={studentAttendanceColumns}
                data={attendance}
                pgSize={8}
                dateField="date"
              />
            </Card>
          </div>
          <Card className="p-4">
            <AddPaymentButton id={student.id as number} />
            <CustomDataTable
              tableTitle="Payments"
              columns={studentPaymentColumns}
              data={payments}
              pgSize={10}
              dateField="date"
            />
          </Card>
        </div>
      </Suspense>
    );
  } catch (error) {
    return ( 
      <div className="text-red-500 p-4 rounded-md bg-red-50">
        Error loading student records:{" "}
        {error instanceof Error ? error.message : "Unknown error occurred"}
      </div> 
    );
  }
}
