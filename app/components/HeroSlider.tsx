"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Slide =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string };

const SLIDES: Slide[] = [
  { type: "image", src: "/images/hero1.jpg", alt: "Grupo de meditación bajo el arco de piedra de Mas Besaura" },
  { type: "image", src: "/images/hero7.jpg", alt: "Meditación con vistas a las montañas del Pirineo" },
  { type: "video", src: "/videos/video1.mp4" },
  { type: "image", src: "/images/hero8.jpg", alt: "Atardecer entre ramas y montañas nevadas" },
  { type: "image", src: "/images/hero9.jpg", alt: "Pareja disfrutando de la naturaleza en Mas Besaura" },
  { type: "video", src: "/videos/video2.mp4" },
  { type: "image", src: "/images/hero2.jpg", alt: "Paseo entre árboles dorados en otoño" },
  { type: "image", src: "/images/hero6.jpg", alt: "Árbol con muérdago dorado en el campo" },
  { type: "video", src: "/videos/video3.mp4" },
  { type: "image", src: "/images/hero3.jpg", alt: "Vista aérea de Mas Besaura en invierno" },
  { type: "image", src: "/images/hero4.jpg", alt: "Árbol solitario con cielo azul y montañas" },
  { type: "image", src: "/images/hero5.jpg", alt: "Sala de retiros y meditación interior" },
];

const IMAGE_DURATION = 5000;
const VIDEO_MAX_DURATION = 12000;
const FADE_DURATION = 1400;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(0); // what's actually shown (lags behind during fade)
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((next: number) => {
    setFading(true);
    setCurrent(next);
    setTimeout(() => {
      setVisible(next);
      setFading(false);
    }, FADE_DURATION);
  }, []);

  const advance = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  // Schedule auto-advance for images; videos handle themselves
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const slide = SLIDES[current];
    if (slide.type === "image") {
      timerRef.current = setTimeout(advance, IMAGE_DURATION);
    } else {
      // Fallback: advance after max duration in case video stalls
      timerRef.current = setTimeout(advance, VIDEO_MAX_DURATION);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, advance]);

  // Play video when it becomes visible
  useEffect(() => {
    if (SLIDES[visible].type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [visible]);

  const handleVideoEnd = () => advance();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Previous slide — fades out */}
      {fading && (
        <div
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{ opacity: 0, transitionDuration: `${FADE_DURATION}ms` }}
        >
          <SlideContent slide={SLIDES[visible]} videoRef={null} onVideoEnd={() => {}} />
        </div>
      )}

      {/* Current slide — always visible, fades in */}
      <div
        className="absolute inset-0 transition-opacity ease-in-out"
        style={{
          opacity: fading ? 0 : 1,
          transitionDuration: `${FADE_DURATION}ms`,
        }}
      >
        <SlideContent
          slide={SLIDES[current]}
          videoRef={SLIDES[current].type === "video" ? videoRef : null}
          onVideoEnd={handleVideoEnd}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#1a1008]/50" />

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 flex-wrap justify-center max-w-xs">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: slide.type === "video" ? "20px" : "6px",
              height: "6px",
              background: i === current ? "#F0EAD6" : "rgba(240,234,214,0.35)",
              transform: i === current && slide.type === "image" ? "scaleY(1.3)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SlideContent({
  slide,
  videoRef,
  onVideoEnd,
}: {
  slide: Slide;
  videoRef: React.RefObject<HTMLVideoElement | null> | null;
  onVideoEnd: () => void;
}) {
  if (slide.type === "video") {
    return (
      <video
        ref={videoRef ?? undefined}
        src={slide.src}
        autoPlay
        muted
        playsInline
        onEnded={onVideoEnd}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    );
  }
  return (
    <Image
      src={slide.src}
      alt={slide.alt}
      fill
      sizes="100vw"
      className="object-cover object-center"
      priority={slide.src === "/images/hero1.jpg"}
    />
  );
}
