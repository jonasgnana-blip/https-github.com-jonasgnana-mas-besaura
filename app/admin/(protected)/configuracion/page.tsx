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
  const [habitacionesAll, complementos, refreshToken, pixelConfig, espaciosCfgs] = await Promise.all([
    adminGetHabitaciones(),
    adminGetComplementos(),
    getStoredRefreshToken(),
    adminGetSistemaConfig("fb_pixel_id"),
    prisma.sistemaConfig.findMany({
      where: {
        clave: {
          in: [
            "espacio_salon_img","espacio_habs_img","espacio_sala_img",
            "espacio_salon_nombre","espacio_habs_nombre","espacio_sala_nombre",
            "cabanya_foto_1","cabanya_foto_2",
            "slider_foto_1","slider_foto_2","slider_foto_3","slider_foto_4","slider_foto_5",
            "estancia_texto_es","estancia_texto_ca",
          ],
        },
      },
    }),
  ]);
  const habitaciones = habitacionesAll.slice(0, 3);
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
      gcalMsg={params.msg}
      fbPixelIdInicial={pixelConfig?.valor ?? ""}
      espaciosInicial={{
        salonImg:     cfg["espacio_salon_img"]    ?? "",
        habsImg:      cfg["espacio_habs_img"]     ?? "",
        salaImg:      cfg["espacio_sala_img"]     ?? "",
        salonNombre:  cfg["espacio_salon_nombre"] ?? "",
        habsNombre:   cfg["espacio_habs_nombre"]  ?? "",
        salaNombre:   cfg["espacio_sala_nombre"]  ?? "",
      }}
      cabanyaInicial={{
        foto1: cfg["cabanya_foto_1"] ?? "",
        foto2: cfg["cabanya_foto_2"] ?? "",
      }}
      sliderInicial={{
        foto1: cfg["slider_foto_1"] ?? "",
        foto2: cfg["slider_foto_2"] ?? "",
        foto3: cfg["slider_foto_3"] ?? "",
        foto4: cfg["slider_foto_4"] ?? "",
        foto5: cfg["slider_foto_5"] ?? "",
      }}
      estanciaTextoEsInicial={cfg["estancia_texto_es"] ?? ""}
      estanciaTextoCaInicial={cfg["estancia_texto_ca"] ?? ""}
    />
  );
}
