import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import AlojamientoCliente from "./AlojamientoCliente";
import { getComplementos, getUnavailableDates } from "@/app/actions/reservas";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alojamiento",
  description:
    "Tres habitaciones únicas entre bosques y ríos en Mas Besaura, Vidrà (Girona). Alojamiento con desayuno o media pensión. La Cabanya: sala de 350 m² para grupos.",
};

export default async function AlojamientoPage() {
  const [compls, datesArtemisa, datesSelene, datesHecate, datesCabanya, habitacionesDB] =
    await Promise.all([
      getComplementos(),
      getUnavailableDates("artemisa"),
      getUnavailableDates("selene"),
      getUnavailableDates("hecate"),
      getUnavailableDates("la-cabanya"),
      prisma.habitacion.findMany({
        orderBy: { nombre: "asc" },
        take: 3,
        select: { id: true, nombre: true, descripcion: true, capacidad: true, imagenes: true, precio_desayuno: true, precio_media_pension: true },
      }),
    ]);

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />
      <AlojamientoCliente
        complementos={compls}
        datesArtemisa={datesArtemisa}
        datesSelene={datesSelene}
        datesHecate={datesHecate}
        datesCabanya={datesCabanya}
        habitaciones={habitacionesDB.map((h) => ({
          id: h.id,
          nombre: h.nombre ?? undefined,
          descripcion: h.descripcion ?? undefined,
          capacidad: h.capacidad ?? undefined,
          imagen: h.imagenes?.[0] ?? undefined,
          precio_desayuno: h.precio_desayuno != null ? Number(h.precio_desayuno) : null,
          precio_media_pension: h.precio_media_pension != null ? Number(h.precio_media_pension) : null,
        }))}
      />
    </div>
  );
}
