import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import AlojamientoCliente from "./AlojamientoCliente";
import { getComplementos, getUnavailableDates } from "@/app/actions/reservas";
import { prisma } from "@/lib/prisma";
import { SiteContentProvider } from "@/lib/SiteContentContext";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alojamiento — Habitaciones con Encanto",
  description:
    "Tres habitaciones únicas entre bosques y ríos en Mas Besaura, Vidrà (Girona). Alojamiento con desayuno o media pensión. La Cabanya: sala exterior de 350 m² para grupos y retiros.",
  keywords: [
    "alojamiento rural Girona", "habitaciones casa rural", "Mas Besaura habitaciones",
    "alojamiento Vidrà", "hospedaje Ripollès", "La Cabanya alquiler",
  ],
  alternates: { canonical: "https://masbesaura.com/alojamiento" },
  openGraph: {
    title: "Alojamiento — Mas Besaura, Vidrà",
    description:
      "Tres habitaciones únicas en plena naturaleza. Desayuno o media pensión incluidos. La Cabanya: 350 m² para grupos.",
    url: "https://masbesaura.com/alojamiento",
    images: [
      { url: "https://masbesaura.com/images/hero3.jpg", width: 1200, height: 630, alt: "Habitaciones Mas Besaura" },
    ],
  },
};

const ALOJ_KEYS = [
  "page_aloj_hero_subtitle_es","page_aloj_hero_subtitle_ca",
  "page_aloj_rooms_title_es","page_aloj_rooms_title_ca",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Mas Besaura — Alojamiento",
  url: "https://masbesaura.com/alojamiento",
  image: "https://masbesaura.com/images/hero3.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vidrà",
    addressRegion: "Girona",
    addressCountry: "ES",
  },
  containsPlace: [
    {
      "@type": "HotelRoom",
      name: "Artemisa",
      description: "2 camas individuales y una cama doble, con baño. Estufa de pellets. Orientación este.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 4 },
    },
    {
      "@type": "HotelRoom",
      name: "Selene",
      description: "Habitación con altillo. 2 camas individuales abajo, 2 arriba. Estufa de pellets. Orientación norte.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 4 },
    },
    {
      "@type": "HotelRoom",
      name: "Hécate",
      description: "2 camas individuales y una cama doble. Estufa de pellets. Orientación oeste.",
      occupancy: { "@type": "QuantitativeValue", maxValue: 4 },
    },
  ],
};

export default async function AlojamientoPage() {
  const [compls, datesArtemisa, datesSelene, datesHecate, datesCabanya, habitacionesDB, pageRows] =
    await Promise.all([
      getComplementos(),
      getUnavailableDates("artemisa"),
      getUnavailableDates("selene"),
      getUnavailableDates("hecate"),
      getUnavailableDates("la-cabanya"),
      prisma.habitacion.findMany({
        where: { id: { in: ["artemisa", "selene", "hecate"] }, activa: true },
        select: { id: true, nombre: true, descripcion: true, capacidad: true, imagenes: true, precio_desayuno: true, precio_media_pension: true },
      }),
      prisma.sistemaConfig.findMany({ where: { clave: { in: ALOJ_KEYS } } }),
    ]);
  const pageContent = Object.fromEntries(pageRows.map((r) => [r.clave, r.valor]));

  return (
    <SiteContentProvider content={pageContent}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
    </SiteContentProvider>
  );
}
