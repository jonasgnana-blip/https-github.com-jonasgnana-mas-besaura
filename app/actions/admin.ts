"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { EstadoReserva } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";

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
  data: {
    nombre?: string;
    precio_noche?: number;
    capacidad?: number;
    descripcion?: string;
    precio_desayuno?: number;
    precio_media_pension?: number;
    imagenes?: string[];
  }
) {
  await requireAdmin();
  const result = await prisma.habitacion.update({ where: { id }, data });
  revalidatePath("/la-casa");
  revalidatePath("/alojamiento");
  revalidatePath("/reservar");
  revalidatePath("/");
  return result;
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

// ── Actividades ───────────────────────────────────────────────────────────────

export async function adminGetActividades() {
  await requireAdmin();
  return prisma.actividad.findMany({
    orderBy: { createdAt: "desc" },
    include: { sesiones: { orderBy: { fecha: "asc" } } },
  });
}

export async function adminBloquearFechaActividad(actividadId: string, fecha: string) {
  await requireAdmin();
  // Create a sesion with activa: false to block that date
  return prisma.sesionActividad.create({
    data: {
      actividad_id: actividadId,
      fecha: new Date(fecha),
      activa: false,
    },
  });
}

export async function adminDesbloquearFechaActividad(sesionId: string) {
  await requireAdmin();
  return prisma.sesionActividad.delete({ where: { id: sesionId } });
}

export async function adminCreateActividad(data: {
  titulo: string;
  descripcion: string;
  facilitador?: string;
  precio_base: number;
  precio_extra?: number;
  max_personas?: number;
  duracion?: string;
  imagen_url?: string;
  tipo_reserva?: string;
  categoria?: string;
  precio_texto?: string;
  orden?: number;
}) {
  await requireAdmin();
  const result = await prisma.actividad.create({ data });
  revalidatePath("/actividades");
  revalidatePath("/");
  return result;
}

export async function adminUpdateActividad(id: string, data: Partial<{
  titulo: string;
  descripcion: string;
  facilitador: string;
  precio_base: number;
  precio_extra: number;
  max_personas: number;
  duracion: string;
  imagen_url: string;
  activa: boolean;
  tipo_reserva: string;
  categoria: string;
  precio_texto: string;
  orden: number;
}>) {
  await requireAdmin();
  const result = await prisma.actividad.update({ where: { id }, data });
  revalidatePath("/actividades");
  revalidatePath("/");
  return result;
}

export async function adminDeleteActividad(id: string) {
  await requireAdmin();
  const result = await prisma.actividad.delete({ where: { id } });
  revalidatePath("/actividades");
  revalidatePath("/");
  return result;
}

export async function adminGetSesiones(actividadId: string) {
  await requireAdmin();
  return prisma.sesionActividad.findMany({
    where: { actividad_id: actividadId },
    orderBy: { fecha: "asc" },
  });
}

export async function adminCreateSesion(data: {
  actividad_id: string;
  fecha: string;
  hora?: string;
  plazas_max?: number;
}) {
  await requireAdmin();
  return prisma.sesionActividad.create({
    data: {
      actividad_id: data.actividad_id,
      fecha: new Date(data.fecha),
      hora: data.hora,
      plazas_max: data.plazas_max,
    },
  });
}

export async function adminDeleteSesion(id: string) {
  await requireAdmin();
  return prisma.sesionActividad.delete({ where: { id } });
}

// ── Sistema Config ─────────────────────────────────────────────────────────────

export async function adminGetSistemaConfig(clave: string) {
  await requireAdmin();
  return prisma.sistemaConfig.findUnique({ where: { clave } });
}

export async function adminUpsertSistemaConfig(clave: string, valor: string) {
  await requireAdmin();
  const result = await prisma.sistemaConfig.upsert({
    where: { clave },
    update: { valor },
    create: { clave, valor },
  });
  // Revalidate all pages that read SistemaConfig
  revalidatePath("/la-casa");
  revalidatePath("/estancia");
  revalidatePath("/");
  return result;
}
