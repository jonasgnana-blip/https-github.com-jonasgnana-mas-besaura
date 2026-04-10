import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import AlquilerCliente from "./AlquilerCliente";
import { getUnavailableDates } from "@/app/actions/reservas";
import { Phone, MapPin, Check } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alquiler Casa para Retiros",
  description:
    "Alquila Mas Besaura para tus retiros y actividades profesionales. 3 habitaciones, pensión completa, La Cabanya (350 m²). 80€/persona/día. Vidrà, Girona.",
};

const INCLUYE = [
  { titulo: "Alojamiento", desc: "3 habitaciones de 4 plazas cada una" },
  { titulo: "Pensión Completa", desc: "Comida saludable con productos de proximidad" },
  { titulo: "Sala Interior", desc: "26 m² para talleres y grupos reducidos" },
  { titulo: "La Cabanya", desc: "350 m² de sala exterior con arco de piedra" },
  { titulo: "Jardín y Naturaleza", desc: "Hayedos, ríos y cascadas a tu disposición" },
  { titulo: "Cocina Equipada", desc: "Opción vegetariana siempre disponible" },
];

const POLITICA = [
  "Reserva con el 50% del importe total.",
  "Devolución íntegra hasta 2 meses antes.",
  "Devolución del 50% hasta 1 mes antes.",
  "Sin devolución a menos de 1 mes.",
];

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
          <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Retiros · Eventos · Grupos
          </p>
          <h1
            className="text-5xl md:text-6xl text-[#F0EAD6]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Alquiler Casa para Retiros
          </h1>
          <p className="text-[#E8DCC8]/80 text-lg mt-3 font-light">
            Tu espacio para crear juntos
          </p>
        </div>
      </section>

      {/* ─── MAIN DESCRIPTION ─── */}
      <section className="py-20 px-6 bg-[#FAFAF6]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
            La propuesta
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#2C1810] mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Un espacio íntegro para ti y tu grupo
          </h2>
          <p className="text-[#2C1810]/70 leading-relaxed mb-4">
            Alquila la casa para tus actividades profesionales o encuentros en grupo.
            Tres habitaciones de 4 plazas cada una. Posibilidad de camping.
          </p>
          <p className="text-[#2C1810] text-2xl font-medium mt-8 mb-2">
            80€/persona/día
          </p>
          <p className="text-[#2C1810]/60 text-sm mb-4">
            Incluye alojamiento, pensión completa, sala exterior e interior.
          </p>
          <p className="text-[#2C1810]/60 text-sm">
            Comida saludable con productos de proximidad. Opción vegetariana.
          </p>
        </div>
      </section>

      {/* ─── QUÉ INCLUYE ─── */}
      <section className="py-16 px-6 bg-[#F0EAD6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
              Todo incluido
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#2C1810]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Lo que encontrarás
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {INCLUYE.map((item) => (
              <div
                key={item.titulo}
                className="bg-[#FAFAF6] rounded-2xl p-6 flex gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-[#4A6741]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={16} className="text-[#4A6741]" />
                </div>
                <div>
                  <h3
                    className="text-base text-[#2C1810] mb-1"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {item.titulo}
                  </h3>
                  <p className="text-[#2C1810]/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POLÍTICA DE CANCELACIÓN ─── */}
      <section className="py-16 px-6 bg-[#FAFAF6]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
              Condiciones
            </p>
            <h2
              className="text-3xl text-[#2C1810]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Política de cancelación
            </h2>
          </div>

          <div className="bg-[#F0EAD6] rounded-2xl p-8 space-y-4">
            {POLITICA.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#C4A882]/30 text-[#8B6914] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[#2C1810]/75 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CALCULADORA + RESERVA ─── */}
      <section className="py-16 px-6 bg-[#F0EAD6]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
              Reserva
            </p>
            <h2
              className="text-3xl text-[#2C1810]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              ¿Cuándo y con quién?
            </h2>
          </div>
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
                Cómo llegar
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
