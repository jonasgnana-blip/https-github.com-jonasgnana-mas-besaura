"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlider({
  images,
  alt,
  className = "",
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const total = images.length;

  if (total === 0) return null;
  if (total === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        className={`w-full h-full object-cover object-center ${className}`}
      />
    );
  }

  function prev() { setIdx((i) => (i - 1 + total) % total); }
  function next() { setIdx((i) => (i + 1) % total); }

  return (
    <div className="relative w-full h-full group">
      <img
        src={images[idx]}
        alt={`${alt} — ${idx + 1}/${total}`}
        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${className}`}
      />

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Foto ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === idx ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
