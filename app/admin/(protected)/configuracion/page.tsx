import {
  adminGetHabitaciones,
  adminGetComplementos,
  adminGetSistemaConfig,
} from "@/app/actions/admin";
import { getStoredRefreshToken } from "@/lib/googleCalendar";
import { prisma } from "@/lib/prisma";
import ConfigClient from "./ConfigClient";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ gcal?: string; msg?: string }>;
}) {
  const params = await searchParams;
  const [habitaciones, complementos, refreshToken, pixelConfig, espaciosCfgs] = await Promise.all([
    adminGetHabitaciones(),
    adminGetComplementos(),
    getStoredRefreshToken(),
    adminGetSistemaConfig("fb_pixel_id"),
    prisma.sistemaConfig.findMany({
      where: { clave: { in: ["espacio_salon_img","espacio_habs_img","espacio_sala_img","cabanya_foto_1","cabanya_foto_2"] } },
    }),
  ]);
  const cfg = Object.fromEntries(espaciosCfgs.map(c => [c.clave, c.valor]));

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
      espaciosInicial={{
        salonImg: cfg["espacio_salon_img"] ?? "",
        habsImg:  cfg["espacio_habs_img"]  ?? "",
        salaImg:  cfg["espacio_sala_img"]  ?? "",
      }}
      cabanyaInicial={{
        foto1: cfg["cabanya_foto_1"] ?? "",
        foto2: cfg["cabanya_foto_2"] ?? "",
      }}
    />
  );
}
