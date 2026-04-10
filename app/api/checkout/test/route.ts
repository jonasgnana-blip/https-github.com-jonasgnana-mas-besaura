import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const dbUrl = process.env.DATABASE_URL;

  let stripeTest = "no probado";
  if (stripeKey) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey, {
        httpClient: Stripe.createFetchHttpClient(),
      });
      await stripe.checkout.sessions.list({ limit: 1 });
      stripeTest = "OK";
    } catch (e) {
      stripeTest = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    stripe_key: stripeKey ? `${stripeKey.slice(0, 12)}...` : "NO CONFIGURADA",
    db_url: dbUrl ? `${dbUrl.slice(0, 20)}...` : "NO CONFIGURADA",
    stripe_test: stripeTest,
  });
}
