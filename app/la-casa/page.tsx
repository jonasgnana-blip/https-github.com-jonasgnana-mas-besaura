import Link from "next/link";
import { ArrowLeft, Bed, Users, Flame, ChevronRight } from "lucide-react";

const HABITACIONES = [
  {
    nombre: "Habitación Artemisa",
    descripcion:
      "Habitación doble con vistas al bosque y la montaña. Nombrada en honor a la diosa de la naturaleza y la luna, ofrece un refugio íntimo entre la piedra original de la masía.",
    capacidad: "2 personas",
    imagen: "/images/hero3.jpg",
    color: "#E8DCC8",
  },
  {
    nombre: "Habitación Selene",
    descripcion:
      "Habitación doble con baño privado. Selene, la luna llena, inspira este espacio luminoso que baña sus paredes de cal con la luz suave de cada mañana.",
    capacidad: "2 personas",
    imagen: "/images/arch-moon.jpg",
    color: "#DDD0BB",
  },
  {
    nombre: "Habitación Hécate",
    descripcion:
      "Habitación triple con vistas al valle. Hécate guarda los umbrales y los sueños — este cuarto de techos altos y vigas de madera invita al descanso profundo.",
    capacidad: "3 personas",
    imagen: "/images/hero8.jpg",
    color: "#D4C4AA",
  },
];

const ESPACIOS_COMUNES = [
  {
    nombre: "Sala Interior",
    subtitulo: "26 m²",
    descripcion:
      "Sala multiusos con suelo de cemento pulido, paredes de cal y vigas de madera. Perfecta para yoga, meditación, talleres o círculos de trabajo en grupos reducidos.",
    imagen: "/images/hero5.jpg",
    icon: <Flame size={20} className="text-[#8B6914]" />,
  },
  {
    nombre: "Salón Comedor",
    subtitulo: "Para invitados",
    descripcion:
      "Espacio compartido con mesa grande de madera, cocina equipada y chimenea de piedra. El lugar donde los grupos se reúnen para compartir las comidas y las conversaciones del día.",
    imagen: "/images/hero2.jpg",
    icon: <Users size={20} className="text-[#4A6741]" />,
  },
  {
    nombre: "Sala Estar · Cocina",
    subtitulo: "Zona privada",
    descripcion:
      "Estancia con cocina completa, zona de lectura y acceso directo al jardín. Disponible para grupos que alquilan la casa completa.",
    imagen: "/images/hero7.jpg",
    icon: <Bed size={20} className="text-[#C4A882]" />,
  },
];

export default function LaCasa() {
  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF6]/90 backdrop-blur-sm border-b border-[#E8DCC8]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#4A6741] hover:text-[#2C1810] transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <span
            className="text-xl tracking-wide text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Mas Besaura
          </span>
          <Link
            href="/reservar"
            className="px-5 py-2 bg-[#4A6741] text-[#F0EAD6] rounded-full hover:bg-[#3A5432] transition-colors text-sm"
          >
            Reservar
          </Link>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative h-[55vh] flex items-end overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/images/masia-snow.jpg"
            alt="Mas Besaura en invierno"
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
            La Casa
          </h1>
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
          Espacio & Naturaleza
        </p>
        <p className="text-[#2C1810]/75 text-lg leading-relaxed">
          La masía puede alojarse hasta <strong className="text-[#2C1810]">14 personas</strong> — 12 participantes más 2 facilitadores.
          Dispone de tres habitaciones, sala interior, salón comedor y la gran sala exterior La Cabanya.
          Rodeada de hayedos, ríos salvajes y cascadas, es un refugio para el descanso y la transformación.
        </p>
      </section>

      {/* ─── HABITACIONES ─── */}
      <section className="py-12 px-6 bg-[#F0EAD6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
              Habitaciones
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
              <div key={hab.nombre} className="bg-[#FAFAF6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={hab.imagen}
                    alt={hab.nombre}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-xl text-[#2C1810]"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {hab.nombre}
                    </h3>
                    <span className="text-xs px-2.5 py-1 bg-[#E8DCC8] text-[#2C1810]/60 rounded-full flex items-center gap-1">
                      <Bed size={11} />
                      {hab.capacidad}
                    </span>
                  </div>
                  <p className="text-[#2C1810]/65 text-sm leading-relaxed">
                    {hab.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ESPACIOS COMUNES ─── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
              Espacios Comunes
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#2C1810]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Lugares para el encuentro
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ESPACIOS_COMUNES.map((espacio) => (
              <div key={espacio.nombre} className="group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative">
                  <img
                    src={espacio.imagen}
                    alt={espacio.nombre}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {espacio.icon}
                  <span className="text-xs text-[#2C1810]/50 uppercase tracking-wide">
                    {espacio.subtitulo}
                  </span>
                </div>
                <h3
                  className="text-xl text-[#2C1810] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {espacio.nombre}
                </h3>
                <p className="text-[#2C1810]/65 text-sm leading-relaxed">
                  {espacio.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LA CABANYA ─── */}
      <section className="py-0 px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden h-[480px]">
            <img
              src="/images/hero1.jpg"
              alt="La Cabanya — sala exterior de Mas Besaura"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05]/85 via-[#1a0f05]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <span className="text-[#C4A882] text-xs tracking-[0.25em] uppercase font-medium block mb-2">
                    Sala Exterior
                  </span>
                  <h2
                    className="text-4xl md:text-5xl text-[#F0EAD6] mb-3"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    La Cabanya
                  </h2>
                  <p className="text-[#E8DCC8]/80 text-base leading-relaxed max-w-xl">
                    Antiguo granero de <strong className="text-[#F0EAD6]">350 m²</strong> restaurado con arco de piedra y ladrillo.
                    Espacio abierto al paisaje, ideal para retiros, talleres grupales, ceremonias y celebraciones.
                    Capacidad para más de 30 personas.
                  </p>
                </div>
                <Link
                  href="/reservar"
                  className="shrink-0 flex items-center gap-2 px-7 py-3.5 bg-[#C4A882] text-[#2C1810] rounded-full font-semibold hover:bg-[#F0EAD6] transition-colors"
                >
                  Reservar La Cabanya
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ALOJAMIENTO ─── */}
      <section className="py-20 px-6 bg-[#2A3F24] text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-4">
            Alojamiento
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#F0EAD6] mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Quédate a dormir
          </h2>
          <p className="text-[#E8DCC8]/70 mb-3 leading-relaxed">
            <strong className="text-[#E8DCC8]">Alojamiento + desayuno</strong> — 45€/noche por persona
          </p>
          <p className="text-[#E8DCC8]/70 mb-8 leading-relaxed">
            <strong className="text-[#E8DCC8]">Alojamiento + media pensión</strong> — 60€/noche por persona
          </p>
          <p className="text-[#E8DCC8]/50 text-sm mb-8 max-w-lg mx-auto">
            La pensión completa se ofrece únicamente en los Retiros organizados.
            Al mediodía puedes cocinarte en la casa o explorar los alrededores — muy aconsejable.
          </p>
          <Link
            href="/reservar"
            className="inline-block px-10 py-4 bg-[#C4A882] text-[#2C1810] rounded-full font-semibold text-lg hover:bg-[#F0EAD6] transition-colors"
          >
            Consultar disponibilidad
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 px-6 bg-[#2C1810] text-center text-xs text-[#E8DCC8]/40">
        © {new Date().getFullYear()} Mas Besaura · Vidrà, Girona. Todos los derechos reservados.
      </footer>
    </div>
  );
}
