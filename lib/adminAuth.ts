// Uses Web Crypto API (works in both Edge Runtime and Node.js 18+)

export const SESSION_COOKIE = "mb_admin";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12h

const enc = (s: string) => new TextEncoder().encode(s);

function b64uEncode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function b64uDecode(s: string): Uint8Array<ArrayBuffer> {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET missing");
  return crypto.subtle.importKey(
    "raw",
    enc(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_DURATION_MS });
  const b64 = b64uEncode(enc(payload).buffer as ArrayBuffer);
  const key = await getHmacKey();
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc(b64));
  return `${b64}.${b64uEncode(sigBuf)}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const key = await getHmacKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      b64uDecode(sig),
      enc(b64)
    );
    if (!valid) return false;
    const { exp } = JSON.parse(
      new TextDecoder().decode(b64uDecode(b64))
    );
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD;
  if (!stored) return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc(input)),
    crypto.subtle.digest("SHA-256", enc(stored)),
  ]);
  const ua = new Uint8Array(a);
  const ub = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}
