import * as z from "zod";

export const attendanceSchema = z
  .object({
    id: z.number().int().positive().optional(),
    studentId: z
      .number()
      .int()
      .positive({ message: "Student ID must be a positive integer" }),
    studentName: z.string().nullable().optional(), // Make this optional if not always provided
    date: z.coerce.date(), // This will try to convert input to a date
    status: z.enum(["present", "absent"]).default("present"),
    notes: z.string().max(255).nullable().optional(),
  })
  .strict(); // Add strict() to catch unexpected fields

export type AttendanceFormValues = z.infer<typeof attendanceSchema>;
