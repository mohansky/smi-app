import { attendanceColumns } from "@/components/columns/attendance-columns";
import { getAttendanceRecords } from "@/app/actions/attendance";
import { attendanceSchema } from "@/lib/validations/attendance";
import CustomDataTable from "@/components/custom-ui/custom-data-table";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";
import { Suspense } from "react";

export default async function AttendancePage() {
  try {
    const records = await getAttendanceRecords();

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
            tableTitle="Attendance"
            pgSize={10}
            columns={attendanceColumns}
            data={parsedAttendanceRecords}
            showDatePicker={true}
            filters={[{ column: "studentName", placeholder: "Find by Name" }]}
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
