import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users> & {
  role: "USER" | "ADMIN" | null;
};

declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "USER" | "ADMIN";
      password?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: "USER" | "ADMIN" | null;
  }
}

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        try {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (existingUser.length === 0) {
            throw new Error("No account found with this email.");
          }

          const user: User = existingUser[0];

          if (!user.isVerified) {
            throw new Error("Account not verified.");
          }

          if (!user || !user.password) {
            throw new Error("User or Password not found.");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password as string
          );

          if (!isValidPassword) {
            throw new Error("Incorrect password.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "USER",
          };
        } catch (error) {
          console.error("Authentication error:", error);

          if (error instanceof Error) {
            throw error;
          }

          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = (token.role ?? "USER") as "USER" | "ADMIN";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
};
