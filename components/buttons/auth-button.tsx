"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <Link
          href={
            session?.user?.role === "ADMIN"
              ? "/dashboard/admin"
              : "/dashboard/user"
          }
        >
          <Avatar>
            <AvatarImage
              src="/images/user.jpg"
              alt="User Avatar"
              title={`Dashboard for ${session.user.name}`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Button size="sm" onClick={() => signIn()}>
          Sign In
        </Button>
      )}
    </>
  );
}
