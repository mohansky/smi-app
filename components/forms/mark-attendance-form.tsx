"use client";
import { useActionState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AttendanceFormValues,
  attendanceSchema,
} from "@/lib/validations/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AttendanceFormState } from "@/types";
import { DialogClose, DialogFooter } from "../ui/dialog";

export const AttendanceForm = ({
  studentId,
  submitAttendanceAction,
  onSuccess,
}: {
  studentId: number;
  submitAttendanceAction: (
    prevState: AttendanceFormState,
    data: FormData
  ) => Promise<AttendanceFormState>;
  onSuccess: () => void;
}) => {
  const [state, formAction, isPending] = useActionState(
    submitAttendanceAction,
    {
      status: "idle",
      data: {
        message: "",
        user: undefined,
        issues: [],
      },
      studentId,
    }
  );

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId,
      notes: "",
      status: "present",
      date: new Date(),
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (state.status === "success" && !state.data?.issues) {
      // form.reset();
      onSuccess();
    }
  }, [state, form, onSuccess]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      form.trigger();
      return values;
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Mark Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(state?.data?.message ||
          (state?.data?.issues && state.data.issues.length > 0)) && (
          <div
            className={`font-bold mb-10 ${
              state.data.issues ? "text-destructive" : "text-active"
            }`}
          >
            {state.data.issues && state.data.issues.length > 0 ? (
              state.data.issues.map((issue, index) => (
                <p key={index}>{issue}</p>
              ))
            ) : (
              <p>{state.data.message}</p>
            )}
          </div>
        )}

        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Student ID"
                      {...field}
                      value={field.value}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Input type="hidden" name="status" value={field.value} />
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional notes"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding Attendance..." : "Mark Attendance"}
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
