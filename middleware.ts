import { NextRequest, NextResponse } from "next/server";

const COOKIE = "cnc_admin";

export function middleware(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const cookie = request.cookies.get(COOKIE)?.value;

  if (key === process.env.ADMIN_SECRET) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("key");

    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE, process.env.ADMIN_SECRET!, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  }

  if (cookie === process.env.ADMIN_SECRET) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
