import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NavBar from "@/app/components/NavBar";
import ImageSlider from "@/app/components/ImageSlider";
import { ActividadReserva, ComidaCaseraReserva } from "@/app/actividades/ActividadCard";
import ShareButtons from "@/app/components/ShareButtons";
import ActividadesFooter from "@/app/actividades/ActividadesFooter";
import { getBlockedDatesActividad, getUnavailableDatesCabanya } from "@/app/actions/reservas";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) return url;
  const ytShort = url.match(/youtu\.be\/([\w-]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const ytLong = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (ytLong) return `https://www.youtube.com/embed/${ytLong[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const act = await prisma.actividad.findUnique({ where: { id: params.id } });
  if (!act) return { title: "Actividad — Mas Besaura" };
  return {
    title: `${act.titulo} — Mas Besaura`,
    description: act.descripcion.replace(/<[^>]+>/g, "").slice(0, 160),
    alternates: { canonical: `https://masbesaura.com/actividades/${act.id}` },
    openGraph: {
      title: `${act.titulo} — Mas Besaura`,
      description: act.descripcion.replace(/<[^>]+>/g, "").slice(0, 160),
      url: `https://masbesaura.com/actividades/${act.id}`,
      images: act.imagen_url
        ? [{ url: act.imagen_url.startsWith("http") ? act.imagen_url : `https://masbesaura.com${act.imagen_url}`, width: 1200, height: 630, alt: act.titulo }]
        : [{ url: "https://masbesaura.com/images/hero4.jpg", width: 1200, height: 630, alt: act.titulo }],
    },
  };
}

export default async function ActividadPage({ params }: { params: { id: string } }) {
  const act = await prisma.actividad.findUnique({ where: { id: params.id, activa: true } });
  if (!act) notFound();

  const precio = Number(act.precio_base);
  const embedUrl = act.video_url ? toEmbedUrl(act.video_url) : null;
  const pageUrl = `https://masbesaura.com/actividades/${act.id}`;
  const allImages = [act.imagen_url, ...(act.imagenes ?? [])].filter((u): u is string => Boolean(u));

  let unavailableDates: import("@/app/actions/reservas").DateRange[] = [];

  if (act.tipo_reserva === "cabanya") {
    unavailableDates = await getUnavailableDatesCabanya(act.id);
  } else {
    unavailableDates = await getBlockedDatesActividad(act.id);
  }

  const BookingBlock = () => {
    if (act.tipo_reserva === "comida") {
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
        actividadId={act.id}
        tipoPago={act.tipo_reserva === "cabanya" ? "cabanya" : "actividad"}
        sinFecha={act.tipo_reserva === "simple"}
        fechaUnica={(act as unknown as { fecha_unica?: string }).fecha_unica || undefined}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />

      {/* ─── HERO ─── */}
      {allImages.length > 0 && (
        <section className="relative h-[45vh] flex items-end overflow-hidden pt-16">
          <div className="absolute inset-0">
            <ImageSlider images={allImages} alt={act.titulo} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 via-[#2C1810]/20 to-transparent pointer-events-none" />
          </div>
          <div className="relative z-10 px-6 pb-12 max-w-4xl mx-auto w-full">
            {act.categoria && (
              <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-2">
                {act.categoria}
              </p>
            )}
            <h1
              className="text-4xl md:text-5xl text-[#F0EAD6]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {act.titulo}
            </h1>
          </div>
        </section>
      )}

      {/* ─── BACK + TITLE (if no hero image) ─── */}
      {allImages.length === 0 && (
        <div className="pt-24 pb-6 px-6 max-w-4xl mx-auto">
          {act.categoria && (
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-2">
              {act.categoria}
            </p>
          )}
          <h1
            className="text-4xl md:text-5xl text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {act.titulo}
          </h1>
        </div>
      )}

      {/* ─── BACK LINK ─── */}
      <div className="px-6 py-4 max-w-4xl mx-auto">
        <Link
          href="/actividades"
          className="inline-flex items-center gap-1 text-sm text-[#4A6741] hover:text-[#2C1810] transition-colors"
        >
          <ChevronLeft size={16} />
          Todas las actividades
        </Link>
      </div>

      {/* ─── CONTENT ─── */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">

          {/* Left: description + booking */}
          <div>
            {act.descripcion.includes("<") ? (
              <div
                className="text-[#2C1810]/70 leading-relaxed mb-6 text-sm
                  [&_a]:text-[#4A6741] [&_a]:underline [&_a]:break-words
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                  [&_strong]:font-semibold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: act.descripcion }}
              />
            ) : (
              <p className="text-[#2C1810]/70 leading-relaxed mb-6 text-sm whitespace-pre-line">
                {act.descripcion}
              </p>
            )}

            {act.precio_texto && (
              <p className="text-[#2C1810]/60 text-sm mb-6">
                <span className="font-medium text-[#2C1810]">{act.precio_texto}</span>
              </p>
            )}

            <BookingBlock />

            <div className="mt-6 pt-5 border-t border-[#E8DCC8]">
              <ShareButtons url={pageUrl} title={act.titulo + " — Mas Besaura"} />
            </div>
          </div>

          {/* Right: video */}
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
      </section>

      <ActividadesFooter />
    </div>
  );
}
