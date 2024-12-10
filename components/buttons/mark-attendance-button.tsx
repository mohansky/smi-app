"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { AttendanceForm } from "../forms/mark-attendance-form";
import { submitAttendanceAction } from "@/app/actions/attendance";

export default function MarkAttendanceButton({ id }: { id: number }) {
  return (
    <div className="flex justify-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button title="Mark Attendance" size="sm">
            <span className="sr-only">Open menu</span>
            Mark Attendance
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <AttendanceForm
            studentId={id}
            submitAttendanceAction={submitAttendanceAction}
            onSuccess={() => toast.success("Student added successfully!")}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
