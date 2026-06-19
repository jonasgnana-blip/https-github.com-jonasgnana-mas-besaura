import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login page: always allow
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
