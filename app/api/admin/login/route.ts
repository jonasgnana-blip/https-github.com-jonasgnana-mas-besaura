import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createSessionToken,
  SESSION_COOKIE,
} from "@/lib/adminAuth";

// ── In-memory rate limiter ────────────────────────────────────────────────────
// Tracks failed attempts per IP. Resets after WINDOW_MS.
// Note: per-instance on serverless — good enough as a first layer.

const WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS = 5;

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, AttemptRecord>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) return false;
  return rec.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    rec.count++;
  }
}

function clearRecord(ip: string): void {
  attempts.delete(ip);
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limit check
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 1 minuto." },
      { status: 429 }
    );
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const { password } = body;

  if (typeof password !== "string" || password.length < 1) {
    return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
  }

  // Add a small artificial delay to slow down automated attacks
  await new Promise((r) => setTimeout(r, 400));

  if (!(await verifyAdminPassword(password))) {
    recordFailure(ip);
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  // Success — clear the failure counter
  clearRecord(ip);

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 12 * 60 * 60, // 12 h
    // path "/" so the cookie is sent to both /admin/* AND /api/admin/*
    path: "/",
  });
  return res;
}
