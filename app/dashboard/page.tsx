import { Container } from "@/components/custom-ui/container";
import { Heading } from "@/components/custom-ui/heading";
import { UserProfile } from "@/components/user-profile";
import React from "react";

export default function Dashboard() {
  return (
    <Container width="marginxy">
      <Heading size="xl" fontweight="bold" className="mb-4">
        Dashboard
      </Heading>
      <UserProfile />
    </Container>
  );
}
