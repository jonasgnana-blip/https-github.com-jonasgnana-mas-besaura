import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { renderEmailAdmin } from "@/lib/emails/email-admin";
import { renderEmailCliente } from "@/lib/emails/email-cliente";
import { createCalendarEvent } from "@/lib/googleCalendar";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore — fetch client required on Vercel
  httpClient: Stripe.createFetchHttpClient(),
});
const resend = new Resend(process.env.RESEND_API_KEY!);

const ADMIN_EMAIL  = process.env.EMAIL_ADMIN ?? "info@masbesaura.com";
const ADMIN_EMAIL2 = process.env.EMAIL_ADMIN2 ?? "masbesaura@gmail.com";
const FROM_EMAIL   = process.env.EMAIL_FROM  ?? "no-reply@masbesaura.com";

// All admin recipients (dedup in case they're the same)
const ADMIN_TO = [...new Set([ADMIN_EMAIL, ADMIN_EMAIL2])];

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

    // Increment discount code usage if one was applied
    if (meta.codigo_descuento) {
      prisma.codigoDescuento.update({
        where: { codigo: meta.codigo_descuento },
        data: { usos_actual: { increment: 1 } },
      }).catch((e) => console.error("[webhook] incrementar código descuento:", e));
    }

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
  // Idempotency guard: if already CONFIRMADA, skip processing entirely.
  // Stripe can deliver the same webhook event more than once.
  const existing = await prisma.reserva.findUnique({
    where: { id: reserva_id },
    select: { estado: true },
  });
  if (existing?.estado === "CONFIRMADA") {
    console.log(`[webhook] Alojamiento ${reserva_id} already CONFIRMADA, skip`);
    return;
  }

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
    num_adultos: reserva.num_adultos,
    precio_noche: Number(reserva.habitacion.precio_noche),
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
      to: ADMIN_TO,
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

  console.log(`[webhook] Alojamiento ${reserva_id} CONFIRMADA · ${noches} noches · ${reserva.num_adultos} personas`);
}

// ── Actividad / Cabanya / Alquiler ────────────────────────────────────────────

