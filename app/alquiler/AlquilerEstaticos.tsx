"use client";

import { Check, Clock, Users, PawPrint, Volume2, Sparkles, CalendarX } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

// Traducciones específicas de la página estática de alquiler
const INCLUYE_ES = [
  { titulo: "Alojamiento", desc: "3 habitaciones de 4 plazas cada una" },
  { titulo: "Pensión Completa", desc: "Comida saludable con productos de proximidad" },
  { titulo: "Sala Interior", desc: "26 m² para talleres y grupos reducidos" },
  { titulo: "La Cabanya", desc: "350 m² de sala exterior con arco de piedra" },
  { titulo: "Jardín y Naturaleza", desc: "Hayedos, ríos y cascadas a tu disposición" },
  { titulo: "Cocina Equipada", desc: "Opción vegetariana siempre disponible" },
];

const INCLUYE_CA = [
  { titulo: "Allotjament", desc: "3 habitacions de 4 places cadascuna" },
  { titulo: "Pensió Completa", desc: "Menjar saludable amb productes de proximitat" },
  { titulo: "Sala Interior", desc: "26 m² per a tallers i grups reduïts" },
  { titulo: "La Cabanya", desc: "350 m² de sala exterior amb arc de pedra" },
  { titulo: "Jardí i Natura", desc: "Fagedes, rius i cascades a la teva disposició" },
  { titulo: "Cuina Equipada", desc: "Opció vegetariana sempre disponible" },
];

const POLITICA_ES = [
  "Reserva con el 50% del importe total.",
  "Devolución íntegra hasta 2 meses antes.",
  "Devolución del 50% hasta 1 mes antes.",
  "Sin devolución a menos de 1 mes.",
];

const POLITICA_CA = [
  "Reserva amb el 50% de l'import total.",
  "Devolució íntegra fins a 2 mesos abans.",
  "Devolució del 50% fins a 1 mes abans.",
  "Sense devolució a menys d'1 mes.",
];

export function AlquilerHeroTextos() {
  const { lang } = useLanguage();
  const isCA = lang === "ca";
  return (
    <>
      <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-2">
        {isCA ? "Retirs · Esdeveniments · Grups" : "Retiros · Eventos · Grupos"}
      </p>
      <h1
        className="text-5xl md:text-6xl text-[#F0EAD6]"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {isCA ? "Lloguer Casa per a Retirs" : "Alquiler Casa para Retiros"}
      </h1>
      <p className="text-[#E8DCC8]/80 text-lg mt-3 font-light">
        {isCA ? "El teu espai per crear junts" : "Tu espacio para crear juntos"}
      </p>
    </>
  );
}

export function AlquilerDescripcion() {
  const { lang } = useLanguage();
  const isCA = lang === "ca";
  return (
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
        {isCA ? "La proposta" : "La propuesta"}
      </p>
      <h2
        className="text-3xl md:text-4xl text-[#2C1810] mb-6"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {isCA ? "Un espai íntegre per a tu i el teu grup" : "Un espacio íntegro para ti y tu grupo"}
      </h2>
      <p className="text-[#2C1810]/70 leading-relaxed mb-4">
        {isCA
          ? "Lloga la casa per a les teves activitats professionals o trobades en grup. Tres habitacions de 4 places cadascuna. Possibilitat de càmping."
          : "Alquila la casa para tus actividades profesionales o encuentros en grupo. Tres habitaciones de 4 plazas cada una. Posibilidad de camping."}
      </p>
      <p className="text-[#2C1810] text-2xl font-medium mt-8 mb-2">
        80€/{isCA ? "persona" : "persona"}/dia
      </p>
      <p className="text-[#2C1810]/60 text-sm mb-4">
        {isCA
          ? "Inclou allotjament, pensió completa, sala exterior i interior."
          : "Incluye alojamiento, pensión completa, sala exterior e interior."}
      </p>
      <p className="text-[#2C1810]/60 text-sm">
        {isCA
          ? "Menjar saludable amb productes de proximitat. Opció vegetariana."
          : "Comida saludable con productos de proximidad. Opción vegetariana."}
      </p>
    </div>
  );
}

