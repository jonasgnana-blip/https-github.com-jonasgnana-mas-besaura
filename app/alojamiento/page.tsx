import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import BotonReservaHabitacion, { CabanyaReserva } from "./AlojamientoCliente";
import { Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Alojamiento",
  description:
    "Tres habitaciones únicas entre bosques y ríos en Mas Besaura, Vidrà (Girona). Alojamiento con desayuno o media pensión. La Cabanya: sala de 350 m² para grupos.",
};

const HABITACIONES = [
  {
    nombre: "Artemisa",
    descripcion:
      "2 camas individuales y una cama doble, con baño. Estufa de pellets. Orientación este.",
    imagen: "/images/hero1.jpg",
  },
  {
    nombre: "Selene",
    descripcion:
      "Habitación con altillo. 2 camas individuales abajo, 2 camas individuales arriba. Estufa de pellets. Orientación norte.",
    imagen: "/images/hero2.jpg",
  },
  {
    nombre: "Hécate",
    descripcion:
      "2 camas individuales y una cama doble. Estufa de pellets. Orientación oeste.",
    imagen: "/images/hero3.jpg",
  },
];

export default function AlojamientoPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />

      {/* ─── HERO ─── */}
      <section className="relative h-[50vh] flex items-end overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/images/hero1.jpg"
            alt="Alojamiento en Mas Besaura"
            className="w-full h-full object-cover object-center"
          />
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
            Alojamiento
          </h1>
          <p className="text-[#E8DCC8]/80 text-lg mt-3 font-light">
            Tres habitaciones únicas entre bosques y ríos
          </p>
        </div>
      </section>

      {/* ─── HABITACIONES ─── */}
      <section className="py-20 px-6 bg-[#F0EAD6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
              Las habitaciones
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#2C1810]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Tres diosas que custodian tu descanso
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HABITACIONES.map((hab) => (
              <div
                key={hab.nombre}
                className="bg-[#FAFAF6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={hab.imagen}
                    alt={`Habitación ${hab.nombre}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="text-2xl text-[#2C1810] mb-3"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {hab.nombre}
                  </h3>
                  <p className="text-[#2C1810]/65 text-sm leading-relaxed mb-6">
                    {hab.descripcion}
                  </p>

                  {/* Booking options */}
                  <div className="space-y-3">
                    <BotonReservaHabitacion
                      nombre={hab.nombre}
                      opcion="desayuno"
                      precio={45}
                      label="Alojamiento + Desayuno — 45€/persona"
                    />
                    <BotonReservaHabitacion
                      nombre={hab.nombre}
                      opcion="media_pension"
                      precio={60}
                      label="Alojamiento + Media Pensión — 60€/persona"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LA CABANYA ─── */}
      <section className="py-20 px-6 bg-[#FAFAF6]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/images/hero1.jpg"
                alt="La Cabanya — Sala Granero"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
                Sala exterior
              </p>
              <h2
                className="text-3xl md:text-4xl text-[#2C1810] mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                La Cabanya · Sala Granero
              </h2>
              <p className="text-[#2C1810]/70 leading-relaxed mb-8">
                350 m² de sala con suelo de microcemento mirando al valle. Soleada en invierno y
                con sombra en verano. Con baño, cocina eléctrica, platos, vasos y utensilios.
                Capacidad para más de 100 personas.
              </p>

              <div className="bg-[#F0EAD6] rounded-2xl p-6">
                <p className="text-sm text-[#2C1810]/60 mb-5 font-medium">
                  10€ por persona · ¿Cuántas personas sois?
                </p>
                <CabanyaReserva />
              </div>
            </div>
          </div>
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
                href="https://wa.me/34XXXXXXXXX"
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
