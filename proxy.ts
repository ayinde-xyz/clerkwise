import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users trying to access protected routes
  if (!session && pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect authenticated users away from login/signup pages
  if (session && ["/auth/login", "/auth/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to these routes
  matcher: ["/chat", "/auth/:path*"],
};
