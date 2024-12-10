"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>You are not logged in. Please log in to view your profile.</p>;
  }

  return (
    <div className="flex flex-col justify-center">
      <p>
        Welcome, <span className="capitalize">{session?.user?.name}</span>!
      </p>
      <p>
        <span className="text-muted-foreground text-sm"> Email: </span>
        <a href={`mailto:${session?.user?.email}`}>
          <Button variant="link" className="p-0 m-0">
            {session?.user?.email}
          </Button>
        </a>
      </p>
      <p>
        <span className="text-muted-foreground text-sm">Role: </span>
        {session?.user?.role === "ADMIN" ? "Admin" : "User"}
      </p>
    </div>
  );
}
