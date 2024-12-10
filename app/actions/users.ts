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

// export async function loginUser(prevState: unknown, formData: FormData) {
//   try {
//     // Convert FormData to object
//     const rawData = {
//       email: formData.get("email"),
//       password: formData.get("password"),
//     };

//     // Validate input using Zod schema
//     const validatedData = UserLoginSchema.parse(rawData);

//     // Find user by email
//     const existingUser = await db
//       .select({
//         id: users.id,
//         email: users.email,
//         password: users.password,
//         role: users.role,
//         isVerified: users.isVerified,
//       })
//       .from(users)
//       .where(eq(users.email, validatedData.email))
//       .limit(1);

//     // Check if user exists
//     if (existingUser.length === 0) {
//       return {
//         error: "Invalid email or password",
//         errors: {
//           email: "No account found with this email",
//         },
//       };
//     }

//     const user = existingUser[0];

//     // Check if user is verified
//     if (!user.isVerified) {
//       return {
//         error: "Account not verified",
//         errors: {
//           email: "Please verify your email before logging in",
//         },
//       };
//     }

//     // Verify password
//     const isValidPassword = await bcrypt.compare(
//       validatedData.password,
//       user.password
//     );

//     if (!isValidPassword) {
//       return {
//         error: "Invalid email or password",
//         errors: {
//           password: "Incorrect password",
//         },
//       };
//     }

//     // Return success response with user info (will be handled by NextAuth)
//     return {
//       success: "Login successful",
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//     };
//   } catch (error) {
//     // Handle Zod validation errors
//     if (error instanceof z.ZodError) {
//       const fieldErrors: Record<string, string> = {};
//       error.errors.forEach((err) => {
//         fieldErrors[err.path[0]] = err.message;
//       });

//       return {
//         error: "Invalid input",
//         errors: fieldErrors,
//       };
//     }

//     // Log unexpected errors
//     console.error("Unexpected login error:", error);

//     // Handle other unexpected errors
//     return {
//       error: "An unexpected error occurred. Please try again.",
//     };
//   }
// }

// export async function loginAction(
//   prevState: LoginFormState,
//   formData: FormData
// ): Promise<LoginFormState> {
// // export async function loginAction(formData: FormData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   try {
//     const result = await signIn("credentials", {
//       redirect: false,
//       email,
//       password,
//     });

//     if (result?.error) {
//       return {
//       status: "error",
//       data: {
//         issues: ["A student with this email already exists."],
//       },
//     };
//     }

//     return {
//       redirectUrl: "/dashboard",
//       status: "success",
//       data: {
//         message: "Student added successfully!",
//       },
//     };
//   } catch (error) {
//     console.error("Error login student:", error);
//     return {
//       status: "error",
//       data: {
//         issues: ["An unexpected error occurred. Please try again."],
//       },
//     };
//   }
// }

// export async function loginAction(
//   prevState: LoginFormState,
//   formData: FormData
// ): Promise<LoginFormState> {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   try {
//     const result = await signIn("credentials", {
//       redirect: false,
//       email,
//       password,
//     });

//     if (result?.error) {
//       return {
//         status: "error",
//         data: {
//           issues: [result.error || "Login failed"],
//         },
//       };
//     }

//     // If login is successful, redirect to dashboard
//     redirect("/dashboard");
//   } catch (error) {
//     console.error("Error logging in:", error);
//     return {
//       status: "error",
//       data: {
//         issues: ["An unexpected error occurred. Please try again."],
//       },
//     };
//   }
// }

// export async function loginAction(
//   prevState: LoginFormState,
//   formData: FormData
// ): Promise<LoginFormState> {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   try {
//     await signIn("credentials", {
//       email,
//       password,
//       redirectTo: "/dashboard",
//     });

//     return {
//       status: "success",
//       data: {
//         message: "Login successful",
//       },
//       redirectUrl: "/dashboard"
//     };
//   } catch (error) {
//     if (error) {
//       switch (error) {
//         case 'CredentialsSignin':
//           return {
//             status: "error",
//             data: {
//               issues: ["Invalid email or password"],
//             },
//           };
//         default:
//           return {
//             status: "error",
//             data: {
//               issues: ["Authentication failed"],
//             },
//           };
//       }
//     }

//     if (error instanceof Error) {
//       return {
//         status: "error",
//         data: {
//           issues: [error.message],
//         },
//       };
//     }

//     return {
//       status: "error",
//       data: {
//         issues: ["An unexpected error occurred. Please try again."],
//       },
//     };
//   }
// }

// export async function loginAction(
//   prevState: LoginFormState,
//   formData: FormData
// ): Promise<LoginFormState> {
//   console.log("Login action initiated"); // Debug: Start
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   console.log("Extracted email:", email); // Debug: Log extracted email
//   console.log("Extracted password:", password ? "[HIDDEN]" : "No password provided"); // Debug: Log password status

//   try {
//     console.log("Attempting to sign in..."); // Debug: Before signIn
//     await signIn("credentials", {
//       email,
//       password,
//       redirectTo: "/dashboard",
//     });

//     console.log("Sign-in successful"); // Debug: Success
//     return {
//       status: "success",
//       data: {
//         message: "Login successful",
//       },
//       redirectUrl: "/dashboard",
//     };
//   } catch (error) {
//     console.error("Sign-in failed:", error); // Debug: Catch error

//     if (error) {
//       console.log("Handling error:", error); // Debug: Log error type
//       switch (error) {
//         case "CredentialsSignin":
//           console.warn("Invalid credentials provided"); // Debug: Specific error case
//           return {
//             status: "error",
//             data: {
//               issues: ["Invalid email or password"],
//             },
//           };
//         default:
//           console.warn("Unhandled error case"); // Debug: Default error case
//           return {
//             status: "error",
//             data: {
//               issues: ["Authentication failed"],
//             },
//           };
//       }
//     }

