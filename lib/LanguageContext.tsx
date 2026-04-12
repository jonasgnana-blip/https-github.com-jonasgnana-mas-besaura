"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Lang } from "./i18n";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "es",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  // Lee de localStorage al montar (solo en el cliente)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mb_lang") as Lang | null;
      if (stored === "es" || stored === "ca") {
        setLangState(stored);
      }
    } catch {
      // localStorage no disponible (SSR safety)
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem("mb_lang", l);
    } catch {
      // silently ignore
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}
