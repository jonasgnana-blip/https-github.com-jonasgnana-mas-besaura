"use client";

import { useLanguage } from "@/lib/LanguageContext";

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key++} className="list-disc list-inside space-y-1 text-[#2C1810]/70 text-sm mb-4 pl-1">
        {listItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
    listItems = [];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();

    // List item
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    // Flush pending list
    flushList();

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Bold header: **text**
    const boldMatch = line.match(/^\*\*(.+?)\*\*$/);
    if (boldMatch) {
      elements.push(
        <h3
          key={key++}
          className="text-base font-semibold text-[#2C1810] mt-6 mb-1.5 first:mt-0"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {boldMatch[1]}
        </h3>
      );
      continue;
    }

    // Regular paragraph (may contain inline bold)
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      const m = part.match(/^\*\*(.+?)\*\*$/);
      return m ? <strong key={i}>{m[1]}</strong> : part;
    });
    elements.push(
      <p key={key++} className="text-[#2C1810]/70 text-sm leading-relaxed mb-2">
        {parts}
      </p>
    );
  }

  flushList();
  return elements;
}

export default function EstanciaContent({
  textoEs,
  textoCa,
}: {
  textoEs: string;
  textoCa: string;
}) {
  const { lang } = useLanguage();
  const texto = lang === "ca" ? textoCa : textoEs;

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl border border-[#E8DCC8] p-8 md:p-12 shadow-sm">
        {renderMarkdown(texto)}
      </div>
    </section>
  );
}
