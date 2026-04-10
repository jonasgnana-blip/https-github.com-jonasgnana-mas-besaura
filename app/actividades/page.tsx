import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import { BotonActividad, CabanyaActividadReserva } from "./ActividadCard";
import { Phone, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actividades",
  description:
    "Experiencias en la naturaleza y el alma. Rutas familiares, BTT con brunch, constelaciones familiares, inmersión terapéutica y alquiler de La Cabanya en Mas Besaura, Vidrà.",
};

export default function ActividadesPage() {
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
        <div className="relative z-10 px-6 pb-12 max-w-6xl mx-auto w-full">
          <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Naturaleza · Terapia · Familia
          </p>
          <h1
            className="text-5xl md:text-6xl text-[#F0EAD6]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Actividades
          </h1>
          <p className="text-[#E8DCC8]/80 text-lg mt-3 font-light">
            Experiencias en la naturaleza y el alma
          </p>
        </div>
      </section>

      {/* ─── ACTIVITIES GRID ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* 1. Activitat Familiar */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/images/hero4.jpg"
                alt="Ruta Orientació i Gimcana"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#4A6741] text-xs tracking-[0.2em] uppercase font-medium mb-3">
                Familiar
              </p>
              <h2
                className="text-2xl md:text-3xl text-[#2C1810] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Activitat Familiar — Ruta Orientació i Gimcana
              </h2>
              <p className="text-[#2C1810]/70 leading-relaxed mb-4 text-sm">
                Paseo por sendero, el bosque y el río. Visita a la cueva y un lugar secreto
                donde bailan las hadas con los duendes. Una experiencia mágica para toda la
                familia.
              </p>
              <p className="text-[#2C1810]/60 text-sm mb-6">
                <span className="font-medium text-[#2C1810]">10€/adulto</span> · Niños menores de 16 años: gratis
              </p>
              <div className="flex flex-wrap gap-3">
                <BotonActividad
                  label="10€ Actividad"
                  
                  nombre="Ruta Orientació i Gimcana"
                  
                  precio={10}
                />
                <BotonActividad
                  label="15€ Actividad + Comida Casera"
                  
                  nombre="Ruta Orientació i Gimcana"
                  
                  precio={15}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#E8DCC8]" />

          {/* 2. BTT amb Brunch */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <p className="text-[#4A6741] text-xs tracking-[0.2em] uppercase font-medium mb-3">
                Deporte & Gastronomia
              </p>
              <h2
                className="text-2xl md:text-3xl text-[#2C1810] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Ruta BTT amb Brunch
              </h2>
              <p className="text-[#2C1810]/70 leading-relaxed mb-4 text-sm">
                Diferentes rutas por la zona entre el Ripollès y la Garrotxa con desayuno de
                tenedor incluido.
              </p>
              <p className="text-[#2C1810]/60 text-sm mb-6">
                <span className="font-medium text-[#2C1810]">20€/persona</span>
              </p>
              <BotonActividad
                label="20€ Reservar"
                
                nombre="Ruta BTT amb Brunch"
                
                precio={20}
              />
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden order-1 md:order-2">
              <img
                src="/images/hero5.jpg"
                alt="Ruta BTT amb Brunch"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="border-t border-[#E8DCC8]" />

          {/* 3. Constel·lació Familiar */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/images/hero6.jpg"
                alt="Constel·lació Familiar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#4A6741] text-xs tracking-[0.2em] uppercase font-medium mb-3">
                Terapia Grupal
              </p>
              <h2
                className="text-2xl md:text-3xl text-[#2C1810] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Constel·lació Familiar
              </h2>
              <p className="text-[#2C1810]/70 leading-relaxed mb-4 text-sm">
                Trabajo terapéutico en grupo, familia o equipo profesional, que combina
                dinámicas grupales e indicaciones terapéuticas.
              </p>
              <p className="text-[#2C1810]/60 text-sm mb-6">
                <span className="font-medium text-[#2C1810]">35€/persona</span> · 2h – 3h
              </p>
              <BotonActividad
                label="35€ Reservar"
                
                nombre="Constel·lació Familiar"
                
                precio={35}
              />
            </div>
          </div>

          <div className="border-t border-[#E8DCC8]" />

          {/* 4. Immersió Terapèutica */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <p className="text-[#4A6741] text-xs tracking-[0.2em] uppercase font-medium mb-3">
                Proceso Personal
              </p>
              <h2
                className="text-2xl md:text-3xl text-[#2C1810] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Immersió Terapèutica
              </h2>
              <p className="text-[#2C1810]/70 leading-relaxed mb-4 text-sm">
                7h de proceso personal y relacional que combinan terapia, constelaciones
                familiares y dinámicas en la naturaleza.
              </p>
              <p className="text-[#2C1810]/60 text-sm mb-6">
                <span className="font-medium text-[#2C1810]">369€</span> · 20€ extra por persona a partir de 5
              </p>
              <BotonActividad
                label="369€ Reservar"
                
                nombre="Immersió Terapèutica"
                
                precio={369}
              />
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden order-1 md:order-2">
              <img
                src="/images/hero7.jpg"
                alt="Immersió Terapèutica"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="border-t border-[#E8DCC8]" />

          {/* 5. Sala Cabanya — Alquiler */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/images/hero8.jpg"
                alt="Sala Cabanya"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#4A6741] text-xs tracking-[0.2em] uppercase font-medium mb-3">
                Alquiler Sala
              </p>
              <h2
                className="text-2xl md:text-3xl text-[#2C1810] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Sala Cabanya — Alquiler por día
              </h2>
              <p className="text-[#2C1810]/70 leading-relaxed mb-4 text-sm">
                350 m² de sala con suelo de microcemento. Para actividades profesionales,
                comidas familiares, eventos... Unas 100 personas.
              </p>
              <p className="text-[#2C1810]/60 text-sm mb-6">
                <span className="font-medium text-[#2C1810]">10€/persona/día</span>
              </p>
              <CabanyaActividadReserva />
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
