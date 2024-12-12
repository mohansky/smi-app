import { addStudentsAttendancePaymentsColumns } from "@/components/columns/add-students-attendance-payments-columns";
import { getStudents } from "@/app/actions/student";
import { StudentFormValues, studentSchema } from "@/lib/validations/student";
import CustomDataTable from "@/components/custom-ui/custom-data-table";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";
import { Suspense } from "react";

export default async function PaymentsPage() {
  const { students, error } = await getStudents();

  if (error) {
    return <div>Error loading students: {error}</div>;
  }
  const parsedStudents = students?.map((student) =>
    studentSchema.parse(student)
  ) as StudentFormValues[];

  return (
    <Suspense fallback={<StudentDetailsLoading />}>
      <div className="w-[98vw] md:w-[75vw] mb-10">
        <CustomDataTable
          columns={addStudentsAttendancePaymentsColumns}
          data={parsedStudents}
          tableTitle="Add Fees and Attendance"
          filters={[{ column: "name", placeholder: "Find by Name" }]}
        />
      </div>
    </Suspense>
  );
}
