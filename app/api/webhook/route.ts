import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { renderEmailAdmin } from "@/lib/emails/email-admin";
import { renderEmailCliente } from "@/lib/emails/email-cliente";
import { createCalendarEvent } from "@/lib/googleCalendar";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Sin firma de Stripe" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook] firma inválida:", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reserva_id = session.metadata?.reserva_id;

    if (!reserva_id) {
      console.error("[webhook] Sin reserva_id en metadata");
      return NextResponse.json({ error: "Sin reserva_id" }, { status: 400 });
    }

    // Confirmar reserva en DB
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

    // Crear evento en Google Calendar (no bloquea si falla)
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

    // Enviar emails en paralelo
    await Promise.all([
      resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: process.env.EMAIL_ADMIN!,
        subject: `Nueva reserva: ${reserva.nombre_cliente} · ${fechaEntrada}`,
        html: renderEmailAdmin({
          ...emailProps,
          email_cliente: reserva.email_cliente,
          telefono_cliente: reserva.telefono_cliente,
        }),
      }),
      resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: reserva.email_cliente,
        subject: `¡Tu reserva en Mas Besaura está confirmada! 🌿`,
        html: renderEmailCliente(emailProps),
      }),
    ]);

    console.log(`[webhook] Reserva ${reserva_id} CONFIRMADA · emails enviados`);
  }

  return NextResponse.json({ received: true });
}
