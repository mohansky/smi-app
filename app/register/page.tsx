import { RegisterForm } from "@/components/forms/register-form";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Container width="marginxy">
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>Create your account to continue.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <RegisterForm />

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-muted-foreground text-xs uppercase">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" className="w-full">
                Google
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
