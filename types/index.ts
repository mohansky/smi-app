import { demoFormSchema } from "@/lib/demoFormValidation";
import { formSchema } from "@/lib/formValidation";
import { attendanceSchema } from "@/lib/validations/attendance";
import { paymentSchema } from "@/lib/validations/payments";
import { StudentFormValues, studentSchema } from "@/lib/validations/student";
import { UserLoginSchema } from "@/lib/validations/user";
import { z } from "zod";

export interface StudentPageProps {
  params: Promise<{
    studentId: number;
  }>;
}

export interface StudentResponse {
  student: StudentFormValues;
}

export interface ActionState {
  message?: string | null;
  issues?: string[];
  errors?: {
    [key: string]: string[];
  } | null;
}

export interface ContactFormActionState {
  message: string | string[];
  user?: z.infer<typeof formSchema>;
  issues?: string[];
}

export interface DeleteButtonProps<T> {
  deleteAction: (id: T) => Promise<ActionState>;
  id: T;
  identifier: string | number;
  entityType: string;
  additionalDescription?: string;
}

export interface DeleteAttendanceError {
  error: string;
  cause?: unknown;
}

export interface AttendanceWithStudent {
  id: number;
  studentId: number;
  studentName: string;
  date: Date;
  status: string;
  notes: string | null;
}

export interface DemoClassFormProps {
  fetchTitle: string;
  onDemoFormAction: (
    prevState: {
      message: string;
      user?: z.infer<typeof demoFormSchema>;
      issues?: string[];
    },
    formData: FormData
  ) => Promise<{
    message: string;
    user?: z.infer<typeof demoFormSchema>;
    issues?: string[];
  }>;
}

export interface AddStudentFormState {
  status: "idle" | "submitting" | "success" | "error";
  data?: {
    id?: string;
    message?: string | string[];
    user?: z.infer<typeof studentSchema>;
    issues?: string[];
  };
  error?: {
    message: string;
    code?: string;
  } | null;
  // // Additional metadata
  // timestamp?: number;
  // attempts?: number;  // Number of submission attempts
}

export interface FullActionState {
  status: "idle" | "submitting" | "success" | "error";
  data?: {
    id?: string;
    message?: string | string[];
    user?: z.infer<typeof formSchema>;
    issues?: string[];
  };
  error?: {
    message: string;
    code?: string;
  } | null;
  // // Additional metadata
  // timestamp?: number;
  // attempts?: number;  // Number of submission attempts
}

export interface DemoFormState {
  fetchTitle: string;
  status: "idle" | "submitting" | "success" | "error";

  data?: {
    id?: string;
    message?: string | string[];
    user?: z.infer<typeof demoFormSchema>;
    issues?: string[];
  };

  error?: {
    message: string;
    code?: string;
  } | null;
}

export interface UpdateStudentFormState extends AddStudentFormState {
  studentId: number;
  initialValues: StudentFormValues;
}

export interface AttendanceFormState {
  studentId: number;
  status: "idle" | "submitting" | "success" | "error";

  data?: {
    id?: string;
    message?: string | string[];
    user?: z.infer<typeof attendanceSchema>;
    issues?: string[];
  };

  error?: {
    message: string;
    code?: string;
  } | null;
}

export interface PaymentFormState {
  studentId: number;
  status: "idle" | "submitting" | "success" | "error";

  data?: {
    id?: string;
    message?: string | string[];
    user?: z.infer<typeof paymentSchema>;
    issues?: string[];
  };

  error?: {
    message: string;
    code?: string;
  } | null;
}

export interface LoginFormState {
  // studentId: number;
  status: "idle" | "submitting" | "success" | "error";
  redirectUrl?: string;

  data?: {
    id?: string;
    message?: string | string[];
    user?: z.infer<typeof UserLoginSchema>;
    // user?: unknown;
    issues?: string[];
  };

  error?: {
    message: string;
    code?: string;
  } | null;
}
