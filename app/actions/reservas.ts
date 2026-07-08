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
  num_adultos?: number;
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

// ── validateCodigoDescuento ───────────────────────────────────────────────────
// Public — no auth required. Returns validated discount info or an error.

export type DescuentoResult =
  | { ok: true; tipo: "porcentaje" | "fijo"; valor: number; descripcion: string | null }
  | { ok: false; error: string };

export async function validateCodigoDescuento(raw: string): Promise<DescuentoResult> {
  const codigo = raw.trim().toUpperCase();
  if (!codigo) return { ok: false, error: "Introduce un código" };

  const code = await prisma.codigoDescuento.findUnique({ where: { codigo } });

  if (!code)                                          return { ok: false, error: "Código no válido" };
  if (!code.activo)                                   return { ok: false, error: "Código desactivado" };
  if (code.expira_en && code.expira_en < new Date())  return { ok: false, error: "Código expirado" };
  if (code.usos_max !== null && code.usos_actual >= code.usos_max)
                                                      return { ok: false, error: "Código agotado" };

  return {
    ok: true,
    tipo: code.tipo as "porcentaje" | "fijo",
    valor: Number(code.valor),
    descripcion: code.descripcion,
  };
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

  if (noches < 2) return { ok: false, error: "La estancia mínima es de 2 noches." };

  // Obtener habitación y complementos antes de la transacción
  const [habitacion, complementos] = await Promise.all([
    prisma.habitacion.findUnique({ where: { id: habitacion_id } }),
    complemento_ids.length > 0
      ? prisma.complemento.findMany({ where: { id: { in: complemento_ids } } })
      : Promise.resolve([]),
  ]);
  if (!habitacion) return { ok: false, error: "Habitación no encontrada." };

  // Calcular precio total
  let precio_total = Number(habitacion.precio_noche) * noches;
  for (const c of complementos) {
    precio_total +=
      c.tipo_cobro === "POR_NOCHE"
        ? Number(c.precio) * noches
        : Number(c.precio);
  }

  const expira_en = new Date(Date.now() + 15 * 60 * 1000);

  // Atomic check + create: the findFirst and create run inside a single
  // serializable transaction so two simultaneous requests for the same
  // dates cannot both pass the availability check.
  try {
    const reserva = await prisma.$transaction(async (tx) => {
      const now = new Date();
      const conflicto = await tx.reserva.findFirst({
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

      if (conflicto) throw new Error("CONFLICT");

      return tx.reserva.create({
        data: {
          habitacion_id,
          fecha_entrada: entrada,
          fecha_salida: salida,
          estado: EstadoReserva.PENDIENTE_PAGO,
          precio_total,
          nombre_cliente: input.nombre_cliente,
          email_cliente: input.email_cliente,
          telefono_cliente: input.telefono_cliente,
          num_adultos: input.num_adultos ?? 1,
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
    });

    return { ok: true, reserva_id: reserva.id, precio_total };
  } catch (err) {
    if (err instanceof Error && err.message === "CONFLICT") {
      return { ok: false, error: "Esas fechas ya no están disponibles. Por favor elige otras." };
    }
    throw err;
  }
}

// ── getActiveSesionesActividad ────────────────────────────────────────────────
// Returns YYYY-MM-DD strings for sessions that are active (bookable).
// Used to whitelist selectable dates in the calendar for "con_fecha" activities.

export async function getActiveSesionesActividad(actividad_id: string): Promise<string[]> {
  const sesiones = await prisma.sesionActividad.findMany({
    where: { actividad_id, activa: true },
    select: { fecha: true },
    orderBy: { fecha: "asc" },
  });
  return sesiones.map((s) => s.fecha.toISOString().split("T")[0]);
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

// ── getUnavailableDatesCabanya ────────────────────────────────────────────────
// Combina: reservas confirmadas/pendientes de tipo cabanya + sesiones bloqueadas
// (activa: false) de la actividad. Así el calendario de La Cabanya refleja
// tanto bloqueos manuales del admin como reservas pagadas.

export async function getUnavailableDatesCabanya(
  actividad_id: string
): Promise<DateRange[]> {
  const now = new Date();

  const [reservas, sesionesBlockeadas, bloqueosManual] = await Promise.all([
    prisma.reservaActividad.findMany({
      where: {
        tipo: "cabanya",
        OR: [
          { estado: EstadoReserva.CONFIRMADA },
          {
            estado: EstadoReserva.PENDIENTE_PAGO,
            createdAt: { gt: new Date(now.getTime() - 30 * 60 * 1000) },
          },
        ],
        fecha_inicio: { not: null },
        fecha_fin: { not: null },
      },
      select: { fecha_inicio: true, fecha_fin: true },
    }),
    prisma.sesionActividad.findMany({
      where: { actividad_id, activa: false },
      select: { fecha: true },
    }),
    // La Cabanya is a real Habitacion (id="la-cabanya") so BloqueoManual works
    prisma.bloqueoManual.findMany({
      where: { habitacion_id: "la-cabanya" },
      select: { fecha_inicio: true, fecha_fin: true },
    }),
  ]);

  const reservaRanges: DateRange[] = reservas
    .filter((r) => r.fecha_inicio && r.fecha_fin)
    .map((r) => ({
      entrada: r.fecha_inicio!.toISOString().split("T")[0],
      salida: r.fecha_fin!.toISOString().split("T")[0],
    }));

  const blockedDays: DateRange[] = sesionesBlockeadas.map((s) => {
    const d = new Date(s.fecha);
    const entrada = d.toISOString().split("T")[0];
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return { entrada, salida: next.toISOString().split("T")[0] };
  });

  const manualRanges: DateRange[] = bloqueosManual.map((b) => ({
    entrada: b.fecha_inicio.toISOString().split("T")[0],
    salida: b.fecha_fin.toISOString().split("T")[0],
  }));

  return [...reservaRanges, ...blockedDays, ...manualRanges];
}
