import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("access_token");
  const _2fajwt = request.cookies.get("2fa");

  if (request.nextUrl.pathname === "/login") {
    if (_2fajwt) {
      try {
        await jwtVerify(
          _2fajwt?.value,
          new TextEncoder().encode(process.env.JWT_2FA_SECRET_KEY)
        );
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/2fa`);
      } catch (error) {
        return NextResponse.next();
      }
    }
    else if (jwt) {
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
  if (request.nextUrl.pathname === "/2fa") {
    if (_2fajwt) {
      try {
        await jwtVerify(
          _2fajwt?.value,
          new TextEncoder().encode(process.env.JWT_2FA_SECRET_KEY)
        );
        return NextResponse.next();
      } catch (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`);
      }
    } else if (jwt) {
      try {
        await jwtVerify(
          jwt?.value,
          new TextEncoder().encode(process.env.JWT_SECRET)
        );
        return NextResponse.next();
      } catch (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`);
      }
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`);
    }
  }
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/settings" ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/chat") ||
    request.nextUrl.pathname === "/leaderboard" || 
    request.nextUrl.pathname.startsWith("/user") ||
    request.nextUrl.pathname === "/game"
  ) {
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
