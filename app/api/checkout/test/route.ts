import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const dbUrl = process.env.DATABASE_URL;

  // Test 1: raw fetch to Stripe API (no SDK)
  let rawFetchTest = "no probado";
  if (stripeKey) {
    try {
      const res = await fetch("https://api.stripe.com/v1/balance", {
        headers: { Authorization: `Bearer ${stripeKey}` },
      });
      const data = await res.json();
      rawFetchTest = res.ok ? "OK" : JSON.stringify(data);
    } catch (e) {
      rawFetchTest = `fetch error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  // Test 2: basic external connectivity
  let connectTest = "no probado";
  try {
    const res = await fetch("https://httpbin.org/get");
    connectTest = res.ok ? "OK" : `status ${res.status}`;
  } catch (e) {
    connectTest = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    stripe_key: stripeKey ? `${stripeKey.slice(0, 12)}...` : "NO CONFIGURADA",
    db_url: dbUrl ? `${dbUrl.slice(0, 20)}...` : "NO CONFIGURADA",
    raw_stripe_fetch: rawFetchTest,
    external_connectivity: connectTest,
  });
}
