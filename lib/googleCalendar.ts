import { prisma } from "@/lib/prisma";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const CALENDAR_ID = "primary"; // masbesaura@gmail.com primary calendar

// ── Config keys ───────────────────────────────────────────────────────────────

const REFRESH_TOKEN_KEY = "google_refresh_token";

export async function getStoredRefreshToken(): Promise<string | null> {
  try {
    const row = await prisma.sistemaConfig.findUnique({
      where: { clave: REFRESH_TOKEN_KEY },
    });
    return row?.valor ?? null;
  } catch {
    return null;
  }
}

export async function storeRefreshToken(token: string) {
  await prisma.sistemaConfig.upsert({
    where: { clave: REFRESH_TOKEN_KEY },
    update: { valor: token },
    create: { clave: REFRESH_TOKEN_KEY, valor: token },
  });
}

// ── OAuth2 URL ─────────────────────────────────────────────────────────────────

export function getOAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.events",
    access_type: "offline",
    prompt: "consent", // force refresh token every time
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// ── Token exchange ─────────────────────────────────────────────────────────────

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<{ access_token: string; refresh_token?: string }> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }
  return res.json();
}

// ── Get fresh access token ─────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) throw new Error("Google Calendar not connected");

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Access token refresh failed: ${err}`);
  }
  const data = await res.json();
  return data.access_token;
}

// ── Create calendar event ──────────────────────────────────────────────────────

export async function createCalendarEvent(booking: {
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  fecha_entrada: string; // ISO date "2026-06-01"
  fecha_salida: string;
  precio_total: number;
  habitacion: string;
  complementos?: string[];
}): Promise<string | null> {
  try {
    const accessToken = await getAccessToken();

    const desc = [
      `👤 Cliente: ${booking.nombre_cliente}`,
      `📧 Email: ${booking.email_cliente}`,
      `📞 Teléfono: ${booking.telefono_cliente}`,
      `🏡 Espacio: ${booking.habitacion}`,
      `💶 Total: ${booking.precio_total}€`,
      booking.complementos?.length
        ? `➕ Complementos: ${booking.complementos.join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const event = {
      summary: `Reserva — ${booking.nombre_cliente}`,
      description: desc,
      start: { date: booking.fecha_entrada },
      end: { date: booking.fecha_salida },
      colorId: "2", // Sage green
    };

    const res = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Calendar event creation failed:", err);
      return null;
    }

    const data = await res.json();
    return data.id ?? null;
  } catch (err) {
    console.error("createCalendarEvent error:", err);
    return null;
  }
}
