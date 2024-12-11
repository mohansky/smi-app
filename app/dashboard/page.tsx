import { Heading } from "@/components/custom-ui/heading";
import { UserProfile } from "@/components/user-profile";
import React from "react";

export default function Dashboard() {
  return (
    <>
      <Heading size="xl" fontweight="bold" className="mb-4">
        Dashboard
      </Heading>
      <UserProfile />
    </>
  );
}
