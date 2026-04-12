"use client";

import { useState } from "react";

type Foto = { src: string; alt: string };

export default function LaCasaGallery({ fotos }: { fotos: Foto[] }) {
  const [current, setCurrent] = useState(0);

  if (!fotos.length) return null;

  return (
    <div className="mt-14">
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {fotos.map((f, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-full md:w-[calc(50%-8px)] aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setCurrent(i)}
          >
            <img
              src={f.src}
              alt={f.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/arch-sunset.jpg";
              }}
            />
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-[#2C1810]/40 mt-3 tracking-wide uppercase">
        La Cabanya · Sala exterior 350 m²
      </p>
    </div>
  );
}
