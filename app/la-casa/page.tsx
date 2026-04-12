import NavBar from "@/app/components/NavBar";
import ImageFader from "@/app/components/ImageFader";
import LaCasaGallery from "./LaCasaGallery";
import {
  LaCasaIntro,
  LaCasaHabitaciones,
  LaCasaEspacios,
  LaCasaCTA,
  LaCasaFooter,
} from "./LaCasaTextos";

const CABANYA_FOTOS = [
  { src: "/images/cabanya-grupo.jpg", alt: "La Cabanya — grupo de retiro" },
  { src: "/images/cabanya-luna.jpg", alt: "La Cabanya — atardecer con luna" },
];

export default function LaCasa() {
  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />

      {/* ─── HERO ─── */}
      <section className="relative h-[55vh] flex items-end overflow-hidden pt-16">
        <ImageFader />
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
      <LaCasaHabitaciones />

      {/* ─── ESPACIOS COMUNES ─── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <LaCasaEspacios />

          {/* ─── CABANYA GALLERY ─── */}
          <LaCasaGallery fotos={CABANYA_FOTOS} />
        </div>
      </section>

      {/* ─── CTA ALOJAMIENTO ─── */}
      <LaCasaCTA />

      {/* ─── FOOTER ─── */}
      <LaCasaFooter />
    </div>
  );
}