export function AlquilerIncluyeSection() {
  const { lang } = useLanguage();
  const isCA = lang === "ca";
  const items = isCA ? INCLUYE_CA : INCLUYE_ES;
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
          {isCA ? "Tot inclòs" : "Todo incluido"}
        </p>
        <h2
          className="text-3xl md:text-4xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {isCA ? "El que trobaràs" : "Lo que encontrarás"}
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.titulo}
            className="bg-[#FAFAF6] rounded-2xl p-6 flex gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-[#4A6741]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check size={16} className="text-[#4A6741]" />
            </div>
            <div>
              <h3
                className="text-base text-[#2C1810] mb-1"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {item.titulo}
              </h3>
              <p className="text-[#2C1810]/60 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlquilerPoliticaSection() {
  const { lang } = useLanguage();
  const isCA = lang === "ca";
  const items = isCA ? POLITICA_CA : POLITICA_ES;
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
          {isCA ? "Condicions" : "Condiciones"}
        </p>
        <h2
          className="text-3xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {isCA ? "Política de cancel·lació" : "Política de cancelación"}
        </h2>
      </div>

      <div className="bg-[#F0EAD6] rounded-2xl p-8 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#C4A882]/30 text-[#8B6914] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-[#2C1810]/75 text-sm leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlquilerCondicionesSection() {
  const { lang } = useLanguage();
  const isCA = lang === "ca";

  const condiciones = isCA
    ? [
        {
          icon: <Clock size={18} className="text-[#4A6741]" />,
          titulo: "Entrada i sortida",
          desc: "Entrada a partir de les 16:00h · Sortida fins les 12:00h",
        },
        {
          icon: <CalendarX size={18} className="text-[#4A6741]" />,
          titulo: "Estada mínima",
          desc: "2 nits en caps de setmana · 3 nits en temporada alta",
        },
        {
          icon: <Users size={18} className="text-[#4A6741]" />,
          titulo: "Capacitat",
          desc: "Fins a 12 persones en habitacions · Zona de càmping disponible",
        },
        {
          icon: <PawPrint size={18} className="text-[#4A6741]" />,
          titulo: "Mascotes",
          desc: "Consultar prèviament · Acceptades amb condicions",
        },
        {
          icon: <Volume2 size={18} className="text-[#4A6741]" />,
          titulo: "Silenci",
          desc: "Respectar el silenci a partir de les 23:00h",
        },
        {
          icon: <Sparkles size={18} className="text-[#4A6741]" />,
          titulo: "Neteja",
          desc: "Neteja final inclosa al preu · Deixar la casa en ordre",
        },
      ]
    : [
        {
          icon: <Clock size={18} className="text-[#4A6741]" />,
          titulo: "Entrada y salida",
          desc: "Entrada a partir de las 16:00h · Salida antes de las 12:00h",
        },
        {
          icon: <CalendarX size={18} className="text-[#4A6741]" />,
          titulo: "Estancia mínima",
          desc: "2 noches en fines de semana · 3 noches en temporada alta",
        },
        {
          icon: <Users size={18} className="text-[#4A6741]" />,
          titulo: "Capacidad",
          desc: "Hasta 12 personas en habitaciones · Zona de camping disponible",
        },
        {
          icon: <PawPrint size={18} className="text-[#4A6741]" />,
          titulo: "Mascotas",
          desc: "Consultar previamente · Aceptadas con condiciones",
        },
        {
          icon: <Volume2 size={18} className="text-[#4A6741]" />,
          titulo: "Silencio",
          desc: "Respetar el silencio a partir de las 23:00h",
        },
        {
          icon: <Sparkles size={18} className="text-[#4A6741]" />,
          titulo: "Limpieza",
          desc: "Limpieza final incluida en el precio · Dejar la casa en orden",
        },
      ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
          {isCA ? "Normes de la casa" : "Normas de la casa"}
        </p>
        <h2
          className="text-3xl md:text-4xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {isCA ? "Condicions d'estada" : "Condiciones de estancia"}
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {condiciones.map((c) => (
          <div
            key={c.titulo}
            className="bg-white rounded-2xl p-6 flex gap-4 border border-[#E8DCC8]/60 shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-[#4A6741]/10 flex items-center justify-center shrink-0 mt-0.5">
              {c.icon}
            </div>
            <div>
              <h3
                className="text-sm font-semibold text-[#2C1810] mb-1"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {c.titulo}
              </h3>
              <p className="text-[#2C1810]/60 text-xs leading-relaxed">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlquilerReservaHeader() {
  const { lang } = useLanguage();
  const isCA = lang === "ca";
  return (
    <div className="text-center mb-10">
      <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
        {isCA ? "Reserva" : "Reserva"}
      </p>
      <h2
        className="text-3xl text-[#2C1810]"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {isCA ? "Quan i amb qui?" : "¿Cuándo y con quién?"}
      </h2>
    </div>
  );
}

export function AlquilerFooterTextos() {
  const { lang } = useLanguage();
  const isCA = lang === "ca";
  return (
    <>
      {isCA ? "Com arribar" : "Cómo llegar"}
    </>
  );
}
