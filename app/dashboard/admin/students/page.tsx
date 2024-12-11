import { Suspense } from "react"; 
import { getStudents } from "@/app/actions/student";
import { Container } from "@/components/custom-ui/container";
import { studentsColumns } from "@/components/columns/students-columns";
import { studentSchema, StudentFormValues } from "@/lib/validations/student";
import CustomDataTable from "@/components/custom-ui/custom-data-table";
import TablesPageLoading from "@/components/skeletons/tables-skeleton";

export default async function StudentsPage() {
  const { students, error } = await getStudents();

  if (error) {
    return <Container width="marginy">Error loading students: {error}</Container>;
  }
  const parsedStudents = students?.map((student) =>
    studentSchema.parse(student)
  ) as StudentFormValues[];

  return (
    <Suspense fallback={<TablesPageLoading />}>
      {/* <Container width="marginy"> */}
        <CustomDataTable
          columns={studentsColumns}
          data={parsedStudents}
          tableTitle="Students"
          filters={[
            { column: "name", placeholder: "Find by Name" },
            // { column: "email", placeholder: "Find by Email" },
            // { column: "instrument", placeholder: "Find by Instrument" },
          ]}
        />
      {/* </Container> */}
    </Suspense>
  );
}
