import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { renderEmailAdmin } from "@/lib/emails/email-admin";
import { renderEmailCliente } from "@/lib/emails/email-cliente";
import { createCalendarEvent } from "@/lib/googleCalendar";
import { sendReservaConfirmada } from "@/lib/notifications";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore — fetch client required on Vercel
  httpClient: Stripe.createFetchHttpClient(),
});
const resend = new Resend(process.env.RESEND_API_KEY!);

const ADMIN_EMAIL = process.env.EMAIL_ADMIN ?? "info@masbesaura.com";
const FROM_EMAIL  = process.env.EMAIL_FROM  ?? "no-reply@masbesaura.com";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Sin firma de Stripe" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[webhook] firma inválida:", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

    // ── Alojamiento (legacy Reserva) ──────────────────────────────────────────
    if (meta.reserva_id) {
      await handleReservaAlojamiento(session, meta.reserva_id);
      return NextResponse.json({ received: true });
    }

    // ── Actividad / Cabanya / Alquiler (ReservaActividad) ─────────────────────
    if (meta.reserva_actividad_id) {
      await handleReservaActividad(session, meta.reserva_actividad_id);
      return NextResponse.json({ received: true });
    }

    console.warn("[webhook] Sin reserva_id ni reserva_actividad_id en metadata", meta);
  }

  return NextResponse.json({ received: true });
}

// ── Alojamiento ───────────────────────────────────────────────────────────────

async function handleReservaAlojamiento(
  session: Stripe.Checkout.Session,
  reserva_id: string,
) {
  const reserva = await prisma.reserva.update({
    where: { id: reserva_id },
    data: { estado: "CONFIRMADA", expira_en: null },
    include: {
      habitacion: true,
      complementos: { include: { complemento: true } },
    },
  });

  const noches = Math.round(
    (reserva.fecha_salida.getTime() - reserva.fecha_entrada.getTime()) / 86400000
  );
  const fechaEntrada = reserva.fecha_entrada.toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });
  const fechaSalida = reserva.fecha_salida.toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });
  const complementosData = reserva.complementos.map((rc) => ({
    nombre: rc.complemento.nombre,
    precio_aplicado: Number(rc.precio_aplicado),
  }));

  const emailProps = {
    nombre_cliente: reserva.nombre_cliente,
    habitacion: reserva.habitacion.nombre,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    noches,
    complementos: complementosData,
    precio_total: Number(reserva.precio_total),
  };

  createCalendarEvent({
    nombre_cliente: reserva.nombre_cliente,
    email_cliente: reserva.email_cliente,
    telefono_cliente: reserva.telefono_cliente,
    fecha_entrada: reserva.fecha_entrada.toISOString().split("T")[0],
    fecha_salida: reserva.fecha_salida.toISOString().split("T")[0],
    precio_total: Number(reserva.precio_total),
    habitacion: reserva.habitacion.nombre,
    complementos: reserva.complementos.map((rc) => rc.complemento.nombre),
  }).catch((e) => console.error("[webhook] Google Calendar:", e));

  await Promise.all([
    resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🏡 Nueva reserva: ${reserva.nombre_cliente} · ${fechaEntrada}`,
      html: renderEmailAdmin({
        ...emailProps,
        email_cliente: reserva.email_cliente,
        telefono_cliente: reserva.telefono_cliente,
      }),
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: reserva.email_cliente,
      subject: `¡Tu reserva en Mas Besaura está confirmada! 🌿`,
      html: renderEmailCliente(emailProps),
    }),
  ]);

  console.log(`[webhook] Alojamiento ${reserva_id} CONFIRMADA`);

  sendReservaConfirmada({
    nombre_cliente: reserva.nombre_cliente,
    email_cliente: reserva.email_cliente,
    telefono_cliente: reserva.telefono_cliente,
    habitacion: reserva.habitacion.nombre,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    noches,
    precio_total: Number(reserva.precio_total),
    complementos: complementosData,
  }).catch((e) => console.error("[webhook] notifications:", e));
}

// ── Actividad / Cabanya / Alquiler ────────────────────────────────────────────

async function handleReservaActividad(
  session: Stripe.Checkout.Session,
  reserva_actividad_id: string,
) {
  const ra = await prisma.reservaActividad.update({
    where: { id: reserva_actividad_id },
    data: { estado: "CONFIRMADA" },
  });

  const tipoLabel: Record<string, string> = {
    actividad: "Actividad",
    cabanya: "Reserva La Cabanya",
    alquiler: "Alquiler Casa",
  };
  const label = tipoLabel[ra.tipo] ?? ra.tipo;
  const nombre = ra.actividad_nombre ?? label;

  const fechaEntrada = ra.fecha_inicio
    ? ra.fecha_inicio.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : "—";
  const fechaFin = ra.fecha_fin
    ? ra.fecha_fin.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const personas = ra.num_adultos;
  const total = Number(ra.precio_total);

  const whatsappNum = (process.env.ADMIN_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const whatsappMsg = encodeURIComponent(
    `Hola ${ra.nombre_cliente}, te escribo sobre tu reserva en Mas Besaura.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMsg}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FAFAF6;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #E8DCC8;">
    <div style="background:#2A3F24;padding:32px;text-align:center;">
      <h1 style="color:#F0EAD6;margin:0;font-size:24px;font-weight:normal;letter-spacing:1px;">Mas Besaura</h1>
      <p style="color:#C4A882;margin:8px 0 0;font-size:13px;font-family:Arial,sans-serif;">Nueva reserva — ${label}</p>
    </div>
    <div style="padding:32px;">
      <div style="margin-bottom:20px;">
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#4A6741;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">Cliente</div>
        <div style="font-size:20px;color:#2C1810;font-weight:bold;">${ra.nombre_cliente}</div>
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#2C1810;opacity:0.7;margin-top:4px;">${ra.email_cliente}${ra.telefono_cliente ? " · " + ra.telefono_cliente : ""}</div>
      </div>
      <div style="margin-bottom:20px;">
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#4A6741;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">Reserva</div>
        <div style="font-size:16px;color:#2C1810;">${nombre}</div>
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#4A6741;margin-top:4px;">
          ${fechaEntrada}${fechaFin && fechaFin !== fechaEntrada ? " → " + fechaFin : ""} · ${personas} persona${personas !== 1 ? "s" : ""}
        </div>
      </div>
      <div style="margin-bottom:24px;background:#F0EAD6;border-radius:8px;padding:16px;display:flex;justify-content:space-between;">
        <span style="font-family:Arial,sans-serif;font-size:15px;color:#2C1810;font-weight:bold;">Total pagado</span>
        <span style="font-family:Arial,sans-serif;font-size:15px;color:#4A6741;font-weight:bold;">${total}€</span>
      </div>
      <div style="text-align:center;">
        <a href="${whatsappUrl}" style="display:inline-block;padding:14px 28px;background:#25D366;color:white;text-decoration:none;border-radius:50px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">
          💬 Contactar por WhatsApp
        </a>
      </div>
    </div>
    <div style="padding:20px 32px;background:#F0EAD6;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#2C1810;opacity:0.6;">
      Mas Besaura · info@masbesaura.com · +34 665 822 542
    </div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `✅ ${label}: ${ra.nombre_cliente} · ${fechaEntrada}`,
    html,
  });

  console.log(`[webhook] ReservaActividad ${reserva_actividad_id} CONFIRMADA · tipo=${ra.tipo}`);
}
