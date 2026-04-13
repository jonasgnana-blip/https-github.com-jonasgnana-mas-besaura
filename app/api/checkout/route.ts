import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://masbesaura.com";

const SUCCESS_URL = `${SITE_URL}/reservar/exito?session_id={CHECKOUT_SESSION_ID}`;
const CANCEL_URL = `${SITE_URL}/reservar/cancelado`;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY no configurada en Vercel");
  return new Stripe(key);
}

type HabitacionBody = {
  tipo: "habitacion";
  nombre: string;
  opcion: "desayuno" | "media_pension";
  precio: number;
  noches?: number;
  fecha_entrada?: string;
  fecha_salida?: string;
  reserva_id?: string;
};

type ActividadBody = {
  tipo: "actividad";
  nombre: string;
  precio: number;
  cantidad?: number;
  descripcion?: string;
};

type CabanyaBody = {
  tipo: "cabanya";
  precio: number;
  personas: number;
  dias?: number;
  fecha_entrada?: string;
  fecha_salida?: string;
  nombre_cliente?: string;
  email_cliente?: string;
  telefono_cliente?: string;
};

type AlquilerBody = {
  tipo: "alquiler";
  precio: number;
  personas: number;
  dias: number;
};

// Legacy body (room booking by reserva_id)
type LegacyBody = {
  reserva_id: string;
};

type CheckoutBody =
  | HabitacionBody
  | ActividadBody
  | CabanyaBody
  | AlquilerBody
  | LegacyBody;

// ── Input validation helpers ──────────────────────────────────────────────────

