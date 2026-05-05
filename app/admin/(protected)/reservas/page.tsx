import { adminGetReservas, adminGetReservasActividades } from "@/app/actions/admin";
import ReservasClient from "./ReservasClient";

export const dynamic = "force-dynamic";

export default async function AdminReservasPage() {
  const [reservas, actividades] = await Promise.all([
    adminGetReservas("TODAS"),
    adminGetReservasActividades("TODAS"),
  ]);

  const serReservas = reservas.map((r) => ({
    id: r.id,
    source: "alojamiento" as const,
    nombre_cliente: r.nombre_cliente,
    email_cliente: r.email_cliente,
    telefono_cliente: r.telefono_cliente,
    fecha_entrada: r.fecha_entrada.toISOString().split("T")[0],
    fecha_salida: r.fecha_salida.toISOString().split("T")[0],
    estado: r.estado,
    precio_total: Number(r.precio_total),
    createdAt: r.createdAt.toISOString(),
    habitacion: r.habitacion.nombre,
    complementos: r.complementos.map((c) => ({
      nombre: c.complemento.nombre,
      precio: Number(c.precio_aplicado),
    })),
  }));

  const serActividades = actividades.map((a) => ({
    id: a.id,
    source: "actividad" as const,
    nombre_cliente: a.nombre_cliente,
    email_cliente: a.email_cliente,
    telefono_cliente: a.telefono_cliente,
    fecha_entrada: a.fecha_inicio ? a.fecha_inicio.toISOString().split("T")[0] : null,
    estado: a.estado,
    precio_total: Number(a.precio_total),
    createdAt: a.createdAt.toISOString(),
    actividad_nombre: a.actividad_nombre ?? a.tipo ?? "Actividad",
    num_adultos: a.num_adultos,
    tipo: a.tipo,
  }));

  return <ReservasClient reservas={serReservas} actividades={serActividades} />;
}
