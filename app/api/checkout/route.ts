import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { reserva_id } = await req.json();

    if (!reserva_id) {
      return NextResponse.json({ error: "reserva_id requerido" }, { status: 400 });
    }

    // Cargar la reserva con sus datos
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
      return NextResponse.json({ error: "Esta reserva ya no está disponible" }, { status: 409 });
    }

    const noches = Math.round(
      (reserva.fecha_salida.getTime() - reserva.fecha_entrada.getTime()) / 86400000
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    // Construir line_items
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

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: reserva.email_cliente,
      locale: "es",
      metadata: {
        reserva_id: reserva.id,
      },
      success_url: `${appUrl}/reservar/exito?reserva_id=${reserva.id}`,
      cancel_url: `${appUrl}/reservar/cancelado?reserva_id=${reserva.id}`,
      payment_intent_data: {
        metadata: { reserva_id: reserva.id },
      },
    });

    // Guardar el stripe_session_id en la reserva
    await prisma.reserva.update({
      where: { id: reserva.id },
      data: { stripe_session_id: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
