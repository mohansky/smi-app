// app/lib/validations/student.ts
import * as z from "zod";

export const studentSchema = z.object({
  id: z.number().int().positive().optional(), // optional for auto-generated primary key
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(/^\d{10,}$/, {
    message: "Phone number must contain at least 10 digits.",
  }),
  instrument: z.enum(["guitar", "drums", "keyboard"]).default("guitar"),
  grade: z.enum(["grade1", "grade2", "grade3"]).default("grade1"),
  batch: z.enum(["mt", "tf", "ws"]).default("mt"),
  dateOfBirth: z.union([
    z.date(),
    z.string().transform((val) => new Date(val)),
    z.null(),
  ]),
  joiningDate: z.union([
    z.date(),
    z.string().transform((val) => new Date(val)),
  ]),
  updatedAt: z
    .union([z.date(), z.string().transform((val) => new Date(val))])
    .optional(),
  createdAt: z
    .union([z.date(), z.string().transform((val) => new Date(val))])
    .optional(),
  isActive: z.boolean().default(true),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
