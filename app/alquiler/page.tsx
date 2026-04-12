import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import AlquilerCliente from "./AlquilerCliente";
import {
  AlquilerHeroTextos,
  AlquilerDescripcion,
  AlquilerIncluyeSection,
  AlquilerCondicionesSection,
  AlquilerPoliticaSection,
  AlquilerReservaHeader,
  AlquilerFooterTextos,
} from "./AlquilerEstaticos";
import { getUnavailableDates } from "@/app/actions/reservas";
import { Phone, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alquiler Casa para Retiros y Grupos",
  description:
    "Alquila Mas Besaura para retiros, talleres y actividades profesionales. 3 habitaciones (12 plazas), pensión completa y La Cabanya (350 m²). Desde 80€/persona/día. Vidrà, Girona.",
  keywords: [
    "alquiler casa retiros Girona", "alquiler casa grupos Cataluña", "retiro empresarial Girona",
    "La Cabanya Mas Besaura", "espacio retiro naturaleza", "alquiler finca retiros",
    "casa rural grupos Ripollès", "taller bienestar Girona",
  ],
  alternates: { canonical: "https://masbesaura.com/alquiler" },
  openGraph: {
    title: "Alquiler Casa para Retiros — Mas Besaura",
    description:
      "Tu espacio íntegro para crear juntos. 12 plazas, pensión completa, La Cabanya (350 m²). 80€/persona/día en Vidrà, Girona.",
    url: "https://masbesaura.com/alquiler",
    images: [
      { url: "https://masbesaura.com/images/hero2.jpg", width: 1200, height: 630, alt: "Alquiler Casa Retiros — Mas Besaura" },
    ],
  },
};

export default async function AlquilerPage() {
  const [datesCabanya, datesCasa] = await Promise.all([
    getUnavailableDates("la-cabanya"),
    getUnavailableDates("mas-besaura-casa"),
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />

      {/* ─── HERO ─── */}
      <section className="relative h-[50vh] flex items-end overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/images/hero2.jpg"
            alt="Alquiler casa para retiros — Mas Besaura"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 via-[#2C1810]/20 to-transparent" />
        </div>
        <div className="relative z-10 px-6 pb-12 max-w-6xl mx-auto w-full">
          <AlquilerHeroTextos />
        </div>
      </section>

      {/* ─── MAIN DESCRIPTION ─── */}
      <section className="py-20 px-6 bg-[#FAFAF6]">
        <AlquilerDescripcion />
      </section>

      {/* ─── QUÉ INCLUYE ─── */}
      <section className="py-16 px-6 bg-[#F0EAD6]">
        <AlquilerIncluyeSection />
      </section>

      {/* ─── CONDICIONES DE ESTANCIA ─── */}
      <section className="py-16 px-6 bg-[#FAFAF6]">
        <AlquilerCondicionesSection />
      </section>

      {/* ─── POLÍTICA DE CANCELACIÓN ─── */}
      <section className="py-16 px-6 bg-[#F0EAD6]">
        <AlquilerPoliticaSection />
      </section>

      {/* ─── CALCULADORA + RESERVA ─── */}
      <section className="py-16 px-6 bg-[#F0EAD6]">
        <div className="max-w-3xl mx-auto">
          <AlquilerReservaHeader />
          <AlquilerCliente datesCabanya={datesCabanya} datesCasa={datesCasa} />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-16 px-6 bg-[#2C1810]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <span
              className="text-2xl text-[#F0EAD6]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Mas Besaura
            </span>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                href="https://maps.app.goo.gl/R5jGm9yANyER96e68"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C4A882] text-[#2C1810] rounded-full text-sm font-semibold hover:bg-[#F0EAD6] transition-colors"
              >
                <MapPin size={16} />
                <AlquilerFooterTextos />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-[#F0EAD6]/20 flex items-center justify-center text-[#E8DCC8]/70 hover:text-[#F0EAD6] hover:border-[#F0EAD6]/50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-[#F0EAD6]/20 flex items-center justify-center text-[#E8DCC8]/70 hover:text-[#F0EAD6] hover:border-[#F0EAD6]/50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="https://wa.me/34665822542"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-[#F0EAD6]/20 flex items-center justify-center text-[#E8DCC8]/70 hover:text-[#F0EAD6] hover:border-[#F0EAD6]/50 transition-colors"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-[#F0EAD6]/10 text-center text-xs text-[#E8DCC8]/40">
            © {new Date().getFullYear()} Mas Besaura · Vidrà, Girona. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
