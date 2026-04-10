import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { getOAuthUrl } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  // Verify admin session
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get("host")}`;
  const redirectUri = `${baseUrl}/api/admin/google-callback`;
  const url = getOAuthUrl(redirectUri);

  return NextResponse.redirect(url);
}
