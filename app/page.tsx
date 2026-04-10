import Link from "next/link";
import {
  Users,
  Flame,
  Heart,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  Sparkles,
  TreePine,
  HeartHandshake,
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
            <a href="#proposito" className="hover:text-[#2C1810] transition-colors">
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
            La Vila de Buscarons · Vidrà (Girona)
          </p>
          <h1
            className="text-6xl md:text-8xl text-[#F0EAD6] leading-none mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Mas
            <br />
            Besaura
          </h1>
          <p className="text-[#E8DCC8] text-lg md:text-xl leading-relaxed mb-10 font-light max-w-xl mx-auto">
            Un lugar seguro entre ríos y bosques salvajes para tu sanación y despertar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservar"
              className="px-8 py-3.5 bg-[#F0EAD6] text-[#2C1810] rounded-full font-medium hover:bg-white transition-colors"
            >
              Ver disponibilidad
            </Link>
            <Link
              href="/la-casa"
              className="px-8 py-3.5 border border-[#F0EAD6]/50 text-[#F0EAD6] rounded-full font-medium hover:border-[#F0EAD6] transition-colors"
            >
              Descubrir la casa
            </Link>
          </div>
        </div>

        <a
          href="#proposito"
          className="absolute bottom-16 z-10 text-[#F0EAD6]/60 hover:text-[#F0EAD6] transition-colors animate-bounce"
        >
          <ChevronDown size={28} />
        </a>
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

          <div>
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
              Nuestro Propósito
            </p>
            <h2
              className="text-4xl md:text-5xl text-[#2C1810] leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Una masía entre hayedos, ríos y cascadas
            </h2>
            <p className="text-[#2C1810]/70 leading-relaxed mb-4">
              Mas Besaura es una masía tradicional restaurada con amor y respeto
              por su entorno natural: hayedos, ríos salvajes, cascadas luminosas,
              ermitas ancestrales.
            </p>
            <p className="text-[#2C1810]/70 leading-relaxed mb-8">
              Organizamos retiros y actividades con el propósito de reconocer
              nuestra naturaleza esencial, sanar los vínculos familiares y la
              relación entre hombres y mujeres. Puedes alquilar la casa y la
              sala exterior — un antiguo granero de 350 m².
            </p>
            <div className="flex flex-col gap-4 pt-6 border-t border-[#E8DCC8]">
              {[
                {
                  icon: <Flame size={16} className="text-[#8B6914] shrink-0 mt-0.5" />,
                  label: "Actividades terapéuticas y de ocio familiar",
                },
                {
                  icon: <HeartHandshake size={16} className="text-[#4A6741] shrink-0 mt-0.5" />,
                  label: "Diseño personalizado de sanación individual y de pareja",
                },
                {
                  icon: <Sparkles size={16} className="text-[#C4A882] shrink-0 mt-0.5" />,
                  label: "Equipo multidisciplinar",
                },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-start gap-3">
                  {icon}
                  <span className="text-sm text-[#2C1810]/75 uppercase tracking-wide font-medium leading-snug">
                    + {label}
                  </span>
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
              Un espacio de integración
              <br />
              para el alma y el cuerpo
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Flame size={32} className="text-[#8B6914]" />,
                title: "Retiros",
                description:
                  "Yoga, meditación, danza, trabajo con el fuego, constelaciones familiares. Espacios de pausa y cuidado en entornos naturales sin wifi.",
                tags: ["Sanación", "Grupos & Individual"],
              },
              {
                icon: <Users size={32} className="text-[#4A6741]" />,
                title: "Actividades Familiares",
                description:
                  "Rutas por el bosque, noches de estrellas, huerto ecológico y juegos al aire libre. La naturaleza como aula.",
                tags: ["Todas las edades", "Todo el año"],
              },
              {
                icon: <HeartHandshake size={32} className="text-[#C4A882]" />,
                title: "Talleres",
                description:
                  "Cerámica, cocina tradicional, cestería, fermentación, gestión emocional. Aprendizajes que conectan las manos con la tierra.",
                tags: ["Fin de semana", "Grupos pequeños"],
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
            Alquila la casa completa o solo la sala La Cabanya.
            Selecciona tus fechas y confirma en minutos.
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
              Casa rural en Vidrà, Girona. Un espacio seguro entre ríos y
              bosques salvajes para tu sanación y despertar.
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
                Vidrà, Girona · Cataluña
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F0EAD6] font-medium mb-4 uppercase tracking-wider text-xs">
              Accesos rápidos
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "La Casa", href: "/la-casa" },
                { label: "Retiros", href: "#actividades" },
                { label: "Talleres", href: "#actividades" },
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
          © {new Date().getFullYear()} Mas Besaura · Vidrà, Girona. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
