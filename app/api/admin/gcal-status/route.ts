import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { getStoredRefreshToken } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const refreshToken = await getStoredRefreshToken();

  return NextResponse.json({
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.slice(0, 10) ?? null,
    hasRefreshToken: !!refreshToken,
  });
}
