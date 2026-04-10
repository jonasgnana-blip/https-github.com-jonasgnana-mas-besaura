import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForTokens,
  storeRefreshToken,
} from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get("host")}`;
  const redirectUri = `${baseUrl}/api/admin/google-callback`;

  if (error || !code) {
    return NextResponse.redirect(
      `${baseUrl}/admin/configuracion?gcal=error&msg=${encodeURIComponent(error ?? "no_code")}`
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    if (tokens.refresh_token) {
      await storeRefreshToken(tokens.refresh_token);
    }

    return NextResponse.redirect(
      `${baseUrl}/admin/configuracion?gcal=ok`
    );
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/admin/configuracion?gcal=error&msg=${encodeURIComponent(String(err))}`
    );
  }
}
