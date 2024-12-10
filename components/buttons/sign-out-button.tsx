"use client"; 
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button onClick={handleSignOut}  size="sm" className="w-full">
      Sign Out
    </Button>
  );
}
