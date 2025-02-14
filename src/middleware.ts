import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  

  console.log("Token in middleware:", token);
  console.log("Request URL:", request.url);

  if (!token) {
    console.log("Token not found. Redirecting to sign-in.");
  }
  const isAuthPage =
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify") ||
    url.pathname.startsWith("/trypromptify") ||
    url.pathname.startsWith("/");

  // If the user is authenticated and tries to access auth pages, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If user is NOT authenticated and tries to visit a protected route, redirect to sign-in
  const protectedRoutes = ["/home", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (!token && isProtectedRoute && request.nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/verify/:path*", "/sign-in", "/sign-up", "/"],
};
