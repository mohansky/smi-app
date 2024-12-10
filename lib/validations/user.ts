import { z } from "zod";

// Zod Schema for User Creation
export const UserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(50, { message: "Username must be less than 50 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be less than 20 characters" })
    .refine(
      (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password),
      { message: "Password must include uppercase, lowercase, and number" }
    ),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

// Zod schema for user creation validation
export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(50, { message: "Username must be less than 50 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be less than 20 characters" })
    .refine(
      (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password),
      { message: "Password must include uppercase, lowercase, and number" }
    ),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

// Zod Schema for User Login
export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password is required minimum 6 characters"),
});
