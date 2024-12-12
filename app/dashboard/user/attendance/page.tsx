// import { Container } from "@/components/custom-ui/container";
import { getAttendanceRecordsByStudent } from "@/app/actions/attendance";
import { attendanceSchema } from "@/lib/validations/attendance";
import { attendanceByStudentColumns } from "@/components/columns/attendance-by-student-columns";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getStudentByUserEmail } from "@/app/actions/users";
import CustomDataTable from "@/components/custom-ui/custom-data-table";
import { Heading } from "@/components/custom-ui/heading";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";
import { Suspense } from "react";

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
        <Heading size="xs" className="text-destructive">
          No student data found for this user. Please contact administrator.
        </Heading>
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
      <Suspense fallback={<StudentDetailsLoading />}>
        <div className="w-[98vw] md:w-[75vw] mb-10">
          <CustomDataTable
            columns={attendanceByStudentColumns}
            data={parsedAttendanceRecords}
            tableTitle="Attendance"
          />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error("Error in AttendancePage:", error);
    return (
      <div>
        Error loading attendance records:{" "}
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred while loading attendance records"}
      </div>
    );
  }
}
