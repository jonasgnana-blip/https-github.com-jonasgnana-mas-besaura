import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getUnavailableDates } from "@/app/actions/reservas";

export const metadata: Metadata = {
  title: "La Casa",
  description:
    "Descubre Mas Besaura: tres habitaciones únicas, espacios comunes acogedores y La Cabanya — una sala exterior de 350 m² con arco de piedra entre bosques y ríos en Vidrà, Girona.",
  alternates: { canonical: "https://masbesaura.com/la-casa" },
  openGraph: {
    title: "La Casa — Mas Besaura, Vidrà",
    description:
      "Tres habitaciones con encanto, sala interior, cocina y La Cabanya al aire libre. Tu espacio de retiro en el Ripollès.",
    url: "https://masbesaura.com/la-casa",
    images: [
      { url: "https://masbesaura.com/images/hero1.jpg", width: 1200, height: 630, alt: "La Casa — Mas Besaura" },
    ],
  },
};
import NavBar from "@/app/components/NavBar";
import ImageFader from "@/app/components/ImageFader";
import {
  LaCasaIntro,
  LaCasaHabitaciones,
  LaCasaEspacios,
  LaCasaCalendario,
  LaCasaCTA,
  LaCasaFooter,
} from "./LaCasaTextos";

export const revalidate = 0; // always fresh — admin changes show immediately

export default async function LaCasa() {
  const [habitaciones, unavailDates, espacioConfigs] = await Promise.all([
    prisma.habitacion.findMany({
      orderBy: { nombre: "asc" },
      take: 3,
      select: { id: true, nombre: true, descripcion: true, capacidad: true, imagenes: true },
    }),
    getUnavailableDates("la-cabanya"),
    prisma.sistemaConfig.findMany({
      where: {
        clave: {
          in: [
            "espacio_salon_img", "espacio_habs_img", "espacio_sala_img",
            "espacio_salon_nombre", "espacio_habs_nombre", "espacio_sala_nombre",
            "cabanya_foto_1", "cabanya_foto_2",
            "slider_foto_1", "slider_foto_2", "slider_foto_3",
            "slider_foto_4", "slider_foto_5",
          ],
        },
      },
    }),
  ]);

  const cfg = Object.fromEntries(espacioConfigs.map(c => [c.clave, c.valor]));

  // Build slider image list: extra slots first, then hab images, then espacio images
  const sliderImages = [
    cfg["slider_foto_1"], cfg["slider_foto_2"], cfg["slider_foto_3"],
    cfg["slider_foto_4"], cfg["slider_foto_5"],
    ...habitaciones.flatMap(h => h.imagenes),
    cfg["espacio_salon_img"], cfg["espacio_habs_img"], cfg["espacio_sala_img"],
    cfg["cabanya_foto_1"], cfg["cabanya_foto_2"],
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />

      {/* ─── HERO ─── */}
      <section className="relative h-[55vh] flex items-end overflow-hidden pt-16">
        <ImageFader images={sliderImages} />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 via-[#2C1810]/20 to-transparent" />
        </div>
        <div className="relative z-10 px-6 pb-12 max-w-6xl mx-auto w-full">
          <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Vidrà · Girona
          </p>
          <h1
            className="text-5xl md:text-6xl text-[#F0EAD6]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            La Casa
          </h1>
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <LaCasaIntro />

      {/* ─── HABITACIONES ─── */}
      <LaCasaHabitaciones habitaciones={habitaciones} />

      {/* ─── ESPACIOS COMUNES ─── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <LaCasaEspacios
            salonImg={cfg["espacio_salon_img"] || undefined}
            habsImg={cfg["espacio_habs_img"] || undefined}
            salaImg={cfg["espacio_sala_img"] || undefined}
            salonNombre={cfg["espacio_salon_nombre"] || undefined}
            habsNombre={cfg["espacio_habs_nombre"] || undefined}
            salaNombre={cfg["espacio_sala_nombre"] || undefined}
          />
        </div>
      </section>

      {/* ─── CALENDARIO / RESERVAS ─── */}
      <LaCasaCalendario
        unavailDates={unavailDates}
        foto1={cfg["cabanya_foto_1"] || undefined}
        foto2={cfg["cabanya_foto_2"] || undefined}
      />

      {/* ─── CTA ALOJAMIENTO ─── */}
      <LaCasaCTA />

      {/* ─── FOOTER ─── */}
      <LaCasaFooter />
    </div>
  );
}
