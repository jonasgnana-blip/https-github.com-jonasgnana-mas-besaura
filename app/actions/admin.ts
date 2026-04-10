"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { EstadoReserva } from "@/app/generated/prisma/client";

// ── Auth guard ────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    throw new Error("No autorizado");
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function adminGetStats() {
  await requireAdmin();

  const [total, confirmadas, pendientes, ingresos, proximas] = await Promise.all([
    prisma.reserva.count(),
    prisma.reserva.count({ where: { estado: EstadoReserva.CONFIRMADA } }),
    prisma.reserva.count({ where: { estado: EstadoReserva.PENDIENTE_PAGO } }),
    prisma.reserva.aggregate({
      where: { estado: EstadoReserva.CONFIRMADA },
      _sum: { precio_total: true },
    }),
    prisma.reserva.findMany({
      where: {
        estado: EstadoReserva.CONFIRMADA,
        fecha_entrada: { gte: new Date() },
      },
      orderBy: { fecha_entrada: "asc" },
      take: 5,
      select: {
        id: true,
        nombre_cliente: true,
        fecha_entrada: true,
        fecha_salida: true,
        precio_total: true,
      },
    }),
  ]);

  return {
    total,
    confirmadas,
    pendientes,
    ingresos: Number(ingresos._sum.precio_total ?? 0),
    proximas,
  };
}

// ── Reservas ──────────────────────────────────────────────────────────────────

export async function adminGetReservas(filtro?: EstadoReserva | "TODAS") {
  await requireAdmin();

  return prisma.reserva.findMany({
    where: filtro && filtro !== "TODAS" ? { estado: filtro } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      habitacion: { select: { nombre: true } },
      complementos: {
        include: { complemento: { select: { nombre: true } } },
      },
    },
  });
}

export async function adminUpdateReservaEstado(
  id: string,
  estado: EstadoReserva
) {
  await requireAdmin();

  return prisma.reserva.update({
    where: { id },
    data: { estado },
  });
}

// ── Bloqueos manuales ─────────────────────────────────────────────────────────

export async function adminGetBloqueos() {
  await requireAdmin();

  return prisma.bloqueoManual.findMany({
    orderBy: { fecha_inicio: "asc" },
    include: { habitacion: { select: { nombre: true } } },
  });
}

export async function adminCreateBloqueo(data: {
  habitacion_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo?: string;
}) {
  await requireAdmin();

  return prisma.bloqueoManual.create({
    data: {
      habitacion_id: data.habitacion_id,
      fecha_inicio: new Date(data.fecha_inicio),
      fecha_fin: new Date(data.fecha_fin),
      motivo: data.motivo ?? null,
    },
  });
}

export async function adminDeleteBloqueo(id: string) {
  await requireAdmin();
  return prisma.bloqueoManual.delete({ where: { id } });
}

// ── Habitaciones / precios ────────────────────────────────────────────────────

export async function adminGetHabitaciones() {
  await requireAdmin();
  return prisma.habitacion.findMany({ orderBy: { nombre: "asc" } });
}

export async function adminUpdateHabitacion(
  id: string,
  data: { nombre?: string; precio_noche?: number; capacidad?: number; descripcion?: string }
) {
  await requireAdmin();
  return prisma.habitacion.update({ where: { id }, data });
}

// ── Complementos ──────────────────────────────────────────────────────────────

export async function adminGetComplementos() {
  await requireAdmin();
  return prisma.complemento.findMany({ orderBy: { nombre: "asc" } });
}

export async function adminUpdateComplemento(
  id: string,
  data: { nombre?: string; precio?: number; activo?: boolean; descripcion?: string }
) {
  await requireAdmin();
  return prisma.complemento.update({ where: { id }, data });
}
