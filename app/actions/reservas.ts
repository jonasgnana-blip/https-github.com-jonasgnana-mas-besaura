"use server";

import { prisma } from "@/lib/prisma";
import { EstadoReserva } from "@/app/generated/prisma/client";

// ── Tipos exportados ──────────────────────────────────────────────────────────

export type DateRange = { entrada: string; salida: string };

export type CreateReservaInput = {
  habitacion_id: string;
  fecha_entrada: string; // ISO: "2026-05-01"
  fecha_salida: string;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  complemento_ids: string[];
};

export type CreateReservaResult =
  | { ok: true; reserva_id: string; precio_total: number }
  | { ok: false; error: string };

// ── getComplementos ───────────────────────────────────────────────────────────

export async function getComplementos() {
  return prisma.complemento.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
  });
}

// ── getUnavailableDates ───────────────────────────────────────────────────────
// Devuelve rangos de fechas ocupadas (CONFIRMADA o PENDIENTE_PAGO no expirado)

export async function getUnavailableDates(
  habitacion_id: string
): Promise<DateRange[]> {
  const now = new Date();

  const [reservas, bloqueos] = await Promise.all([
    prisma.reserva.findMany({
      where: {
        habitacion_id,
        OR: [
          { estado: EstadoReserva.CONFIRMADA },
          {
            estado: EstadoReserva.PENDIENTE_PAGO,
            OR: [{ expira_en: null }, { expira_en: { gt: now } }],
          },
        ],
      },
      select: { fecha_entrada: true, fecha_salida: true },
    }),
    prisma.bloqueoManual.findMany({
      where: { habitacion_id },
      select: { fecha_inicio: true, fecha_fin: true },
    }),
  ]);

  return [
    ...reservas.map((r) => ({
      entrada: r.fecha_entrada.toISOString().split("T")[0],
      salida: r.fecha_salida.toISOString().split("T")[0],
    })),
    ...bloqueos.map((b) => ({
      entrada: b.fecha_inicio.toISOString().split("T")[0],
      salida: b.fecha_fin.toISOString().split("T")[0],
    })),
  ];
}

// ── createReserva ─────────────────────────────────────────────────────────────

export async function createReserva(
  input: CreateReservaInput
): Promise<CreateReservaResult> {
  const { habitacion_id, fecha_entrada, fecha_salida, complemento_ids } = input;

  const entrada = new Date(fecha_entrada);
  const salida = new Date(fecha_salida);
  const noches = Math.round(
    (salida.getTime() - entrada.getTime()) / 86400000
  );

  if (noches <= 0) return { ok: false, error: "Fechas inválidas." };

  // Verificar disponibilidad (anti-overbooking)
  const now = new Date();
  const conflicto = await prisma.reserva.findFirst({
    where: {
      habitacion_id,
      OR: [
        { estado: EstadoReserva.CONFIRMADA },
        {
          estado: EstadoReserva.PENDIENTE_PAGO,
          OR: [{ expira_en: null }, { expira_en: { gt: now } }],
        },
      ],
      AND: [
        { fecha_entrada: { lt: salida } },
        { fecha_salida: { gt: entrada } },
      ],
    },
  });

  if (conflicto) {
    return {
      ok: false,
      error: "Esas fechas ya no están disponibles. Por favor elige otras.",
    };
  }

  // Obtener habitación y complementos
  const habitacion = await prisma.habitacion.findUnique({
    where: { id: habitacion_id },
  });
  if (!habitacion) return { ok: false, error: "Habitación no encontrada." };

  const complementos =
    complemento_ids.length > 0
      ? await prisma.complemento.findMany({
          where: { id: { in: complemento_ids } },
        })
      : [];

  // Calcular precio total
  let precio_total = Number(habitacion.precio_noche) * noches;
  for (const c of complementos) {
    precio_total +=
      c.tipo_cobro === "POR_NOCHE"
        ? Number(c.precio) * noches
        : Number(c.precio);
  }

  // Crear reserva en PENDIENTE_PAGO con expiración a 15 min
  const expira_en = new Date(Date.now() + 15 * 60 * 1000);

  const reserva = await prisma.reserva.create({
    data: {
      habitacion_id,
      fecha_entrada: entrada,
      fecha_salida: salida,
      estado: EstadoReserva.PENDIENTE_PAGO,
      precio_total,
      nombre_cliente: input.nombre_cliente,
      email_cliente: input.email_cliente,
      telefono_cliente: input.telefono_cliente,
      expira_en,
      complementos: {
        create: complementos.map((c) => ({
          complemento_id: c.id,
          precio_aplicado:
            c.tipo_cobro === "POR_NOCHE"
              ? Number(c.precio) * noches
              : Number(c.precio),
        })),
      },
    },
  });

  return { ok: true, reserva_id: reserva.id, precio_total };
}

// ── getBlockedDatesActividad ──────────────────────────────────────────────────
// Devuelve las fechas bloqueadas de una actividad (sesiones con activa: false)
// en formato DateRange (un solo día: entrada = fecha, salida = fecha+1)

export async function getBlockedDatesActividad(
  actividad_id: string
): Promise<DateRange[]> {
  const sesiones = await prisma.sesionActividad.findMany({
    where: { actividad_id, activa: false },
    select: { fecha: true },
  });

  return sesiones.map((s) => {
    const d = new Date(s.fecha);
    const entrada = d.toISOString().split("T")[0];
    // Advance one day so isUnavailable range check (>= entrada && < salida) covers the day
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const salida = next.toISOString().split("T")[0];
    return { entrada, salida };
  });
}
