import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import { BotonActividad, CabanyaActividadReserva, ComidaCaseraReserva, ActividadConFecha } from "./ActividadCard";
import { getUnavailableDates } from "@/app/actions/reservas";
import { prisma } from "@/lib/prisma";
import ActividadesHero from "./ActividadesHero";
import ActividadesFooter from "./ActividadesFooter";

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

export default async function ActividadesPage() {
  const unavailableDatesCabanya = await getUnavailableDates("la-cabanya");

  const actividades = await prisma.actividad.findMany({
    where: { activa: true },
    orderBy: { orden: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />

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
            const isEven = idx % 2 === 0; // even = image left, odd = image right

            const BookingBlock = () => {
              if (act.tipo_reserva === "cabanya") {
                return <CabanyaActividadReserva unavailableDates={unavailableDatesCabanya} />;
              }
              if (act.tipo_reserva === "con_fecha") {
                return (
                  <ActividadConFecha
                    nombre={act.titulo}
                    precio={Number(act.precio_base)}
                    descripcion={act.descripcion}
                    unavailableDates={[]}
                  />
                );
              }
              if (act.tipo_reserva === "comida") {
                return (
                  <div className="flex flex-wrap gap-3 items-start">
                    <BotonActividad
                      label={`${Number(act.precio_base)}€ Actividad`}
                      nombre={act.titulo}
                      precio={Number(act.precio_base)}
                    />
                    <ComidaCaseraReserva />
                  </div>
                );
              }
              // default: "simple"
              return (
                <>
                  <BotonActividad
                    label={`${Number(act.precio_base)}€ Reservar`}
                    nombre={act.titulo}
                    precio={Number(act.precio_base)}
                  />
                  <p className="text-[#2C1810]/50 text-xs mt-3">
                    Contacta con nosotros para fechas
                  </p>
                </>
              );
            };

            const imageBlock = act.imagen_url ? (
              <div
                className={`aspect-[4/3] rounded-2xl overflow-hidden ${
                  !isEven ? "order-1 md:order-2" : ""
                }`}
              >
                <img
                  src={act.imagen_url}
                  alt={act.titulo}
                  className="w-full h-full object-cover"
                />
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
                <p className="text-[#2C1810]/70 leading-relaxed mb-4 text-sm">
                  {act.descripcion}
                </p>
                {act.precio_texto && (
                  <p className="text-[#2C1810]/60 text-sm mb-6">
                    <span className="font-medium text-[#2C1810]">
                      {act.precio_texto}
                    </span>
                  </p>
                )}
                <BookingBlock />
              </div>
            );

            return (
              <div key={act.id}>
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
