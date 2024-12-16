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
import { AttendanceForm } from "../forms/mark-attendance-form";
import { submitAttendanceAction } from "@/app/actions/attendance";

export default function MarkAttendanceButton({ id, className }: { id: number, className?: string }) {
  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button title="Mark Attendance" size="sm">
            <span className="sr-only">Open menu</span>
            Mark Attendance
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Mark Attendance</DialogTitle>
          </DialogHeader>
          <AttendanceForm
            studentId={id}
            submitAttendanceAction={submitAttendanceAction}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
