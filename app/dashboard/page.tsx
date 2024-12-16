import { Heading } from "@/components/custom-ui/heading";
import StudentDetailsLoading from "@/components/skeletons/student-details-skeleton";
import { UserProfile } from "@/components/custom-ui/user-profile";
import React, { Suspense } from "react";

export default function Dashboard() {
  return (
    <>
      <Suspense fallback={<StudentDetailsLoading />}>
        <div className="w-[98vw] md:w-[75vw] mb-10">
          <Heading size="xl" fontweight="bold" className="mb-4">
            Dashboard
          </Heading>
          <UserProfile />
        </div>
      </Suspense>
    </>
  );
}
