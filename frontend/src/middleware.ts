import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("access_token");

  if (request.nextUrl.pathname === "/login") {
    if (jwt) {
      try {
        await jwtVerify(
          jwt?.value,
          new TextEncoder().encode(process.env.JWT_SECRET)
        );
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}`);
      } catch (error) {
        return NextResponse.next();
      }
    }
  }
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/settings" || request.nextUrl.pathname === "/profile"
      || request.nextUrl.pathname === "/chat" || request.nextUrl.pathname === "/leaderboard") {
    if (jwt === undefined)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_CLIENT_URL}/login`
      );
    try {
      await jwtVerify(
        jwt?.value,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_CLIENT_URL}/login`
      );
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
