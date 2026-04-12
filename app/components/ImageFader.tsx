"use client";

import { useEffect, useState } from "react";

// Fallback static images used only when no DB images are configured
const FALLBACK_IMAGES = [
  "/images/cabanya-meditacion.jpg",
  "/images/paisaje-niebla.jpg",
  "/images/terraza-montanas.jpg",
  "/images/cabanya-noche.jpg",
  "/images/pareja-montanas.jpg",
  "/images/terraza-meditacion.jpg",
  "/images/amanecer-montana.jpg",
  "/images/bosque-otono.jpg",
  "/images/arbol-primavera.jpg",
].filter(Boolean);

interface ImageFaderProps {
  className?: string;
  images?: string[];
}

export default function ImageFader({ className = "", images }: ImageFaderProps) {
  const list = (images && images.length > 0 ? images : FALLBACK_IMAGES).filter(Boolean);
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(Math.min(1, list.length - 1));
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (list.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % list.length);
        setNext((n) => (n + 1) % list.length);
        setFading(false);
      }, 1200);
    }, 5000);
    return () => clearInterval(interval);
  }, [list.length]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <img
        key={`cur-${current}`}
        src={list[current]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <img
        key={`next-${next}`}
        src={list[next]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out"
        style={{ opacity: fading ? 1 : 0 }}
      />
    </div>
  );
}
