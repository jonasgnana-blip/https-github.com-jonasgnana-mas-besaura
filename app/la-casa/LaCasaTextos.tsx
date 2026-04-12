"use client";

import Link from "next/link";
import { Bed, Users, Flame } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

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

export function LaCasaHabitaciones() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  const habitaciones = [
    {
      nombre: tx.lacasa_artemisa_nombre,
      descripcion: tx.lacasa_artemisa_desc_real,
      capacidad: tx.lacasa_artemisa_cap_real,
      imagen: "/images/hab-artemisa.jpg",
    },
    {
      nombre: tx.lacasa_selene_nombre,
      descripcion: tx.lacasa_selene_desc_real,
      capacidad: tx.lacasa_selene_cap_real,
      imagen: "/images/hab-selene.jpg",
    },
    {
      nombre: tx.lacasa_hecate_nombre,
      descripcion: tx.lacasa_hecate_desc_real,
      capacidad: tx.lacasa_hecate_cap_real,
      imagen: "/images/hab-hecate.jpg",
    },
  ];

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
