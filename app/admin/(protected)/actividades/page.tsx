import { adminGetActividades } from "@/app/actions/admin";
import ActividadesClient from "./ActividadesClient";

export const dynamic = "force-dynamic";

type RawSesion = {
  id: string;
  actividad_id: string;
  fecha: Date;
  hora: string | null;
  plazas_max: number | null;
  activa: boolean;
  createdAt: Date;
};

type RawActividad = {
  id: string;
  titulo: string;
  descripcion: string;
  facilitador: string | null;
  precio_base: { toString(): string } | number;
  precio_extra: { toString(): string } | number | null;
  max_personas: number | null;
  duracion: string | null;
  imagen_url: string | null;
  activa: boolean;
  createdAt: Date;
  sesiones: RawSesion[];
};

export default async function ActividadesPage() {
  const actividades = (await adminGetActividades()) as RawActividad[];

  // Serialize Decimal and Date fields for the client component
  const serialized = actividades.map((a: RawActividad) => ({
    id: a.id,
    titulo: a.titulo,
    descripcion: a.descripcion,
    facilitador: a.facilitador ?? null,
    precio_base: Number(a.precio_base),
    precio_extra: a.precio_extra !== null ? Number(a.precio_extra) : null,
    max_personas: a.max_personas ?? null,
    duracion: a.duracion ?? null,
    imagen_url: a.imagen_url ?? null,
    activa: a.activa,
    createdAt: a.createdAt.toISOString(),
    sesiones: a.sesiones.map((s: RawSesion) => ({
      id: s.id,
      actividad_id: s.actividad_id,
      fecha: s.fecha.toISOString(),
      hora: s.hora ?? null,
      plazas_max: s.plazas_max ?? null,
      activa: s.activa,
      createdAt: s.createdAt.toISOString(),
    })),
  }));

  return (
    <div>
      <ActividadesClient actividades={serialized} />
    </div>
  );
}
