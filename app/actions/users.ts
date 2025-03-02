"use server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { students, users } from "@/db/schema";
import { CreateUserSchema } from "@/lib/validations/user";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function createUser(prevState: unknown, formData: FormData) {
  try {
    // Log the incoming form data for debugging
    console.log("Incoming form data:", {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
    });

    // Validate form data using Zod
    const validatedFields = CreateUserSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role") || undefined,
    });

    // Check validation results
    if (!validatedFields.success) {
      console.error("Validation errors:", validatedFields.error.errors);
      return {
        error: validatedFields.error.errors[0].message,
      };
    }

    const { name, email, password, role } = validatedFields.data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      console.warn("User with this email already exists");
      return {
        error: "Email already exists",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log details before insertion (be careful with sensitive info)
    console.log("Attempting to create user:", {
      name: name,
      email,
      role: role || "USER",
    });

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        id: uuidv4(), // Explicitly generate UUID
        name: name,
        email,
        password: hashedPassword,
        role: role || "USER", // Ensure role is set
        isVerified: false,
      })
      .returning();

    console.log("User created successfully:", newUser[0]);

    return {
      success: "Account created successfully!",
    };
  } catch (error) {
    // Log the full error for debugging
    console.error("Detailed user creation error:", error);

    // If it's a database-specific error, you might want to log more details
    if (error instanceof Error) {
      return {
        error: `Creation failed: ${error.message}`,
      };
    }

    return {
      error: "An unexpected error occurred during account creation",
    };
  }
}

export async function getStudentByUserEmail(userEmail: string) {
  try {
    // Query the database to join students and users by email
    const result = await db
      .select({
        studentId: students.id,
        studentName: students.name,
        studentEmail: students.email,
        userId: students.userId,
        userName: users.name,
        userEmail: users.email,
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(users.email, userEmail))
      .limit(1); // Optional: Only fetch the first match

    if (result.length === 0) {
      return null; // No match found
    }

    return result[0]; // Return the matched student details
  } catch (error) {
    console.error("Error fetching student by user email:", error);
    throw new Error("Failed to fetch student details.");
  }
}
