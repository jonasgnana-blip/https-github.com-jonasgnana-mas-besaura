"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const IMAGES = [
  { src: "/images/hero1.jpg", alt: "Retiro de meditación en el arco de piedra de Mas Besaura" },
  { src: "/images/hero2.jpg", alt: "Paseo entre árboles dorados en Mas Besaura" },
  { src: "/images/hero3.jpg", alt: "Vista aérea de Mas Besaura en invierno" },
  { src: "/images/hero4.jpg", alt: "Árbol dorado con montañas al fondo en Mas Besaura" },
  { src: "/images/hero5.jpg", alt: "Sala de retiros y meditación en Mas Besaura" },
];

const INTERVAL = 5000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % IMAGES.length;
      setPrev(current);
      setFading(true);
      setCurrent(next);
      const cleanup = setTimeout(() => {
        setPrev(null);
        setFading(false);
      }, 1400);
      return () => clearTimeout(cleanup);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Previous image — fades out */}
      {prev !== null && (
        <div
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: fading ? 0 : 1 }}
        >
          <Image
            src={IMAGES[prev].src}
            alt={IMAGES[prev].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}

      {/* Current image — fades in */}
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
        style={{ opacity: fading ? 1 : 1 }}
      >
        <Image
          src={IMAGES[current].src}
          alt={IMAGES[current].alt}
          fill
          priority={current === 0}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-[#1a1008]/55" />

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            aria-label={`Imagen ${i + 1}`}
            onClick={() => {
              setPrev(current);
              setFading(true);
              setCurrent(i);
              setTimeout(() => { setPrev(null); setFading(false); }, 1400);
            }}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === current ? "#F0EAD6" : "rgba(240,234,214,0.35)",
              transform: i === current ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
