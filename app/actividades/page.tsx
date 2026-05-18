import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import { ActividadReserva, ComidaCaseraReserva } from "./ActividadCard";
import { getBlockedDatesActividad, getUnavailableDatesCabanya } from "@/app/actions/reservas";
import type { DateRange } from "@/app/actions/reservas";
import { prisma } from "@/lib/prisma";
import ActividadesHero from "./ActividadesHero";
import ActividadesFooter from "./ActividadesFooter";
import ShareButtons from "@/app/components/ShareButtons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actividades — Experiencias en la Naturaleza",
  description:
    "Experiencias en la naturaleza y el alma. Rutas familiares, BTT con brunch, constelaciones familiares, inmersión terapéutica y alquiler de La Cabanya en Mas Besaura, Vidrà (Girona).",
  keywords: [
    "actividades naturaleza Girona", "constelaciones familiares Girona", "BTT Ripollès",
    "rutas senderismo familia", "inmersión terapéutica", "La Cabanya alquiler Vidrà",
    "retiros terapéuticos Cataluña", "actividades bienestar Girona",
  ],
  alternates: { canonical: "https://masbesaura.com/actividades" },
  openGraph: {
    title: "Actividades — Mas Besaura, Vidrà",
    description:
      "Rutas, BTT, constelaciones familiares e inmersión terapéutica en plena naturaleza del Ripollès. Reserva tu experiencia.",
    url: "https://masbesaura.com/actividades",
    images: [
      { url: "https://masbesaura.com/images/hero4.jpg", width: 1200, height: 630, alt: "Actividades Mas Besaura" },
    ],
  },
};

/** Converts any YouTube/Vimeo URL to its embed form. Returns null if unrecognized. */
function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  // Already an embed URL
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) return url;
  // YouTube: youtu.be/ID or youtube.com/watch?v=ID
  const ytShort = url.match(/youtu\.be\/([\w-]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const ytLong = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (ytLong) return `https://www.youtube.com/embed/${ytLong[1]}`;
  // Vimeo: vimeo.com/ID
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export default async function ActividadesPage() {
  const actividades = await prisma.actividad.findMany({
    where: { activa: true },
    orderBy: { orden: "asc" },
  });

  // Fetch unavailable dates for every activity in parallel
  const blockedDatesMap: Record<string, DateRange[]> = {};
  await Promise.all(
    actividades.map(async (act) => {
      blockedDatesMap[act.id] =
        act.tipo_reserva === "cabanya"
          ? await getUnavailableDatesCabanya(act.id)
          : await getBlockedDatesActividad(act.id);
    })
  );

  // Build JSON-LD for activities (ItemList + individual TouristAttraction)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Actividades — Mas Besaura",
    description: "Experiencias en la naturaleza y el alma en Mas Besaura, Vidrà (Girona).",
    url: "https://masbesaura.com/actividades",
    itemListElement: actividades.map((act, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "TouristAttraction",
        name: act.titulo,
        description: act.descripcion,
        url: `https://masbesaura.com/actividades#${act.id}`,
        image: act.imagen_url
          ? act.imagen_url.startsWith("http")
            ? act.imagen_url
            : `https://masbesaura.com${act.imagen_url}`
          : "https://masbesaura.com/images/hero4.jpg",
        offers: {
          "@type": "Offer",
          price: String(Number(act.precio_base)),
          priceCurrency: "EUR",
          availability: act.activa
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
        },
        touristType: act.categoria ?? "Actividad natural y terapéutica",
        location: {
          "@type": "Place",
          name: "Mas Besaura",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Vidrà",
            addressRegion: "Girona",
            addressCountry: "ES",
          },
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── HERO ─── */}
      <section className="relative h-[50vh] flex items-end overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/images/hero4.jpg"
            alt="Actividades en Mas Besaura"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 via-[#2C1810]/20 to-transparent" />
        </div>
        <ActividadesHero />
      </section>

      {/* ─── ACTIVITIES GRID ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {actividades.map((act, idx) => {
            const isEven = idx % 2 === 0;
            const unavailableDates = blockedDatesMap[act.id] ?? [];
            const precio = Number(act.precio_base);

            // Unified booking block — same calendar system for every type
            const BookingBlock = () => {
              if (act.tipo_reserva === "comida") {
                // Main activity + optional comida casera addon
                return (
                  <div className="flex flex-col gap-3">
                    <ActividadReserva
                      nombre={act.titulo}
                      precio={precio}
                      descripcion={act.descripcion}
                      unavailableDates={unavailableDates}
                      tipoPago="actividad"
                      btnLabel={`${precio}€ — Actividad`}
                    />
                    <ComidaCaseraReserva />
                  </div>
                );
              }

              return (
                <ActividadReserva
                  nombre={act.titulo}
                  precio={precio}
                  descripcion={act.descripcion}
                  unavailableDates={unavailableDates}
                  tipoPago={act.tipo_reserva === "cabanya" ? "cabanya" : "actividad"}
                  sinFecha={act.tipo_reserva === "simple"}
                />
              );
            };

            const embedUrl = act.video_url ? toEmbedUrl(act.video_url) : null;

            const imageBlock = (act.imagen_url || embedUrl) ? (
              <div className={`flex flex-col gap-4 ${!isEven ? "order-1 md:order-2" : ""}`}>
                {act.imagen_url && (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={act.imagen_url}
                      alt={act.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {embedUrl && (
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <iframe
                      src={embedUrl}
                      title={`Vídeo: ${act.titulo}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            ) : null;

            const contentBlock = (
              <div className={!isEven ? "order-2 md:order-1" : ""}>
                {act.categoria && (
                  <p className="text-[#4A6741] text-xs tracking-[0.2em] uppercase font-medium mb-3">
                    {act.categoria}
                  </p>
                )}
                <h2
                  className="text-2xl md:text-3xl text-[#2C1810] mb-4"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {act.titulo}
                </h2>
                {/* Render as HTML if the description contains tags, plain text otherwise */}
                {act.descripcion.includes("<") ? (
                  <div
                    className="text-[#2C1810]/70 leading-relaxed mb-4 text-sm
                      [&_a]:text-[#4A6741] [&_a]:underline [&_a]:break-words
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                      [&_strong]:font-semibold [&_em]:italic"
                    dangerouslySetInnerHTML={{ __html: act.descripcion }}
                  />
                ) : (
                  <p className="text-[#2C1810]/70 leading-relaxed mb-4 text-sm whitespace-pre-line">
                    {act.descripcion}
                  </p>
                )}
                {act.precio_texto && (
                  <p className="text-[#2C1810]/60 text-sm mb-6">
                    <span className="font-medium text-[#2C1810]">
                      {act.precio_texto}
                    </span>
                  </p>
                )}
                <BookingBlock />
                <div className="mt-6 pt-5 border-t border-[#E8DCC8]">
                  <ShareButtons
                    url={`https://masbesaura.com/actividades#${act.id}`}
                    title={act.titulo + " — Mas Besaura"}
                  />
                </div>
              </div>
            );

            return (
              <div key={act.id} id={act.id}>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  {isEven ? (
                    <>
                      {imageBlock}
                      {contentBlock}
                    </>
                  ) : (
                    <>
                      {contentBlock}
                      {imageBlock}
                    </>
                  )}
                </div>
                {idx < actividades.length - 1 && (
                  <div className="border-t border-[#E8DCC8] mt-16" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <ActividadesFooter />
    </div>
  );
}
