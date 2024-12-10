"use server";
import { db } from "@/db/drizzle";
import { StudentFormValues, studentSchema } from "@/lib/validations/student";
import { revalidatePath } from "next/cache";
import { eq, InferInsertModel, sql } from "drizzle-orm";
import { students } from "@/db/schema";
import {
  ActionState,
  AddStudentFormState,
  UpdateStudentFormState,
} from "@/types";

export async function addStudent(
  prevState: AddStudentFormState,
  formData: FormData
): Promise<AddStudentFormState> {
  try {
    // Extract raw data from form
    const rawFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      instrument: formData.get("instrument") as string,
      grade: formData.get("grade") as string,
      batch: formData.get("batch") as string,
      dateOfBirth: formData.get("dateOfBirth") as string | null,
      joiningDate: formData.get("joiningDate") as string | null,
      isActive: formData.get("isActive") === "true", // Checkbox handling
    };

    // Validate form data
    const validationResult = studentSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      return {
        status: "error",
        data: {
          issues: Object.entries(
            validationResult.error.flatten().fieldErrors
          ).flatMap(([field, errors]) =>
            errors.map((error) => `${field}: ${error}`)
          ),
        },
      };
    }

    const data = validationResult.data;

    // Check for existing student by email
    const existingStudent = await db.query.students.findFirst({
      where: (students, { eq }) => eq(students.email, data.email),
    });

    if (existingStudent) {
      return {
        status: "error",
        data: {
          issues: ["A student with this email already exists."],
        },
      };
    }

    // Extract last 5 digits from the phone number
    const studentId = parseInt(data.phone.slice(-5), 10);

    // Prepare data for insertion
    const insertData: InferInsertModel<typeof students> = {
      id: studentId, // Set the id to the last 5 digits of the phone number
      name: data.name,
      email: data.email,
      phone: data.phone,
      instrument: data.instrument,
      grade: data.grade,
      batch: data.batch,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString().split("T")[0]
        : null,
      joiningDate: data.joiningDate.toISOString().split("T")[0],
      isActive: data.isActive ?? true,
    };

    // Insert the student record into the database
    await db.insert(students).values(insertData);

    // Trigger revalidation or some other post-insert logic if necessary
    revalidatePath("/students");

    return {
      status: "success",
      data: {
        message: "Student added successfully!",
      },
    };
  } catch (error) {
    console.error("Error adding student:", error);
    return {
      status: "error",
      data: {
        issues: ["An unexpected error occurred. Please try again."],
      },
    };
  }
}

export async function updateStudent(
  prevState: UpdateStudentFormState,
  formData: FormData
): Promise<UpdateStudentFormState> {
  const studentId = prevState.studentId;
  const initialValues = prevState.initialValues;

  try {
    const rawFormData = {
      id: studentId,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      instrument: formData.get("instrument"),
      grade: formData.get("grade"),
      batch: formData.get("batch"),
      dateOfBirth: formData.get("dateOfBirth")
        ? new Date(formData.get("dateOfBirth") as string)
        : null,
      joiningDate: formData.get("joiningDate")
        ? new Date(formData.get("joiningDate") as string)
        : null,
      isActive: formData.get("isActive") === "true",
    };

    // console.log("Processed Raw Form Data:", rawFormData);

    const result = studentSchema.safeParse(rawFormData);

    if (!result.success) {
      // console.error("Validation Errors:", result.error.flatten());
      return {
        studentId,
        initialValues,
        status: "error",
        data: {
          issues: Object.entries(result.error.flatten().fieldErrors).flatMap(
            ([field, errors]) => errors.map((error) => `${field}: ${error}`)
          ),
        },
      };
    }

    const updatedFields = {
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      instrument: result.data.instrument,
      grade: result.data.grade,
      batch: result.data.batch,
      dateOfBirth: result.data.dateOfBirth?.toISOString(),
      joiningDate: result.data.joiningDate?.toISOString(),
      isActive: result.data.isActive,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    };

    const updateResult = await db
      .update(students)
      .set(updatedFields)
      .where(eq(students.id, studentId));

    console.log("Update Result:", updateResult);

    revalidatePath("/students");

    return {
      studentId,
      initialValues,
      status: "success",
      data: {
        message: "Student updated successfully!",
      },
    };
  } catch (error) {
    console.error("Detailed Error updating student:", error);
    return {
      studentId,
      initialValues,
      status: "error",
      data: {
        issues: [
          "An unexpected error occurred. Please try again.",
          error instanceof Error ? error.message : String(error),
        ],
      },
    };
  }
}

export async function deleteStudent(studentId: number): Promise<ActionState> {
  try {
    // Check if student exists
    const existingStudent = await db.query.students.findFirst({
      where: (students, { eq }) => eq(students.id, studentId),
    });

    if (!existingStudent) {
      return {
        errors: {
          root: ["Student not found"],
        },
      };
    }

    // Delete the student
    await db.delete(students).where(eq(students.id, studentId));

    revalidatePath("/students");

    return {
      message: "Student deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting student:", error);
    return {
      errors: {
        root: ["Failed to delete student. Please try again."],
      },
    };
  }
}

export async function getStudents(): Promise<{
  students?: StudentFormValues[];
  error?: string;
}> {
  try {
    const rawData = await db.select().from(students).orderBy(students.id);

    // Explicitly transform the data to match StudentFormValues
    const formattedStudents: StudentFormValues[] = rawData.map((student) => ({
      ...student,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
      joiningDate: new Date(student.joiningDate),
      instrument: student.instrument ?? "guitar",
      grade: student.grade ?? "grade1",
      batch: student.batch,
      isActive: student.isActive,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));

    return { students: formattedStudents };
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return { error: "Failed to fetch students" };
  }
}

export async function getStudentById(studentId: number): Promise<{
  student?: StudentFormValues;
  error?: string;
}> {
  try {
    const rawData = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!rawData.length) {
      return { error: `Student with ID ${studentId} not found` };
    }

    // Explicitly transform the single student
    const formattedStudent: StudentFormValues = {
      ...rawData[0],
      dateOfBirth: rawData[0].dateOfBirth
        ? new Date(rawData[0].dateOfBirth)
        : null,
      joiningDate: new Date(rawData[0].joiningDate),
      instrument: rawData[0].instrument ?? "guitar", // Provide default
      grade: rawData[0].grade,
      batch: rawData[0].batch,
      isActive: rawData[0].isActive,
      createdAt: rawData[0].createdAt,
      updatedAt: rawData[0].updatedAt,
    };

    return { student: formattedStudent };
  } catch (error) {
    console.error("Failed to fetch student:", error);
    return {
      error: `Failed to fetch student: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
