// import { Container } from "@/components/custom-ui/container";
import { attendanceColumns } from "@/components/columns/attendance-columns";
import { getAttendanceRecords } from "@/app/actions/attendance";
import { attendanceSchema } from "@/lib/validations/attendance";
import CustomDataTable from "@/components/custom-ui/custom-data-table";

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
      
      // <Container width="marginy">
        <CustomDataTable
          tableTitle="Attendance"
          pgSize={10}
          columns={attendanceColumns}
          data={parsedAttendanceRecords}
          showDatePicker={true}
          filters={[{ column: "studentName", placeholder: "Find by Name" }]}
        />
      // {/* </Container> */}
    );
  } catch (error) {
    console.error("Error in AttendancePage:", error);
    return (
      // <Container width="marginxy">
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading attendance records"}
          </p>
        </div>
      // </Container>
    );
  }
}