function isValidPrice(p: unknown): p is number {
  return typeof p === "number" && isFinite(p) && p > 0 && p <= 50_000;
}
function isValidPersonas(p: unknown): p is number {
  return typeof p === "number" && Number.isInteger(p) && p >= 1 && p <= 100;
}
function isValidDias(d: unknown): d is number {
  return typeof d === "number" && Number.isInteger(d) && d >= 1 && d <= 365;
}
function sanitizeStr(s: unknown, maxLen = 200): string {
  if (typeof s !== "string") return "";
  return s.replace(/[<>]/g, "").slice(0, maxLen);
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();

    // ── Legacy path: reserva_id-based room checkout ────────────────────────
    if ("reserva_id" in body && body.reserva_id && !("tipo" in body)) {
      return handleLegacyReserva(body.reserva_id);
    }

    if (!("tipo" in body)) {
      return NextResponse.json(
        { error: "tipo o reserva_id requerido" },
        { status: 400 }
      );
    }

    // ── Typed checkout ─────────────────────────────────────────────────────
    // Validate common fields before delegating
    if ("precio" in body && !isValidPrice(body.precio)) {
      return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
    }
    if ("personas" in body && !isValidPersonas(body.personas)) {
      return NextResponse.json({ error: "Número de personas inválido" }, { status: 400 });
    }
    if ("dias" in body && body.dias != null && !isValidDias(body.dias)) {
      return NextResponse.json({ error: "Número de días inválido" }, { status: 400 });
    }
    if ("noches" in body && body.noches != null && !isValidDias(body.noches)) {
      return NextResponse.json({ error: "Número de noches inválido" }, { status: 400 });
    }
    if ("nombre" in body) (body as HabitacionBody).nombre = sanitizeStr(body.nombre);
    if ("descripcion" in body && body.descripcion)
      (body as ActividadBody).descripcion = sanitizeStr(body.descripcion, 500);

    switch (body.tipo) {
      case "habitacion":
        return handleHabitacion(body);
      case "actividad":
        return handleActividad(body);
      case "cabanya":
        return handleCabanya(body);
      case "alquiler":
        return handleAlquiler(body);
      default:
        return NextResponse.json({ error: "tipo no reconocido" }, { status: 400 });
    }
  } catch (err) {
    console.error("[checkout] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleHabitacion(body: HabitacionBody) {
  const noches = body.noches ?? 1;
  const opcionLabel =
    body.opcion === "desayuno" ? "Con desayuno" : "Media pensión";
  const descripcion = [
    opcionLabel,
    body.fecha_entrada && body.fecha_salida
      ? `${fmtDate(body.fecha_entrada)} → ${fmtDate(body.fecha_salida)}`
      : undefined,
    `${noches} noche${noches !== 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    locale: "es",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(body.precio * 100),
          product_data: {
            name: body.nombre,
            description: descripcion,
          },
        },
      },
    ],
    metadata: {
      tipo: "habitacion",
      nombre: body.nombre,
      opcion: body.opcion,
      noches: String(noches),
      fecha_entrada: body.fecha_entrada ?? "",
      fecha_salida: body.fecha_salida ?? "",
      reserva_id: body.reserva_id ?? "",
    },
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
  });

  // If a reserva_id was passed, persist the stripe session id
  if (body.reserva_id) {
    const { prisma } = await import("@/lib/prisma");
    await prisma.reserva.update({
      where: { id: body.reserva_id },
      data: { stripe_session_id: session.id },
    });
  }

  return NextResponse.json({ url: session.url });
}

async function handleActividad(body: ActividadBody) {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    locale: "es",
    line_items: [
      {
        quantity: body.cantidad ?? 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(body.precio * 100),
          product_data: {
            name: body.nombre,
            description: body.descripcion ?? undefined,
          },
        },
      },
    ],
    metadata: {
      tipo: "actividad",
      nombre: body.nombre,
      descripcion: body.descripcion ?? "",
      cantidad: String(body.cantidad ?? 1),
    },
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
  });

  return NextResponse.json({ url: session.url });
}

async function handleCabanya(body: CabanyaBody) {
  const dias = body.dias ?? 1;
  const fechas = body.fecha_entrada && body.fecha_salida
    ? ` · ${fmtDate(body.fecha_entrada)} → ${fmtDate(body.fecha_salida)}`
    : body.fecha_entrada ? ` · ${fmtDate(body.fecha_entrada)}` : "";
  const desc = `${body.personas} persona${body.personas !== 1 ? "s" : ""} · ${dias} día${dias !== 1 ? "s" : ""}${fechas}`;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    locale: "es",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(body.precio * 100),
          product_data: {
            name: "Reserva La Cabanya — Mas Besaura",
            description: desc,
          },
        },
      },
    ],
    metadata: {
      tipo: "cabanya",
      personas: String(body.personas),
      dias: String(dias),
      fecha_entrada: body.fecha_entrada ?? "",
      fecha_salida: body.fecha_salida ?? "",
      nombre_cliente: body.nombre_cliente ?? "",
      email_cliente: body.email_cliente ?? "",
    },
    customer_email: body.email_cliente || undefined,
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
  });

  return NextResponse.json({ url: session.url });
}

async function handleAlquiler(body: AlquilerBody) {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    locale: "es",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(body.precio * 100),
          product_data: {
            name: "Alquiler de la casa",
            description: `${body.personas} persona${body.personas !== 1 ? "s" : ""} · ${body.dias} día${body.dias !== 1 ? "s" : ""}`,
          },
        },
      },
    ],
    metadata: {
      tipo: "alquiler",
      personas: String(body.personas),
      dias: String(body.dias),
    },
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
  });

  return NextResponse.json({ url: session.url });
}

// ── Legacy handler (original reserva_id flow) ─────────────────────────────────

async function handleLegacyReserva(reserva_id: string) {
  const { prisma } = await import("@/lib/prisma");
  const reserva = await prisma.reserva.findUnique({
    where: { id: reserva_id },
    include: {
      habitacion: true,
      complementos: { include: { complemento: true } },
    },
  });

  if (!reserva) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  if (reserva.estado !== "PENDIENTE_PAGO") {
    return NextResponse.json(
      { error: "Esta reserva ya no está disponible" },
      { status: 409 }
    );
  }

  const noches = Math.round(
    (reserva.fecha_salida.getTime() - reserva.fecha_entrada.getTime()) / 86400000
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? SITE_URL;

  const lineItems: Stripe.Checkout.SessionCreateParams["line_items"] = [
    {
      quantity: noches,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(Number(reserva.habitacion.precio_noche) * 100),
        product_data: {
          name: reserva.habitacion.nombre,
          description: `${noches} noche${noches > 1 ? "s" : ""} · ${reserva.fecha_entrada.toLocaleDateString("es-ES")} → ${reserva.fecha_salida.toLocaleDateString("es-ES")}`,
        },
      },
    },
    ...reserva.complementos.map((rc) => ({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(Number(rc.precio_aplicado) * 100),
        product_data: {
          name: rc.complemento.nombre,
          description: rc.complemento.descripcion,
        },
      },
    })),
  ];

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: reserva.email_cliente,
    locale: "es",
    metadata: { reserva_id: reserva.id },
    success_url: `${appUrl}/reservar/exito?reserva_id=${reserva.id}`,
    cancel_url: `${appUrl}/reservar/cancelado?reserva_id=${reserva.id}`,
    payment_intent_data: { metadata: { reserva_id: reserva.id } },
  });

  await prisma.reserva.update({
    where: { id: reserva.id },
    data: { stripe_session_id: session.id },
  });

  return NextResponse.json({ url: session.url });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