async function handleReservaActividad(
  session: Stripe.Checkout.Session,
  reserva_actividad_id: string,
) {
  const existingRa = await prisma.reservaActividad.findUnique({
    where: { id: reserva_actividad_id },
    select: { estado: true },
  });
  if (existingRa?.estado === "CONFIRMADA") {
    console.log(`[webhook] ReservaActividad ${reserva_actividad_id} already CONFIRMADA, skip`);
    return;
  }

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

  const fechasStr = fechaFin && fechaFin !== fechaEntrada
    ? `${fechaEntrada} → ${fechaFin}`
    : fechaEntrada;

  const whatsappNum = (process.env.ADMIN_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const whatsappMsgAdmin = encodeURIComponent(
    `Hola ${ra.nombre_cliente}, te escribo sobre tu reserva en Mas Besaura.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMsgAdmin}`;

  // ── Email admin ──────────────────────────────────────────────────────────────
  const htmlAdmin = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
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
          📅 ${fechasStr} · 👥 ${personas} persona${personas !== 1 ? "s" : ""}
        </div>
      </div>
      <div style="margin-bottom:24px;background:#F0EAD6;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:Arial,sans-serif;font-size:15px;color:#2C1810;font-weight:bold;">Total pagado</span>
        <span style="font-family:Arial,sans-serif;font-size:18px;color:#4A6741;font-weight:bold;">${total}€</span>
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

  // ── Email cliente ────────────────────────────────────────────────────────────
  const primerNombre = ra.nombre_cliente.split(" ")[0];
  const htmlCliente = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAF6;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #E8DCC8;">
    <div style="background:linear-gradient(160deg,#2A3F24 0%,#4A6741 100%);padding:48px 32px;text-align:center;">
      <h1 style="color:#F0EAD6;margin:0 0 8px;font-size:32px;font-weight:normal;">Mas Besaura</h1>
      <p style="color:#C4A882;margin:0;font-size:13px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">Tu reserva está confirmada</p>
    </div>
    <div style="padding:32px 32px 0;">
      <p style="font-size:20px;color:#2C1810;margin:0;">Hola, ${primerNombre} 👋</p>
    </div>
    <div style="padding:20px 32px 32px;">
      <p style="font-family:Arial,sans-serif;font-size:15px;color:#2C1810;line-height:1.7;margin-top:12px;">
        ¡Estamos encantados de recibirte! Tu reserva de <strong>${nombre}</strong> en Mas Besaura ha quedado confirmada.
      </p>

      <div style="background:#F0EAD6;border-radius:10px;padding:20px;margin:20px 0;">
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#4A6741;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Detalle de la reserva</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#2C1810;opacity:0.65;width:110px;">Tipo</td>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#2C1810;font-weight:bold;">${nombre}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#2C1810;opacity:0.65;">Fechas</td>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#2C1810;font-weight:bold;">📅 ${fechasStr}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#2C1810;opacity:0.65;">Personas</td>
            <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#2C1810;font-weight:bold;">👥 ${personas} persona${personas !== 1 ? "s" : ""}</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;font-family:Arial,sans-serif;font-size:15px;color:#2C1810;font-weight:bold;">Total pagado</td>
            <td style="padding:10px 0 0;font-family:Arial,sans-serif;font-size:17px;color:#4A6741;font-weight:bold;">${total}€</td>
          </tr>
        </table>
      </div>

      ${ra.tipo !== "actividad" ? `
      <div style="background:#2A3F24;border-radius:10px;padding:20px;margin:20px 0;">
        <h3 style="margin:0 0 10px;font-size:14px;color:#C4A882;font-family:Arial,sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">🗺️ Llegada</h3>
        <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;margin:0;color:#F0EAD6;opacity:0.85;">
          Te enviaremos las indicaciones por WhatsApp unos días antes.
          Check-in a partir de las <strong>16:00 h</strong> · Check-out antes de las <strong>11:00 h</strong>.
        </p>
      </div>
      ` : `
      <div style="background:#2A3F24;border-radius:10px;padding:20px;margin:20px 0;">
        <h3 style="margin:0 0 10px;font-size:14px;color:#C4A882;font-family:Arial,sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">📍 Punto de encuentro</h3>
        <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;margin:0;color:#F0EAD6;opacity:0.85;">
          Nos pondremos en contacto contigo por WhatsApp para confirmar el lugar y hora exactos.
        </p>
      </div>
      `}

      <p style="font-family:Arial,sans-serif;font-size:14px;color:#2C1810;line-height:1.7;">
        Si tienes cualquier pregunta escríbenos a
        <a href="mailto:info@masbesaura.com" style="color:#4A6741;">info@masbesaura.com</a>
        o llámanos al <a href="tel:+34665822542" style="color:#4A6741;">+34 665 822 542</a>.
      </p>
      <p style="font-size:18px;color:#2C1810;text-align:center;margin-top:28px;">¡Hasta pronto! 🌿</p>
    </div>
    <div style="padding:24px 32px;background:#F0EAD6;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#2C1810;">
      <strong>Mas Besaura</strong><br>
      <a href="mailto:info@masbesaura.com" style="color:#4A6741;">info@masbesaura.com</a> · +34 665 822 542<br>
      Collsacabra · Girona
    </div>
  </div>
</body>
</html>`;

  await Promise.all([
    resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_TO,
      subject: `✅ ${label}: ${ra.nombre_cliente} · ${fechasStr} · ${personas} pers.`,
      html: htmlAdmin,
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: ra.email_cliente,
      subject: `¡Tu reserva en Mas Besaura está confirmada! 🌿`,
      html: htmlCliente,
    }),
  ]);

  console.log(`[webhook] ReservaActividad ${reserva_actividad_id} CONFIRMADA · tipo=${ra.tipo} · ${personas} personas`);

  // Block the matching session so the date becomes unavailable for new bookings
  if (ra.actividad_id && ra.fecha_inicio) {
    const dayStart = new Date(ra.fecha_inicio);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    prisma.sesionActividad.updateMany({
      where: {
        actividad_id: ra.actividad_id,
        activa: true,
        fecha: { gte: dayStart, lt: dayEnd },
      },
      data: { activa: false },
    }).catch((e) => console.error("[webhook] bloquear sesión:", e));
  }
}
