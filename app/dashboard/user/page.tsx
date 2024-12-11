import { getServerSession } from "next-auth/next";
import { getStudentByUserEmail } from "@/app/actions/users";
import { getStudentById } from "@/app/actions/student";
import { options } from "@/app/api/auth/[...nextauth]/options";
// import { Container } from "@/components/custom-ui/container";
import StudentDetails from "@/components/custom-ui/stutent-details";
import { Heading } from "@/components/custom-ui/heading";

export default async function StudentDetailsPage() {
  const session = await getServerSession(options);
  if (!session) {
    return <p>You must be logged in to view this page.</p>;
  }

  const { user } = session;
  const studentById = await getStudentByUserEmail(user?.email as string);

  const studentId = studentById?.studentId;
  if (studentId === undefined) {
    // throw new Error("No student ID found");
    return (
      // <Container width="marginxy">
        <Heading size="xs" className="text-destructive">
        No student data found for this user. Please contact administrator.
        </Heading>
      // </Container>
    );
  }
  const studentResponse = await getStudentById(studentId);

  if (!studentResponse || !studentResponse?.student) {
    throw new Error("Student not found");
  }
  const student = studentResponse.student;

  return (
    // <Container width="marginxy">
      <StudentDetails student={student} />
    // </Container>
  );
}
