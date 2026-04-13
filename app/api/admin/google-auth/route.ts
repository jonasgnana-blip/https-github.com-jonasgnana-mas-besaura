import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { getOAuthUrl } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Use GOOGLE_REDIRECT_URI if set, otherwise fall back to NEXT_PUBLIC_APP_URL.
  // This must exactly match one of the URIs registered in Google Cloud Console.
  // Register: https://masbesaura.com/api/admin/google-callback
  const redirectUri = getRedirectUri(req);
  const url = getOAuthUrl(redirectUri);

  return NextResponse.redirect(url);
}

export function getRedirectUri(req: NextRequest): string {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;
  // Use the actual host from the request (works for both masbesaura.com and www.)
  const host = req.headers.get("host") ?? "masbesaura.com";
  const proto = host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}/api/admin/google-callback`;
}
