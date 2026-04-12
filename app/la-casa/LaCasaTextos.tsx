"use client";

import Link from "next/link";
import { Bed, Users, Flame, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";
import { useState } from "react";

export function LaCasaIntro() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <section className="py-16 px-6 max-w-3xl mx-auto text-center">
      <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
        {tx.lacasa_intro_label}
      </p>
      <p className="text-[#2C1810]/75 text-lg leading-relaxed">
        {tx.lacasa_intro}
      </p>
    </section>
  );
}

type HabDB = {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  imagenes: string[];
};

// Fallback images keyed by room name fragments (for before any image is uploaded)
const FALLBACK_IMAGES: Record<string, string> = {
  artemisa: "/images/hab-artemisa.jpg",
  selene: "/images/hab-selene.jpg",
  hecate: "/images/hab-hecate.jpg",
  hécate: "/images/hab-hecate.jpg",
};

function getFallback(nombre: string) {
  const key = Object.keys(FALLBACK_IMAGES).find((k) =>
    nombre.toLowerCase().includes(k)
  );
  return key ? FALLBACK_IMAGES[key] : "/images/hero3.jpg";
}

export function LaCasaHabitaciones({ habitaciones: habsDB = [] }: { habitaciones?: HabDB[] }) {
  const { lang } = useLanguage();
  const tx = getT(lang);

  // Translation map: match DB room name to i18n keys
  const txMap: Record<string, { desc: string; cap: string }> = {
    artemisa: { desc: tx.lacasa_artemisa_desc_real, cap: tx.lacasa_artemisa_cap_real },
    selene:   { desc: tx.lacasa_selene_desc_real,   cap: tx.lacasa_selene_cap_real   },
    hecate:   { desc: tx.lacasa_hecate_desc_real,   cap: tx.lacasa_hecate_cap_real   },
    hécate:   { desc: tx.lacasa_hecate_desc_real,   cap: tx.lacasa_hecate_cap_real   },
  };

  const habitaciones = habsDB.map((h) => {
    const key = Object.keys(txMap).find((k) => h.nombre.toLowerCase().includes(k));
    return {
      nombre: h.nombre,
      // Use translated desc if available, else DB description
      descripcion: key ? txMap[key].desc : h.descripcion,
      capacidad: key ? txMap[key].cap : `${h.capacidad} pers.`,
      // First image from DB, or fallback static path
      imagen: h.imagenes?.[0] || getFallback(h.nombre),
    };
  });

  return (
    <section className="py-12 px-6 bg-[#F0EAD6]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
            {tx.lacasa_rooms_label}
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {tx.lacasa_rooms_title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {habitaciones.map((hab) => (
            <div
              key={hab.nombre}
              className="bg-[#FAFAF6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={hab.imagen}
                  alt={hab.nombre}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/hero3.jpg";
                  }}
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
  );
}

export function LaCasaEspacios() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  const espacios = [
    {
      nombre: tx.lacasa_salon_nombre,
      subtitulo: tx.lacasa_salon_sub,
      descripcion: tx.lacasa_salon_desc,
      imagen: "/images/comedor-sala.jpg",
      icon: <Users size={20} className="text-[#4A6741]" />,
    },
    {
      nombre: tx.lacasa_esp_habs_nombre,
      subtitulo: tx.lacasa_esp_habs_sub,
      descripcion: tx.lacasa_esp_habs_desc,
      imagen: "/images/hab-hecate.jpg",
      icon: <Bed size={20} className="text-[#C4A882]" />,
    },
    {
      nombre: tx.lacasa_sala_estar_nombre,
      subtitulo: tx.lacasa_sala_estar_sub,
      descripcion: tx.lacasa_sala_estar_desc,
      imagen: "/images/distribuidor.jpg",
      icon: <Flame size={20} className="text-[#8B6914]" />,
    },
  ];

  return (
    <>
      <div className="text-center mb-12">
        <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
          {tx.lacasa_espacios_label}
        </p>
        <h2
          className="text-3xl md:text-4xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {tx.lacasa_espacios_title}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {espacios.map((espacio) => (
          <div key={espacio.nombre} className="group">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative">
              <img
                src={espacio.imagen}
                alt={espacio.nombre}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/hero2.jpg";
                }}
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
    </>
  );
}

