"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import AddStudentForm from "../forms/add-student-form";
import { addStudent } from "@/app/actions/student"; 

export default function AddStudentButton() {
  const [isOpen, setIsOpen] = useState(false);
 
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-5">
          <PlusIcon className="h-5 w-5" />
          Register Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Add New Student</DialogTitle>
        </DialogHeader>
        <AddStudentForm
          addStudent={addStudent} 
        />
      </DialogContent>
    </Dialog>
  );
}
