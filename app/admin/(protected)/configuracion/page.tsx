import {
  adminGetComplementos,
  adminGetHabitaciones,
} from "@/app/actions/admin";
import { prisma } from "@/lib/prisma";
import ConfigClient from "./ConfigClient";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage() {
  const [complementos, habitaciones, espaciosCfgs] = await Promise.all([
    adminGetComplementos(),
    adminGetHabitaciones(),
    prisma.sistemaConfig.findMany({
      where: {
        clave: {
          in: [
            "espacio_salon_img","espacio_habs_img","espacio_sala_img",
            "espacio_salon_nombre","espacio_habs_nombre","espacio_sala_nombre",
            "cabanya_foto_1","cabanya_foto_2",
            "bosque_foto_1","bosque_foto_2","bosque_precio",
            "slider_foto_1","slider_foto_2","slider_foto_3","slider_foto_4","slider_foto_5",
            "estancia_texto_es","estancia_texto_ca",
            // Página: Inicio
            "page_home_hero_subtitle_es","page_home_hero_subtitle_ca",
            "page_home_proposito_title_es","page_home_proposito_title_ca",
            "page_home_proposito_p1_es","page_home_proposito_p1_ca",
            "page_home_proposito_p2_es","page_home_proposito_p2_ca",
            // Página: Alojamiento
            "page_aloj_hero_subtitle_es","page_aloj_hero_subtitle_ca",
            "page_aloj_rooms_title_es","page_aloj_rooms_title_ca",
            // Página: Alquiler
            "page_alquiler_hero_title_es","page_alquiler_hero_title_ca",
            "page_alquiler_hero_subtitle_es","page_alquiler_hero_subtitle_ca",
            "page_alquiler_descripcion_es","page_alquiler_descripcion_ca",
            "page_alquiler_precio_texto_es","page_alquiler_precio_texto_ca",
            "page_alquiler_politica_es","page_alquiler_politica_ca",
            "page_alquiler_incluye_es","page_alquiler_incluye_ca",
          ],
        },
      },
    }),
  ]);
  const cfg = Object.fromEntries(espaciosCfgs.map(c => [c.clave, c.valor]));

  return (
    <ConfigClient
      habitaciones={habitaciones
        .filter(h => ["artemisa", "selene", "hecate"].includes(h.id))
        .map(h => ({ id: h.id, nombre: h.nombre, activa: h.activa }))}
      complementos={complementos.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        descripcion: c.descripcion,
        precio: Number(c.precio),
        tipo_cobro: c.tipo_cobro,
        activo: c.activo,
      }))}
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
      bosqueInicial={{
        foto1: cfg["bosque_foto_1"] ?? "",
        foto2: cfg["bosque_foto_2"] ?? "",
        precio: cfg["bosque_precio"] ?? "35",
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
      paginaInicio={{
        heroSubtitleEs: cfg["page_home_hero_subtitle_es"] ?? "",
        heroSubtitleCa: cfg["page_home_hero_subtitle_ca"] ?? "",
        propositoTitleEs: cfg["page_home_proposito_title_es"] ?? "",
        propositoTitleCa: cfg["page_home_proposito_title_ca"] ?? "",
        propositoP1Es: cfg["page_home_proposito_p1_es"] ?? "",
        propositoP1Ca: cfg["page_home_proposito_p1_ca"] ?? "",
        propositoP2Es: cfg["page_home_proposito_p2_es"] ?? "",
        propositoP2Ca: cfg["page_home_proposito_p2_ca"] ?? "",
      }}
      paginaAlojamiento={{
        heroSubtitleEs: cfg["page_aloj_hero_subtitle_es"] ?? "",
        heroSubtitleCa: cfg["page_aloj_hero_subtitle_ca"] ?? "",
        roomsTitleEs: cfg["page_aloj_rooms_title_es"] ?? "",
        roomsTitleCa: cfg["page_aloj_rooms_title_ca"] ?? "",
      }}
      paginaAlquiler={{
        heroTitleEs: cfg["page_alquiler_hero_title_es"] ?? "",
        heroTitleCa: cfg["page_alquiler_hero_title_ca"] ?? "",
        heroSubtitleEs: cfg["page_alquiler_hero_subtitle_es"] ?? "",
        heroSubtitleCa: cfg["page_alquiler_hero_subtitle_ca"] ?? "",
        descripcionEs: cfg["page_alquiler_descripcion_es"] ?? "",
        descripcionCa: cfg["page_alquiler_descripcion_ca"] ?? "",
        precioTextoEs: cfg["page_alquiler_precio_texto_es"] ?? "",
        precioTextoCa: cfg["page_alquiler_precio_texto_ca"] ?? "",
        politicaEs: cfg["page_alquiler_politica_es"] ?? "",
        politicaCa: cfg["page_alquiler_politica_ca"] ?? "",
        incluyeEs: cfg["page_alquiler_incluye_es"] ?? "",
        incluyeCa: cfg["page_alquiler_incluye_ca"] ?? "",
      }}
    />
  );
}
