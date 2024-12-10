"use server";
import { db } from "@/db/drizzle";
import { attendance, students } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and, desc, sql, InferInsertModel } from "drizzle-orm";
import { ActionState, AttendanceFormState } from "@/types";
import { z } from "zod";
import { attendanceSchema } from "@/lib/validations/attendance";

export async function submitAttendanceAction(
  prevState: AttendanceFormState,
  formData: FormData
): Promise<AttendanceFormState> {
  const studentId = prevState.studentId;
  try {
    const rawAttendanceFormData = {
      studentId: studentId,
      date: formData.get("date"),
      status: formData.get("status"),
      notes: formData.get("notes"),
      studentName: formData.get("studentName") || "Unknown",
    };

    const parsedData = attendanceSchema.safeParse(rawAttendanceFormData);
 
    if (!parsedData.success) {
      console.log("Validation Errors:", parsedData.error.errors);
      return {
        studentId,
        status: "error",
        data: {
          issues: parsedData.error.errors.map((error) => {
            console.log(`Error Path: ${error.path}, Message: ${error.message}`);
            return error.message;
          }),
        },
      };
    }

    const existingRecord = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.studentId, parsedData.data.studentId),
          eq(attendance.date, parsedData.data.date.toISOString().split("T")[0])
        )
      )
      .limit(1); 

    if (existingRecord.length > 0) {
      return {
        studentId,
        status: "error",
        data: {
          issues: [
            "An attendance record already exists for this student on this date.",
          ],
        },
      };
    }

    const insertData: InferInsertModel<typeof attendance> = {
      studentId: parsedData.data.studentId,
      date: parsedData.data.date.toISOString().split("T")[0],
      status: parsedData.data.status,
      notes: parsedData.data.notes,
    };

    await db.insert(attendance).values(insertData);

    revalidatePath("/attendance");

    return {
      studentId,
      status: "success",
      data: {
        message: `Attendance record added successfully for ${parsedData.data.date.toISOString().split("T")[0]}`,
      },
    };
  } catch (error) {
    console.error("Full Error:", error);
    return {
      studentId,
      status: "error",
      data: {
        issues: ["An unexpected error occurred. Please try again."],
      },
    };
  }
}

export async function getAttendanceRecords() {
  const records = await db
    .select({
      id: attendance.id,
      studentId: attendance.studentId,
      studentName: students.name,
      date: attendance.date,
      status: attendance.status,
      notes: attendance.notes,
    })
    .from(attendance)
    .leftJoin(students, eq(attendance.studentId, students.id))
    .orderBy(desc(attendance.date));

  return records;
}

export async function getAttendanceRecordsByStudent(studentId: number) {
  try {
    const records = await db
      .select({
        id: attendance.id,
        date: attendance.date,
        status: attendance.status,
        notes: attendance.notes,
        studentId: attendance.studentId,
        studentName: students.name,
      })
      .from(attendance)
      .leftJoin(students, eq(attendance.studentId, students.id))
      .where(eq(attendance.studentId, studentId))
      .orderBy(attendance.date);

    if (!records || records.length === 0) {
      return [];
    }

    return records;
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return [];
  }
}

export async function deleteAttendanceRecord(id: number): Promise<ActionState> {
  try {
    // Check if the record exists before trying to delete
    const existingRecord = await db.query.attendance.findFirst({
      where: eq(attendance.id, id),
    });

    if (!existingRecord) {
      return {
        message: `Attendance record with ID ${id} not found`,
      };
    }

    // Delete the record
    await db.delete(attendance).where(eq(attendance.id, id));

    // Revalidate the attendance page to reflect the changes
    revalidatePath("/attendance");

    return { message: "Attendance deleted successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
      };
    }
    console.log(error);
    return {
      message: "Something went wrong",
    };
  }
}

// Optional: Get attendance records for a specific student
export async function getAttendanceRecordsByStudentId(studentId: number) {
  const records = await db
    .select({
      id: attendance.id,
      studentId: attendance.studentId,
      studentName: students.name,
      date: attendance.date,
      status: attendance.status,
      notes: attendance.notes,
    })
    .from(attendance)
    .leftJoin(students, eq(attendance.studentId, students.id))
    .where(eq(attendance.studentId, studentId))
    .orderBy(desc(attendance.date));

  return records;
}

// Optional: Get attendance records for a specific date range
export async function getAttendanceRecordsByDateRange(
  startDate: Date,
  endDate: Date
) {
  const records = await db
    .select({
      id: attendance.id,
      studentId: attendance.studentId,
      studentName: students.name,
      date: attendance.date,
      status: attendance.status,
      notes: attendance.notes,
    })
    .from(attendance)
    .leftJoin(students, eq(attendance.studentId, students.id))
    .where(
      sql`${attendance.date} >= ${startDate} AND ${attendance.date} <= ${endDate}`
    )
    .orderBy(desc(attendance.date));

  return records;
}
