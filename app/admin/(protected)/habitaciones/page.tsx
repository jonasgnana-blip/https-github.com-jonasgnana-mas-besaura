import { prisma } from "@/lib/prisma";
import HabitacionesClient from "./HabitacionesClient";

export const dynamic = "force-dynamic";

export default async function AdminHabitacionesPage() {
  const habitaciones = await prisma.habitacion.findMany({
    where: { id: { in: ["artemisa", "selene", "hecate"] } },
    orderBy: { nombre: "asc" },
    select: {
      id: true, nombre: true, descripcion: true,
      precio_noche: true, capacidad: true,
      precio_desayuno: true, precio_media_pension: true,
      imagenes: true, activa: true,
    },
  });

  return (
    <HabitacionesClient
      habitaciones={habitaciones.map(h => ({
        id: h.id,
        nombre: h.nombre,
        descripcion: h.descripcion,
        precio_noche: Number(h.precio_noche),
        capacidad: h.capacidad,
        precio_desayuno: h.precio_desayuno != null ? Number(h.precio_desayuno) : null,
        precio_media_pension: h.precio_media_pension != null ? Number(h.precio_media_pension) : null,
        imagenes: h.imagenes,
        activa: h.activa,
      }))}
    />
  );
}
