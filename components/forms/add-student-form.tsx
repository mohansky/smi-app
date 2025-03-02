"use client";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentSchema } from "@/lib/validations/student";
import { INSTRUMENTS, GRADES, BATCHES } from "@/db/schema";
import { useEffect } from "react";
import { AddStudentFormState } from "@/types";
import { z } from "zod";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

// Helper function to get safe date value with TypeScript types
const getSafeDate = (date: Date | string | null | undefined): Date => {
  try {
    if (date === null || date === undefined) {
      return new Date();
    }
    
    const d = date instanceof Date ? date : new Date(date);
    return !isNaN(d.getTime()) ? d : new Date();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // Ignore error and return default date
    return new Date();
  }
};

// Helper function to format date for input with TypeScript types
const formatDateForInput = (date: Date | string | null | undefined): string => {
  try {
    const d = getSafeDate(date);
    return d.toISOString().split("T")[0];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // Ignore error and return empty string
    return "";
  }
};


export const AddStudentForm = ({
  addStudent,
}: {
  addStudent: (
    prevState: AddStudentFormState,
    data: FormData
  ) => Promise<AddStudentFormState>;
}) => {
  const [state, formAction, isPending] = useActionState(addStudent, {
    status: "idle",
    data: {
      message: "",
      user: undefined,
      issues: [],
    },
  });

  // Create safe default dates
  const today = new Date();
  const defaultDob = new Date();
  defaultDob.setFullYear(today.getFullYear() - 10); // Default age of 10 years

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      instrument: INSTRUMENTS.GUITAR,
      grade: GRADES.GRADE1,
      batch: BATCHES.MT,
      dateOfBirth: defaultDob,
      joiningDate: today,
      isActive: true,
    },
    mode: "onChange",
  });

  // Track date values in state to avoid conversion issues
  const [dateOfBirth, setDateOfBirth] = useState(
    formatDateForInput(defaultDob)
  );
  const [joiningDate, setJoiningDate] = useState(formatDateForInput(today));

  useEffect(() => {
    const subscription = form.watch((values) => {
      form.trigger();
      return values;
    });

    return () => subscription.unsubscribe();
  }, [form]);

  if (state.status === "success") {
    return (
      <Alert variant="default">
        <AlertTitle className="text-active text-xl">
          Student Added Successfully!
        </AlertTitle>
        <AlertDescription className="text-muted-foreground text-xs">
          Student details have been recorded in the system.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Add New Student
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state?.data?.message && (
          <div
            className={`font-bold mb-10 ${
              state.status === "error" || state.status === "existingStudent"
                ? "text-destructive"
                : "text-active"
            }`}
          >
            {state.status === "error" && <p>Invalid Fields please check.</p>}
            {state.status === "existingStudent" && <p>{state.data.message}</p>}
          </div>
        )}
        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          value instanceof Date
                            ? value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="joiningDate"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Joining Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          value instanceof Date
                            ? value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => {
                          setDateOfBirth(e.target.value);
                          if (e.target.value) {
                            field.onChange(new Date(e.target.value));
                          }
                        }}
                        name="dateOfBirth"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joiningDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joining Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={joiningDate}
                        onChange={(e) => {
                          setJoiningDate(e.target.value);
                          if (e.target.value) {
                            field.onChange(new Date(e.target.value));
                          }
                        }}
                        name="joiningDate"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="instrument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Instrument</FormLabel>
                    <Input
                      type="hidden"
                      name="instrument"
                      value={field.value}
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select instrument" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="guitar">Guitar</SelectItem>
                        <SelectItem value="drums">Drums</SelectItem>
                        <SelectItem value="keyboard">Keyboard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Grade</FormLabel>
                    <Input type="hidden" name="grade" value={field.value} />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="grade1">Grade 1</SelectItem>
                        <SelectItem value="grade2">Grade 2</SelectItem>
                        <SelectItem value="grade3">Grade 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Batch</FormLabel>
                    <Input type="hidden" name="batch" value={field.value} />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mt">Mon, Thur</SelectItem>
                        <SelectItem value="tf">Tue, Fri</SelectItem>
                        <SelectItem value="ws">Wed, Sat</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding Student..." : "Add Student"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddStudentForm;
