import { NextRequest, NextResponse } from "next/server";

const COOKIE = "cnc_admin";

export function proxy(request: NextRequest) {
    const key = request.nextUrl.searchParams.get("key");
    const cookie = request.cookies.get(COOKIE)?.value;

    // Valid key in URL — set cookie and redirect to clean URL
    if (key === process.env.ADMIN_SECRET) {
        const url = request.nextUrl.clone();
        url.searchParams.delete("key");
        const res = NextResponse.redirect(url);
        res.cookies.set(COOKIE, process.env.ADMIN_SECRET!, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 8, // 8 jam
        });
        return res;
    }

    // Valid cookie — allow through
    if (cookie === process.env.ADMIN_SECRET) {
        return NextResponse.next();
    }

    // No valid auth — redirect to home
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
