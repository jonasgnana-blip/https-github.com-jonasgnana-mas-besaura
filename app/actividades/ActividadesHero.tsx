"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

export default function ActividadesHero() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <div className="relative z-10 px-6 pb-12 max-w-6xl mx-auto w-full">
      <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-2">
        {tx.act_label}
      </p>
      <h1
        className="text-5xl md:text-6xl text-[#F0EAD6]"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {tx.act_title}
      </h1>
      <p className="text-[#E8DCC8]/80 text-lg mt-3 font-light">
        {tx.act_subtitle}
      </p>
    </div>
  );
}
