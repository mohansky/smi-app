import { Container } from "@/components/custom-ui/container";
import { getAttendanceRecordsByStudent } from "@/app/actions/attendance";
import { attendanceSchema } from "@/lib/validations/attendance";
import { attendanceByStudentColumns } from "@/components/columns/attendance-by-student-columns";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[nextauth]/options";
import { getStudentByUserEmail } from "@/app/actions/users";
import CustomDataTable from "@/components/custom-ui/custom-data-table";
import { Heading } from "@/components/custom-ui/heading";

export default async function AttendancePage() {
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
    const records = await getAttendanceRecordsByStudent(studentById.studentId);
    const parsedAttendanceRecords = records.map((record) => {
      const transformedRecord = {
        ...record,
        date:
          typeof record.date === "string" ? new Date(record.date) : record.date,
      };
      return attendanceSchema.parse(transformedRecord);
    });

    return (
      <Container width="marginy">
        <CustomDataTable
          columns={attendanceByStudentColumns}
          data={parsedAttendanceRecords}
          tableTitle="Attendance"
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
