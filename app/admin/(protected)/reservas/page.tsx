import { adminGetReservas } from "@/app/actions/admin";
import { EstadoReserva } from "@/app/generated/prisma/client";
import ReservasClient from "./ReservasClient";

export const dynamic = "force-dynamic";

export default async function AdminReservasPage() {
  const reservas = await adminGetReservas("TODAS");

  const serialized = reservas.map((r) => ({
    ...r,
    fecha_entrada: r.fecha_entrada.toISOString().split("T")[0],
    fecha_salida: r.fecha_salida.toISOString().split("T")[0],
    createdAt: r.createdAt.toISOString(),
    precio_total: Number(r.precio_total),
    complementos: r.complementos.map((c) => ({
      nombre: c.complemento.nombre,
      precio: Number(c.precio_aplicado),
    })),
    habitacion: r.habitacion.nombre,
  }));

  return <ReservasClient reservas={serialized} />;
}