export function LaCasaCalendario() {
  const { lang } = useLanguage();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const MONTHS_CA = ["Gener","Febrer","Març","Abril","Maig","Juny","Juliol","Agost","Setembre","Octubre","Novembre","Desembre"];
  const DAYS_ES = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];
  const DAYS_CA = ["Dl","Dt","Dc","Dj","Dv","Ds","Dg"];

  const months = lang === "ca" ? MONTHS_CA : MONTHS_ES;
  const days = lang === "ca" ? DAYS_CA : DAYS_ES;

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  // Adjust: week starts Monday (0=Mon)
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isPast = (d: number) => {
    const date = new Date(year, month, d);
    const t = new Date(); t.setHours(0,0,0,0);
    return date < t;
  };

  return (
    <section className="py-16 px-6 bg-[#F0EAD6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
            {lang === "ca" ? "Disponibilitat" : "Disponibilidad"}
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#2C1810] mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {lang === "ca" ? "Reserva la teva estada" : "Reserva tu estancia"}
          </h2>
          <p className="text-[#2C1810]/60 text-sm">
            {lang === "ca"
              ? "Consulta disponibilitat i reserva en línia"
              : "Consulta disponibilidad y reserva en línea"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-[#F0EAD6] transition-colors text-[#2C1810]/60"
              >
                <ChevronLeft size={18} />
              </button>
              <span
                className="text-[#2C1810] font-medium"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {months[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-[#F0EAD6] transition-colors text-[#2C1810]/60"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {days.map(d => (
                <div key={d} className="text-center text-xs text-[#2C1810]/40 font-medium py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((cell, i) => (
                <div
                  key={i}
                  className={`
                    aspect-square flex items-center justify-center rounded-full text-sm
                    ${cell === null ? "" : isPast(cell)
                      ? "text-[#2C1810]/25 cursor-not-allowed"
                      : "text-[#2C1810] hover:bg-[#4A6741] hover:text-white cursor-pointer transition-colors"
                    }
                    ${cell === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                      ? "ring-2 ring-[#4A6741] font-semibold"
                      : ""
                    }
                  `}
                >
                  {cell}
                </div>
              ))}
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex flex-col justify-center gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={20} className="text-[#4A6741]" />
                <span className="text-[#2C1810]/60 text-sm uppercase tracking-wide font-medium">
                  {lang === "ca" ? "Preu per persona" : "Precio por persona"}
                </span>
              </div>
              <div
                className="text-5xl text-[#2C1810] font-bold mb-1"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                10€
              </div>
              <p className="text-[#2C1810]/50 text-sm">
                {lang === "ca" ? "/ persona · nit" : "/ persona · noche"}
              </p>
            </div>

            <div className="bg-[#2A3F24] rounded-2xl p-6 text-white">
              <p className="text-[#E8DCC8]/80 text-sm mb-4 leading-relaxed">
                {lang === "ca"
                  ? "Inclou accés als espais comuns, jardins i terrassa. Esmorzar i mitja pensió disponibles."
                  : "Incluye acceso a espacios comunes, jardines y terraza. Desayuno y media pensión disponibles."}
              </p>
              <Link
                href="/alojamiento"
                className="block text-center px-6 py-3 bg-[#C4A882] text-[#2C1810] rounded-full font-semibold hover:bg-[#F0EAD6] transition-colors text-sm"
              >
                {lang === "ca" ? "Reservar ara" : "Reservar ahora"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LaCasaCTA() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <section className="py-20 px-6 bg-[#2A3F24] text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-4">
          {tx.lacasa_cta_label}
        </p>
        <h2
          className="text-3xl md:text-4xl text-[#F0EAD6] mb-6"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {tx.lacasa_cta_title2}
        </h2>
        <p className="text-[#E8DCC8]/70 mb-3 leading-relaxed">
          <strong className="text-[#E8DCC8]">{lang === "ca" ? "Allotjament + esmorzar" : "Alojamiento + desayuno"}</strong>{" "}
          — {lang === "ca" ? "35€/nit per persona" : "35€/noche por persona"}
        </p>
        <p className="text-[#E8DCC8]/70 mb-8 leading-relaxed">
          <strong className="text-[#E8DCC8]">{lang === "ca" ? "Allotjament + mitja pensió" : "Alojamiento + media pensión"}</strong>{" "}
          — {lang === "ca" ? "50€/nit per persona" : "50€/noche por persona"}
        </p>
        <p className="text-[#E8DCC8]/50 text-sm mb-8 max-w-lg mx-auto">
          {tx.lacasa_cta_nota}
        </p>
        <Link
          href="/alojamiento"
          className="inline-block px-10 py-4 bg-[#C4A882] text-[#2C1810] rounded-full font-semibold text-lg hover:bg-[#F0EAD6] transition-colors"
        >
          {tx.lacasa_cta_btn}
        </Link>
      </div>
    </section>
  );
}

export function LaCasaFooter() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <footer className="py-8 px-6 bg-[#2C1810] text-center text-xs text-[#E8DCC8]/40">
      © {new Date().getFullYear()} Mas Besaura · Vidrà, Girona. {tx.footer_rights_short}
    </footer>
  );
}
