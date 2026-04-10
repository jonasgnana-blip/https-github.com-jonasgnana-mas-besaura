import {
  adminGetHabitaciones,
  adminGetComplementos,
} from "@/app/actions/admin";
import { getStoredRefreshToken } from "@/lib/googleCalendar";
import ConfigClient from "./ConfigClient";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ gcal?: string; msg?: string }>;
}) {
  const params = await searchParams;
  const [habitaciones, complementos, refreshToken] = await Promise.all([
    adminGetHabitaciones(),
    adminGetComplementos(),
    getStoredRefreshToken(),
  ]);

  return (
    <ConfigClient
      habitaciones={habitaciones.map((h) => ({
        id: h.id,
        nombre: h.nombre,
        descripcion: h.descripcion,
        precio_noche: Number(h.precio_noche),
        capacidad: h.capacidad,
      }))}
      complementos={complementos.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        descripcion: c.descripcion,
        precio: Number(c.precio),
        tipo_cobro: c.tipo_cobro,
        activo: c.activo,
      }))}
      gcalConnected={!!refreshToken}
      gcalStatus={params.gcal}
    />
  );
}