//     if (error instanceof Error) {
//       console.error("Error instance caught:", error.message); // Debug: Error instance
//       return {
//         status: "error",
//         data: {
//           issues: [error.message],
//         },
//       };
//     }

//     console.error("Unknown error occurred"); // Debug: Unknown error
//     return {
//       status: "error",
//       data: {
//         issues: ["An unexpected error occurred. Please try again."],
//       },
//     };
//   }
// }

// import axios from "axios";

// export async function loginAction(
//   prevState: LoginFormState,
//   formData: FormData
// ): Promise<LoginFormState> {
//   console.log("Login action initiated");
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   console.log("Extracted email:", email);
//   console.log(
//     "Extracted password:",
//     password ? "[HIDDEN]" : "No password provided"
//   );

//   try {
//     console.log("Attempting server-side authentication...");

//     // Call your NextAuth or custom API endpoint
//     // const response = await fetch("/api/auth", {
//     //   email,
//     //   password,
//     // });

//     // Construct absolute URL for API call
//     const baseUrl =
//       process.env.NEXTAUTH_URL || // Use environment variable if available
//       `http://localhost:3000`; // Fallback for development
//     const apiEndpoint = `${baseUrl}/api/auth/signin/credentials`;

//     // Make the API call using fetch
//     const response = await fetch(apiEndpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     });

//     console.log("Authentication response:", response.data);

//     if (response.data.success) {
//       console.log("Sign-in successful");
//       return {
//         status: "success",
//         data: {
//           message: "Login successful",
//         },
//         redirectUrl: "/dashboard",
//       };
//     } else {
//       console.warn("Invalid credentials provided");
//       return {
//         status: "error",
//         data: {
//           issues: ["Invalid email or password"],
//         },
//       };
//     }
//   } catch (error) {
//     console.error("Authentication failed:", error);

//     return {
//       status: "error",
//       data: {
//         issues: ["An unexpected error occurred. Please try again."],
//       },
//     };
//   }
// }

// export async function loginAction(
//   prevState: LoginFormState,
//   formData: FormData
// ): Promise<LoginFormState> {
//   console.log("Login action initiated");
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   console.log("Extracted email:", email);
//   console.log("Extracted password:", password ? "[HIDDEN]" : "No password provided");

//   try {
//     console.log("Attempting server-side authentication...");

//     // Construct absolute URL for API call
//     const baseUrl =
//       process.env.NEXTAUTH_URL || // Use environment variable if available
//       `http://localhost:3000`; // Fallback for development
//     const apiEndpoint = `${baseUrl}/api/auth/signin/credentials`;

//     // Make the API call using fetch
//     const response = await fetch(apiEndpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     });

//     console.log("Response status:", response.status);

//     if (!response.ok) {
//       console.warn("Failed to authenticate, status:", response.status);
//       return {
//         status: "error",
//         data: {
//           issues: ["Invalid email or password"],
//         },
//       };
//     }

//     const data = await response.json();
//     console.log("Authentication response data:", data);

//     if (data.success) {
//       console.log("Sign-in successful");
//       return {
//         status: "success",
//         data: {
//           message: "Login successful",
//         },
//         redirectUrl: "/dashboard",
//       };
//     } else {
//       console.warn("Invalid credentials provided");
//       return {
//         status: "error",
//         data: {
//           issues: ["Invalid email or password"],
//         },
//       };
//     }
//   } catch (error) {
//     console.error("Authentication failed:", error);

//     return {
//       status: "error",
//       data: {
//         issues: ["An unexpected error occurred. Please try again."],
//       },
//     };
//   }
// }

// export async function loginAction(
//   prevState: LoginFormState,
//   formData: FormData
// ): Promise<LoginFormState> {
//   console.log("Login action initiated");
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   console.log("Extracted email:", email);
//   console.log("Extracted password:", password ? "[HIDDEN]" : "No password provided");

//   try {
//     console.log("Attempting server-side authentication...");

//     const baseUrl =
//       process.env.NEXTAUTH_URL || `http://localhost:3000`;
//     const apiEndpoint = `${baseUrl}/api/auth/signin/credentials`;

//     // Make the API call with redirect set to "manual"
//     const response = await fetch(apiEndpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//       redirect: "manual", // Prevent following redirects
//     });

//     console.log("Response status:", response.status);
//     console.log("Response headers:", response.headers);

//     // Handle redirects or unexpected status codes
//     if (response.status === 302) {
//       console.warn("Redirect detected. Location:", response.headers.get("Location"));
//       return {
//         status: "error",
//         data: {
//           issues: ["Redirect occurred, check authentication flow."],
//         },
//       };
//     }

//     if (!response.ok) {
//       console.warn("Failed to authenticate, status:", response.status);
//       return {
//         status: "error",
//         data: {
//           issues: ["Invalid email or password"],
//         },
//       };
//     }

//     const data = await response.json();
//     console.log("Authentication response data:", data);

//     if (data.success) {
//       console.log("Sign-in successful");
//       return {
//         status: "success",
//         data: {
//           message: "Login successful",
//         },
//         redirectUrl: "/dashboard",
//       };
//     } else {
//       console.warn("Invalid credentials provided");
//       return {
//         status: "error",
//         data: {
//           issues: ["Invalid email or password"],
//         },
//       };
//     }
//   } catch (error) {
//     console.error("Authentication failed:", error);

//     return {
//       status: "error",
//       data: {
//         issues: ["An unexpected error occurred. Please try again."],
//       },
//     };
//   }
// }

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
