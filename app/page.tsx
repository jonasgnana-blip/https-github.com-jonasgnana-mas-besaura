import Link from "next/link";
import {
  TreePine,
  Users,
  Flame,
  Heart,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  Star,
} from "lucide-react";
import HeroSlider from "./components/HeroSlider";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF6]/90 backdrop-blur-sm border-b border-[#E8DCC8]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <span
            className="text-xl tracking-wide text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Mas Besaura
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#4A6741] font-medium tracking-wide">
            <a href="#la-casa" className="hover:text-[#2C1810] transition-colors">
              La Casa
            </a>
            <a href="#actividades" className="hover:text-[#2C1810] transition-colors">
              Actividades
            </a>
            <a href="#contacto" className="hover:text-[#2C1810] transition-colors">
              Contacto
            </a>
            <Link
              href="/reservar"
              className="px-5 py-2 bg-[#4A6741] text-[#F0EAD6] rounded-full hover:bg-[#3A5432] transition-colors text-sm"
            >
              Reservar
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroSlider />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="text-[#C4A882] text-sm tracking-[0.25em] uppercase mb-4 font-medium">
            Casa Rural · Cataluña
          </p>
          <h1
            className="text-6xl md:text-8xl text-[#F0EAD6] leading-none mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Mas
            <br />
            Besaura
          </h1>
          <p className="text-[#E8DCC8] text-lg md:text-xl leading-relaxed mb-10 font-light">
            Un lugar donde el tiempo se detiene. Talleres, retiros y momentos
            en familia entre bosques y piedra antigua.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservar"
              className="px-8 py-3.5 bg-[#F0EAD6] text-[#2C1810] rounded-full font-medium hover:bg-white transition-colors"
            >
              Ver disponibilidad
            </Link>
            <a
              href="#la-casa"
              className="px-8 py-3.5 border border-[#F0EAD6]/50 text-[#F0EAD6] rounded-full font-medium hover:border-[#F0EAD6] transition-colors"
            >
              Descubrir la casa
            </a>
          </div>
        </div>

        <a
          href="#la-casa"
          className="absolute bottom-16 z-10 text-[#F0EAD6]/60 hover:text-[#F0EAD6] transition-colors animate-bounce"
        >
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ─── LA CASA ─── */}
      <section id="la-casa" className="py-24 px-6 bg-[#FAFAF6]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-[#E8DCC8] rounded-2xl overflow-hidden relative">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #C4A882 0%, #8B6914 50%, #4A6741 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <TreePine size={80} className="text-[#F0EAD6]/40" />
            </div>
          </div>

          <div>
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
              Nuestra historia
            </p>
            <h2
              className="text-4xl md:text-5xl text-[#2C1810] leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Una masía de piedra, siglos de alma
            </h2>
            <p className="text-[#2C1810]/70 leading-relaxed mb-4">
              Mas Besaura es una masía tradicional catalana restaurada con amor
              y respeto por sus materiales originales: piedra, madera y cal.
              Rodeada de bosque mediterráneo, es el escenario perfecto para
              desconectar del ruido y reconectar con lo esencial.
            </p>
            <p className="text-[#2C1810]/70 leading-relaxed mb-8">
              Organizamos talleres artesanales, retiros de bienestar y escapadas
              familiares para todos aquellos que buscan experiencias auténticas
              lejos de las pantallas.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E8DCC8]">
              {[
                { value: "15+", label: "Años de historia" },
                { value: "200+", label: "Familias acogidas" },
                { value: "4.9★", label: "Valoración media" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-2xl text-[#4A6741] mb-1"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-[#2C1810]/50 uppercase tracking-wide">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTIVIDADES ─── */}
      <section id="actividades" className="py-24 px-6 bg-[#F0EAD6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
              Qué ofrecemos
            </p>
            <h2
              className="text-4xl md:text-5xl text-[#2C1810]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Experiencias para el alma
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Flame size={32} className="text-[#8B6914]" />,
                title: "Talleres",
                description:
                  "Cerámica, cocina tradicional, cestería, fermentación… Aprendizajes que conectan las manos con la tierra.",
                tags: ["Fin de semana", "Grupos pequeños"],
              },
              {
                icon: <Users size={32} className="text-[#4A6741]" />,
                title: "Actividades Familiares",
                description:
                  "Rutas por el bosque, noches de estrellas, huerto ecológico y juegos al aire libre. La naturaleza como aula.",
                tags: ["Todas las edades", "Todo el año"],
              },
              {
                icon: <Heart size={32} className="text-[#C4A882]" />,
                title: "Retiros",
                description:
                  "Yoga, meditación y silencio. Espacios de pausa y cuidado en entornos naturales sin wifi.",
                tags: ["Desconexión", "Grupos & Individual"],
              },
            ].map(({ icon, title, description, tags }) => (
              <div
                key={title}
                className="bg-[#FAFAF6] rounded-2xl p-8 flex flex-col gap-5 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-[#F0EAD6] flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3
                    className="text-2xl text-[#2C1810] mb-2"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[#2C1810]/65 leading-relaxed text-sm">
                    {description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 bg-[#E8DCC8] text-[#2C1810]/70 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOOKING CTA ─── */}
      <section className="py-24 px-6 bg-[#2A3F24]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-4">
            Reserva tu estancia
          </p>
          <h2
            className="text-4xl md:text-5xl text-[#F0EAD6] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            ¿Cuándo quieres venir?
          </h2>
          <p className="text-[#E8DCC8]/70 text-lg mb-10 leading-relaxed">
            Selecciona tus fechas, elige tus complementos y confirma en minutos.
            Sin intermediarios, sin sorpresas.
          </p>
          <Link
            href="/reservar"
            className="inline-block px-10 py-4 bg-[#C4A882] text-[#2C1810] rounded-full font-semibold text-lg hover:bg-[#F0EAD6] transition-colors"
          >
            Comprobar disponibilidad
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="contacto" className="py-16 px-6 bg-[#2C1810]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-[#E8DCC8]/70">
          <div>
            <span
              className="text-2xl text-[#F0EAD6] block mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Mas Besaura
            </span>
            <p className="text-sm leading-relaxed">
              Casa rural en plena naturaleza. Un espacio para el descanso, el
              aprendizaje y la conexión.
            </p>
          </div>

          <div>
            <h4 className="text-[#F0EAD6] font-medium mb-4 uppercase tracking-wider text-xs">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#C4A882]" />
                info@masbesaura.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#C4A882]" />
                +34 665 822 542
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#C4A882]" />
                Cataluña, España
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F0EAD6] font-medium mb-4 uppercase tracking-wider text-xs">
              Accesos rápidos
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "La Casa", href: "#la-casa" },
                { label: "Talleres", href: "#actividades" },
                { label: "Retiros", href: "#actividades" },
                { label: "Reservar", href: "/reservar" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="hover:text-[#F0EAD6] transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-[#F0EAD6]/10 text-center text-xs text-[#E8DCC8]/40">
          © {new Date().getFullYear()} Mas Besaura. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
