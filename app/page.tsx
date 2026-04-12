import type { Metadata } from "next";
import HeroSlider from "./components/HeroSlider";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Mas Besaura — Casa Rural · Actividades · Retiros en Vidrà, Girona",
  description:
    "Casa rural en La Vila de Buscarons, Vidrà (Girona). Alojamiento con encanto entre bosques y ríos del Ripollès. Actividades terapéuticas, retiros espirituales y alquiler de la casa para grupos.",
  keywords: [
    "casa rural Vidrà", "retiros Girona", "actividades naturaleza Cataluña",
    "Mas Besaura", "alojamiento rural Ripollès", "constelaciones familiares",
  ],
  alternates: { canonical: "https://masbesaura.com" },
  openGraph: {
    title: "Mas Besaura — Casa Rural en Vidrà, Girona",
    description:
      "Alojamiento, actividades terapéuticas y retiros entre ríos y bosques del Ripollès. Tu refugio natural en el Pirineo catalán.",
    url: "https://masbesaura.com",
    images: [
      { url: "https://masbesaura.com/images/hero1.jpg", width: 1200, height: 630, alt: "Mas Besaura — Casa Rural en Vidrà" },
    ],
  },
};
import {
  HomeHeroTextos,
  HomeHeroScroll,
  HomeProposito,
  HomeActividades,
  HomeActividadesCTA,
  HomeAlquilerCTA,
  HomeFooter,
} from "./HomeTextos";

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavBar />

      {/* ─── HERO ─── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroSlider />
        <HomeHeroTextos />
        <HomeHeroScroll />
      </section>

      {/* ─── PROPÓSITO ─── */}
      <section id="proposito" className="py-24 px-6 bg-[#FAFAF6]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-[#E8DCC8] rounded-2xl overflow-hidden relative">
            <img
              src="/images/arch-sunset.jpg"
              alt="Arco de Mas Besaura al atardecer"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <HomeProposito />
        </div>
      </section>

      {/* ─── ACTIVIDADES ─── */}
      <section id="actividades" className="py-24 px-6 bg-[#F0EAD6]">
        <div className="max-w-5xl mx-auto">
          <HomeActividades />
        </div>
      </section>

      {/* ─── ACTIVIDADES CTA ─── */}
      <section className="relative overflow-hidden h-[520px] flex items-center justify-center">
        <img
          src="/images/hero5.jpg"
          alt="Actividades en Mas Besaura"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2C1810]/55" />
        <HomeActividadesCTA />
      </section>

      {/* ─── ALQUILER CTA ─── */}
      <section className="py-24 px-6 bg-[#2A3F24]">
        <HomeAlquilerCTA />
      </section>

      {/* ─── FOOTER ─── */}
      <HomeFooter />
    </div>
  );
}
