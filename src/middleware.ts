import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  console.log("Token in middleware:", token);
  console.log("Request URL:", request.url);

  const isAuthPage =
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify") ||
    url.pathname.startsWith("/trypromptify") ||
    url.pathname === "/";

  const isProtectedRoute = ["/home", "/profile", "/settings"].some((route) =>
    url.pathname.startsWith(route)
  );

  // Prevent redirect loop by checking if the current path is already the target path
  if (token && isAuthPage) {
    if (url.pathname !== "/home") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  if (!token && isProtectedRoute) {
    if (url.pathname !== "/sign-in") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/verify/:path*", "/sign-in", "/sign-up", "/"],
};
