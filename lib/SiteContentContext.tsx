"use client";

import { createContext, useContext } from "react";

type SiteContent = Record<string, string>;

const SiteContentCtx = createContext<SiteContent>({});

export function SiteContentProvider({
  children,
  content,
}: {
  children: React.ReactNode;
  content: SiteContent;
}) {
  return (
    <SiteContentCtx.Provider value={content}>
      {children}
    </SiteContentCtx.Provider>
  );
}

/** Returns the DB override for `key_${lang}`, or `fallback`. */
export function useContentKey(
  key: string,
  lang: string,
  fallback: string,
): string {
  const ctx = useContext(SiteContentCtx);
  return ctx[`${key}_${lang}`] || ctx[key] || fallback;
}
