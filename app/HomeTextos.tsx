"use client";

import Link from "next/link";
import {
  Users,
  Flame,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

export function HomeHeroTextos() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
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
        {tx.home_hero_subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/alojamiento"
          className="px-8 py-3.5 bg-[#F0EAD6] text-[#2C1810] rounded-full font-medium hover:bg-white transition-colors"
        >
          {tx.home_hero_cta_alojamiento}
        </Link>
        <Link
          href="/la-casa"
          className="px-8 py-3.5 border border-[#F0EAD6]/50 text-[#F0EAD6] rounded-full font-medium hover:border-[#F0EAD6] transition-colors"
        >
          {tx.home_hero_cta_casa}
        </Link>
      </div>
    </div>
  );
}

export function HomeHeroScroll() {
  return (
    <a
      href="#proposito"
      className="absolute bottom-16 z-10 text-[#F0EAD6]/60 hover:text-[#F0EAD6] transition-colors animate-bounce"
    >
      <ChevronDown size={28} />
    </a>
  );
}

export function HomeProposito() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  const features = [
    {
      icon: <Flame size={16} className="text-[#8B6914] shrink-0 mt-0.5" />,
      label: tx.home_proposito_feat1,
    },
    {
      icon: <HeartHandshake size={16} className="text-[#4A6741] shrink-0 mt-0.5" />,
      label: tx.home_proposito_feat2,
    },
    {
      icon: <Sparkles size={16} className="text-[#C4A882] shrink-0 mt-0.5" />,
      label: tx.home_proposito_feat3,
    },
  ];

  return (
    <div>
      <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
        {tx.home_proposito_label}
      </p>
      <h2
        className="text-4xl md:text-5xl text-[#2C1810] leading-tight mb-6"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {tx.home_proposito_title}
      </h2>
      <p className="text-[#2C1810]/70 leading-relaxed mb-4">
        {tx.home_proposito_p1}
      </p>
      <p className="text-[#2C1810]/70 leading-relaxed mb-8">
        {tx.home_proposito_p2}
      </p>
      <div className="flex flex-col gap-4 pt-6 border-t border-[#E8DCC8]">
        {features.map(({ icon, label }) => (
          <div key={label} className="flex items-start gap-3">
            {icon}
            <span className="text-sm text-[#2C1810]/75 uppercase tracking-wide font-medium leading-snug">
              + {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeActividades() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  const items = [
    {
      icon: <Flame size={32} className="text-[#8B6914]" />,
      title: tx.home_act_retiros_title,
      description: tx.home_act_retiros_desc,
      tags: [tx.home_act_retiros_tag1, tx.home_act_retiros_tag2],
    },
    {
      icon: <Users size={32} className="text-[#4A6741]" />,
      title: tx.home_act_familiar_title,
      description: tx.home_act_familiar_desc,
      tags: [tx.home_act_familiar_tag1, tx.home_act_familiar_tag2],
    },
    {
      icon: <HeartHandshake size={32} className="text-[#C4A882]" />,
      title: tx.home_act_talleres_title,
      description: tx.home_act_talleres_desc,
      tags: [tx.home_act_talleres_tag1, tx.home_act_talleres_tag2],
    },
  ];

  return (
    <>
      <div className="text-center mb-16">
        <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
          {tx.home_act_label}
        </p>
        <h2
          className="text-4xl md:text-5xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {tx.home_act_title1}
          <br />
          {tx.home_act_title2}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {items.map(({ icon, title, description, tags }) => (
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
    </>
  );
}

export function HomeActividadesCTA() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <div className="relative z-10 text-center px-6 max-w-2xl">
      <p className="text-[#C4A882] text-sm tracking-[0.25em] uppercase font-medium mb-4">
        {tx.home_actcta_label}
      </p>
      <h2
        className="text-4xl md:text-6xl text-[#F0EAD6] mb-6 leading-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {tx.home_actcta_title}
      </h2>
      <p className="text-[#E8DCC8]/80 text-lg mb-10 leading-relaxed">
        {tx.home_actcta_desc}
      </p>
      <Link
        href="/actividades"
        className="inline-block px-10 py-4 bg-[#F0EAD6] text-[#2C1810] rounded-full font-semibold text-lg hover:bg-white transition-colors"
      >
        {tx.home_actcta_btn}
      </Link>
    </div>
  );
}

export function HomeAlquilerCTA() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-4">
        {tx.home_alqcta_label}
      </p>
      <h2
        className="text-4xl md:text-5xl text-[#F0EAD6] mb-6 leading-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {tx.home_alqcta_title}
      </h2>
      <p className="text-[#E8DCC8]/70 text-lg mb-10 leading-relaxed">
        {tx.home_alqcta_desc}
      </p>
      <Link
        href="/alquiler"
        className="inline-block px-10 py-4 bg-[#C4A882] text-[#2C1810] rounded-full font-semibold text-lg hover:bg-[#F0EAD6] transition-colors"
      >
        {tx.home_alqcta_btn}
      </Link>
    </div>
  );
}

export function HomeFooter() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
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
            {tx.footer_desc}
          </p>
        </div>

        <div>
          <h4 className="text-[#F0EAD6] font-medium mb-4 uppercase tracking-wider text-xs">
            {tx.footer_contact}
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
              {tx.footer_location}
            </li>
            <li className="mt-4">
              <a
                href="https://maps.app.goo.gl/R5jGm9yANyER96e68"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C4A882] text-[#2C1810] rounded-full text-xs font-semibold hover:bg-[#F0EAD6] transition-colors"
              >
                <MapPin size={12} />
                {tx.footer_como_llegar}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#F0EAD6] font-medium mb-4 uppercase tracking-wider text-xs">
            {tx.footer_accesos}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/la-casa" className="hover:text-[#F0EAD6] transition-colors">
                {tx.nav_la_casa}
              </a>
            </li>
            <li>
              <a href="#actividades" className="hover:text-[#F0EAD6] transition-colors">
                {tx.footer_retiros}
              </a>
            </li>
            <li>
              <a href="#actividades" className="hover:text-[#F0EAD6] transition-colors">
                {tx.footer_talleres}
              </a>
            </li>
            <li>
              <a href="/reservar" className="hover:text-[#F0EAD6] transition-colors">
                {tx.footer_reservar}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-[#F0EAD6]/10 text-center text-xs text-[#E8DCC8]/40">
        © {new Date().getFullYear()} Mas Besaura · Vidrà, Girona. {tx.footer_rights}
      </div>
    </footer>
  );
}
