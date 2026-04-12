import {
  adminGetHabitaciones,
  adminGetComplementos,
  adminGetSistemaConfig,
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
  const [habitaciones, complementos, refreshToken, pixelConfig] = await Promise.all([
    adminGetHabitaciones(),
    adminGetComplementos(),
    getStoredRefreshToken(),
    adminGetSistemaConfig("fb_pixel_id"),
  ]);

  return (
    <ConfigClient
      habitaciones={habitaciones.map((h) => ({
        id: h.id,
        nombre: h.nombre,
        descripcion: h.descripcion,
        precio_noche: Number(h.precio_noche),
        capacidad: h.capacidad,
        precio_desayuno: h.precio_desayuno != null ? Number(h.precio_desayuno) : null,
        precio_media_pension: h.precio_media_pension != null ? Number(h.precio_media_pension) : null,
        imagenes: h.imagenes,
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
      fbPixelIdInicial={pixelConfig?.valor ?? ""}
    />
  );
}
