"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const tr = getT(lang);

  const NAV_LINKS = [
    { label: tr.nav_la_casa, href: "/la-casa" },
    { label: tr.nav_alojamiento, href: "/alojamiento" },
    { label: tr.nav_actividades, href: "/actividades" },
    { label: tr.nav_alquiler, href: "/alquiler" },
  ];

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF6]/90 backdrop-blur-sm border-b border-[#E8DCC8] h-16">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl tracking-wide text-[#2C1810] hover:text-[#4A6741] transition-colors"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Mas Besaura
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#4A6741] font-medium tracking-wide">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#2C1810] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/alojamiento"
              className="px-5 py-2 bg-[#4A6741] text-[#F0EAD6] rounded-full hover:bg-[#3A5432] transition-colors text-sm"
            >
              {tr.nav_reservar}
            </Link>

            {/* Language toggle */}
            <div className="flex items-center gap-1 text-xs text-[#4A6741]/70 border border-[#E8DCC8] rounded-full px-2.5 py-1">
              <button
                onClick={() => setLang("es")}
                className={`transition-colors ${
                  lang === "es"
                    ? "font-bold text-[#2C1810]"
                    : "hover:text-[#2C1810]"
                }`}
                aria-label="Castellano"
              >
                ES
              </button>
              <span className="text-[#4A6741]/30">|</span>
              <button
                onClick={() => setLang("ca")}
                className={`transition-colors ${
                  lang === "ca"
                    ? "font-bold text-[#2C1810]"
                    : "hover:text-[#2C1810]"
                }`}
                aria-label="Català"
              >
                CA
              </button>
            </div>
          </nav>

          {/* Mobile: lang toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {/* Language toggle mobile */}
            <div className="flex items-center gap-1 text-xs text-[#4A6741]/70 border border-[#E8DCC8] rounded-full px-2 py-0.5">
              <button
                onClick={() => setLang("es")}
                className={`transition-colors ${
                  lang === "es" ? "font-bold text-[#2C1810]" : "hover:text-[#2C1810]"
                }`}
                aria-label="Castellano"
              >
                ES
              </button>
              <span className="text-[#4A6741]/30">|</span>
              <button
                onClick={() => setLang("ca")}
                className={`transition-colors ${
                  lang === "ca" ? "font-bold text-[#2C1810]" : "hover:text-[#2C1810]"
                }`}
                aria-label="Català"
              >
                CA
              </button>
            </div>

            <button
              className="p-2 text-[#4A6741] hover:text-[#2C1810] transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden bg-[#FAFAF6] border-b border-[#E8DCC8] px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-[#4A6741] font-medium hover:text-[#2C1810] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/alojamiento"
              onClick={() => setOpen(false)}
              className="inline-block px-5 py-2 bg-[#4A6741] text-[#F0EAD6] rounded-full hover:bg-[#3A5432] transition-colors text-sm font-medium text-center"
            >
              {tr.nav_reservar}
            </Link>
          </div>
        )}
      </header>

      {/* ─── WHATSAPP FLOATING BUTTON ─── */}
      <a
        href="https://wa.me/34665822542"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#4A6741] hover:bg-[#3A5432] text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <Phone size={24} />
      </a>
    </>
  );
}
