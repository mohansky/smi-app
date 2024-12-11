"use client";
import { LoginForm } from "@/components/forms/login-form";
import { Container } from "@/components/custom-ui/container";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import Link from "next/link";
// import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <Container width="marginxy">
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <LoginForm />

            {/* <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-muted-foreground text-xs uppercase">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
                Google
              </Button>
            </div> */}

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
