import { getServerSession } from "next-auth/next";
import { getStudentByUserEmail } from "@/app/actions/users";
import { getStudentById } from "@/app/actions/student";
import { options } from "@/app/api/auth/[...nextauth]/options"; 
import { Heading } from "@/components/custom-ui/heading";
import { Suspense } from "react";
import StudentDetails from "@/components/custom-ui/stutent-details";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";

export default async function StudentDetailsPage() {
  const session = await getServerSession(options);
  if (!session) {
    return <p>You must be logged in to view this page.</p>;
  }

  const { user } = session;
  const studentById = await getStudentByUserEmail(user?.email as string);

  const studentId = studentById?.studentId;
  if (studentId === undefined) {
    return (
      <Heading size="xs" className="text-destructive">
        No student data found for this user. Please contact administrator.
      </Heading>
    );
  }
  const studentResponse = await getStudentById(studentId);

  if (!studentResponse || !studentResponse?.student) {
    throw new Error("Student not found");
  }
  const student = studentResponse.student;

  return (
    <Suspense fallback={<StudentDetailsLoading />}>
      <div className="w-[98vw] md:w-[75vw] mb-10">
        <StudentDetails student={student} />
      </div>
    </Suspense>
  );
}
