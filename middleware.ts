import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;

    if (!token) {
      // Redirect to login if no token is found
      // console.log("No token found, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Extract role from the token
    const userRole = token.role;

    // Define role-based access
    const url = req.nextUrl.pathname;

    if (url.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      // Only admins can access `/dashboard/admin` routes
      // console.log("Access denied: Only admins allowed");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (url.startsWith("/dashboard/user") && userRole !== "USER") {
      // Only users can access `/dashboard/user` routes
      // console.log("Access denied: Only users allowed");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Proceed if authorized
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access only if the token exists
        return !!token;
      },
    },
  }
);

export const config = {
  // Apply middleware to specific routes
  matcher: ["/dashboard/:path*"],
};
