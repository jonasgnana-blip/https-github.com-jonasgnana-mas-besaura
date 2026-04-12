"use client";

import { useEffect, useState } from "react";

const IMAGES = [
  "/images/masia-snow.jpg",
  "/images/bano.jpg",
  "/images/hero3.jpg",
  "/images/comida-1.jpg",
  "/images/hero2.jpg",
  "/images/arch-sunset.jpg",
  "/images/comida-2.jpg",
  "/images/hero7.jpg",
  "/images/decoracion.jpg",
  "/images/arch-moon.jpg",
  "/images/comida-3.jpg",
  "/images/hero5.jpg",
  "/images/hero8.jpg",
].filter(Boolean);

interface ImageFaderProps {
  className?: string;
}

export default function ImageFader({ className = "" }: ImageFaderProps) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % IMAGES.length);
        setNext((n) => (n + 1) % IMAGES.length);
        setFading(false);
      }, 1200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Current image — always visible */}
      <img
        key={`cur-${current}`}
        src={IMAGES[current]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Next image fades in on top */}
      <img
        key={`next-${next}`}
        src={IMAGES[next]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out"
        style={{ opacity: fading ? 1 : 0 }}
      />
    </div>
  );
}
