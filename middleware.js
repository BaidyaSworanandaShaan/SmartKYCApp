import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export function middleware(req) {
  const origin = req.headers.get("origin");
  const allowedOrigins = ["http://localhost:3001"]; // Form App URL

  // Handle CORS Preflight Requests
  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  // Proceed with authentication
  const res = NextResponse.next();
  if (allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return res;
}

// Apply authentication middleware
export default withAuth(middleware, {
  pages: {
    signIn: "/signin",
  },
});

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard", "/api/citizenship"],
};
