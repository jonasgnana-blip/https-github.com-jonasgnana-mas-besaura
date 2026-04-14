import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, storeRefreshToken } from "@/lib/googleCalendar";
import { getRedirectUri } from "../google-auth/route";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const host = req.headers.get("host") ?? "masbesaura.com";
  const proto = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${proto}://${host}`;

  const redirectUri = getRedirectUri(req);

  if (error || !code) {
    console.error("[google-callback] OAuth error:", error);
    return NextResponse.redirect(
      `${baseUrl}/admin?gcal=error&msg=${encodeURIComponent(error ?? "no_code")}`
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    if (!tokens.refresh_token) {
      // Google only returns refresh_token on first auth or when prompt=consent.
      // If missing, the token exchange worked but no refresh token was issued.
      console.warn("[google-callback] No refresh_token received. Token may already exist.");
    } else {
      await storeRefreshToken(tokens.refresh_token);
    }

    return NextResponse.redirect(`${baseUrl}/admin?gcal=ok`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[google-callback] Token exchange error:", msg);
    return NextResponse.redirect(
      `${baseUrl}/admin?gcal=error&msg=${encodeURIComponent(msg)}`
    );
  }
}
