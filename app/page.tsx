import type { Metadata } from "next";
import HeroSlider from "./components/HeroSlider";
import NavBar from "./components/NavBar";
import { SiteContentProvider } from "@/lib/SiteContentContext";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

const PAGE_KEYS = [
  "page_home_hero_subtitle_es","page_home_hero_subtitle_ca",
  "page_home_proposito_title_es","page_home_proposito_title_ca",
  "page_home_proposito_p1_es","page_home_proposito_p1_ca",
  "page_home_proposito_p2_es","page_home_proposito_p2_ca",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LodgingBusiness",
      "@id": "https://masbesaura.com/#lodging",
      name: "Mas Besaura",
      description: "Casa rural de retiros y experiencias en la naturaleza. Tres habitaciones, La Cabanya (350 m²) y actividades terapéuticas entre hayedos, ríos y cascadas.",
      url: "https://masbesaura.com",
      telephone: "+34665822542",
      image: "https://masbesaura.com/images/hero1.jpg",
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        streetAddress: "La Vila de Buscarons",
        addressLocality: "Vidrà",
        addressRegion: "Girona",
        postalCode: "17531",
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 42.1167,
        longitude: 2.2833,
      },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Sala exterior La Cabanya", value: true },
        { "@type": "LocationFeatureSpecification", name: "Sala interior para talleres", value: true },
        { "@type": "LocationFeatureSpecification", name: "Cocina equipada", value: true },
        { "@type": "LocationFeatureSpecification", name: "Jardín y naturaleza", value: true },
        { "@type": "LocationFeatureSpecification", name: "Estufas de pellets", value: true },
      ],
      numberOfRooms: 3,
      checkinTime: "16:00",
      checkoutTime: "12:00",
    },
    {
      "@type": "Organization",
      "@id": "https://masbesaura.com/#organization",
      name: "Mas Besaura",
      url: "https://masbesaura.com",
      logo: "https://masbesaura.com/images/hero1.jpg",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+34665822542",
        contactType: "reservas",
        availableLanguage: ["Spanish", "Catalan"],
      },
    },
  ],
};

export default async function Home() {
  const rows = await prisma.sistemaConfig.findMany({ where: { clave: { in: PAGE_KEYS } } });
  const content = Object.fromEntries(rows.map((r) => [r.clave, r.valor]));

  return (
  <SiteContentProvider content={content}>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
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
  </SiteContentProvider>
  );
}
