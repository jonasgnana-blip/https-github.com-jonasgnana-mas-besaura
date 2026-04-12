"use client";

import Link from "next/link";
import { Bed, Users, Flame, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";
import { useState, useEffect } from "react";
import type { DateRange } from "@/app/actions/reservas";

// ── Shared date helpers ──────────────────────────────────────────────────────
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MONTHS_CA = ["Gener","Febrer","Març","Abril","Maig","Juny","Juliol","Agost","Setembre","Octubre","Novembre","Desembre"];
const DAYS_ES = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];
const DAYS_CA = ["Dl","Dt","Dc","Dj","Dv","Ds","Dg"];

function fmtDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function isPastDay(d: Date) { const t=new Date(); t.setHours(0,0,0,0); return d<t; }
function sameDay(a:Date,b:Date){ return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function isBetween(d:Date,s:Date,e:Date){ return d>s&&d<e; }
function nightsBetween(a:Date,b:Date){ return Math.round((b.getTime()-a.getTime())/86400000); }
function isUnavail(date:Date,ranges:DateRange[]){ const ds=fmtDate(date); return ranges.some(r=>ds>=r.entrada&&ds<r.salida); }

// ── Mini calendar month grid ─────────────────────────────────────────────────
function CalMes({ year, month, checkIn, checkOut, hovered, unavail, onDay, onHover, monthNames, dayNames }:{
  year:number; month:number; checkIn:Date|null; checkOut:Date|null; hovered:Date|null;
  unavail:DateRange[]; onDay:(d:Date)=>void; onHover:(d:Date|null)=>void;
  monthNames:string[]; dayNames:string[];
}) {
  const first = new Date(year,month,1);
  const offset = (first.getDay()+6)%7;
  const dim = new Date(year,month+1,0).getDate();
  const cells:(Date|null)[] = [];
  for(let i=0;i<offset;i++) cells.push(null);
  for(let d=1;d<=dim;d++) cells.push(new Date(year,month,d));

  const rangeEnd = checkOut ?? hovered;
  return (
    <div className="select-none">
      <div className="text-center text-sm font-medium text-[#2C1810] mb-3">{monthNames[month]} {year}</div>
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map(d=><div key={d} className="text-center text-[10px] text-[#2C1810]/40 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date,i)=>{
          if(!date) return <div key={`e${i}`}/>;
          const ds=fmtDate(date);
          const past=isPastDay(date), unav=isUnavail(date,unavail), disabled=past||unav;
          const isIn=checkIn&&sameDay(date,checkIn);
          const isOut=checkOut&&sameDay(date,checkOut);
          const inRange=checkIn&&rangeEnd&&!sameDay(checkIn,date)&&!sameDay(rangeEnd,date)&&isBetween(date,checkIn<rangeEnd?checkIn:rangeEnd,checkIn<rangeEnd?rangeEnd:checkIn);
          const isHov=hovered&&!checkOut&&checkIn&&sameDay(date,hovered)&&!sameDay(date,checkIn);
          let bg="", txt=disabled?"text-[#2C1810]/25":"text-[#2C1810]", rnd="rounded-full";
          if(isIn||isOut){bg="bg-[#4A6741]";txt="text-[#F0EAD6]";}
          else if(isHov&&!disabled){bg="bg-[#4A6741]/50";txt="text-[#FAFAF6]";}
          else if(inRange){bg="bg-[#4A6741]/15";rnd="rounded-none";}
          return (
            <div key={ds} className={`relative flex items-center justify-center ${inRange?bg:""} ${inRange?rnd:""}`}>
              <button disabled={disabled} onClick={()=>!disabled&&onDay(date)} onMouseEnter={()=>!disabled&&onHover(date)} onMouseLeave={()=>onHover(null)}
                className={`w-8 h-8 text-xs font-medium flex items-center justify-center transition-all
                  ${isIn||isOut||isHov?bg+" "+rnd:""}
                  ${!isIn&&!isOut&&!isHov&&!inRange?(disabled?"":"hover:bg-[#4A6741]/10 rounded-full"):""}
                  ${txt} ${disabled?"cursor-not-allowed":"cursor-pointer"}
                  ${unav&&!past?"line-through opacity-40":""}
                `}
              >{date.getDate()}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LaCasaIntro() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <section className="py-16 px-6 max-w-3xl mx-auto text-center">
      <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
        {tx.lacasa_intro_label}
      </p>
      <p className="text-[#2C1810]/75 text-lg leading-relaxed">
        {tx.lacasa_intro}
      </p>
    </section>
  );
}

type HabDB = {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  imagenes: string[];
};

// Fallback images keyed by room name fragments (for before any image is uploaded)
const FALLBACK_IMAGES: Record<string, string> = {
  artemisa: "/images/hab-artemisa.jpg",
  selene: "/images/hab-selene.jpg",
  hecate: "/images/hab-hecate.jpg",
  hécate: "/images/hab-hecate.jpg",
};

function getFallback(nombre: string) {
  const key = Object.keys(FALLBACK_IMAGES).find((k) =>
    nombre.toLowerCase().includes(k)
  );
  return key ? FALLBACK_IMAGES[key] : "/images/hero3.jpg";
}

export function LaCasaHabitaciones({ habitaciones: habsDB = [] }: { habitaciones?: HabDB[] }) {
  const { lang } = useLanguage();
  const tx = getT(lang);

  // Translation map: match DB room name to i18n keys
  const txMap: Record<string, { desc: string; cap: string }> = {
    artemisa: { desc: tx.lacasa_artemisa_desc_real, cap: tx.lacasa_artemisa_cap_real },
    selene:   { desc: tx.lacasa_selene_desc_real,   cap: tx.lacasa_selene_cap_real   },
    hecate:   { desc: tx.lacasa_hecate_desc_real,   cap: tx.lacasa_hecate_cap_real   },
    hécate:   { desc: tx.lacasa_hecate_desc_real,   cap: tx.lacasa_hecate_cap_real   },
  };

  const habitaciones = habsDB.map((h) => {
    const key = Object.keys(txMap).find((k) => h.nombre.toLowerCase().includes(k));
    return {
      nombre: h.nombre,
      // Use translated desc if available, else DB description
      descripcion: key ? txMap[key].desc : h.descripcion,
      capacidad: key ? txMap[key].cap : `${h.capacidad} pers.`,
      // First image from DB, or fallback static path
      imagen: h.imagenes?.[0] || getFallback(h.nombre),
    };
  });

  return (
    <section className="py-12 px-6 bg-[#F0EAD6]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
            {tx.lacasa_rooms_label}
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {tx.lacasa_rooms_title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {habitaciones.map((hab) => (
            <div
              key={hab.nombre}
              className="bg-[#FAFAF6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={hab.imagen}
                  alt={hab.nombre}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/hero3.jpg";
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="text-xl text-[#2C1810]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {hab.nombre}
                  </h3>
                  <span className="text-xs px-2.5 py-1 bg-[#E8DCC8] text-[#2C1810]/60 rounded-full flex items-center gap-1">
                    <Bed size={11} />
                    {hab.capacidad}
                  </span>
                </div>
                <p className="text-[#2C1810]/65 text-sm leading-relaxed">
                  {hab.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LaCasaEspacios({
  salonImg, habsImg, salaImg,
  salonNombre, habsNombre, salaNombre,
}: {
  salonImg?: string; habsImg?: string; salaImg?: string;
  salonNombre?: string; habsNombre?: string; salaNombre?: string;
}) {
  const { lang } = useLanguage();
  const tx = getT(lang);

  const espacios = [
    {
      nombre: salonNombre || tx.lacasa_salon_nombre,
      subtitulo: tx.lacasa_salon_sub,
      descripcion: tx.lacasa_salon_desc,
      imagen: salonImg || "/images/comedor-sala.jpg",
      icon: <Users size={20} className="text-[#4A6741]" />,
    },
    {
      nombre: habsNombre || tx.lacasa_esp_habs_nombre,
      subtitulo: tx.lacasa_esp_habs_sub,
      descripcion: tx.lacasa_esp_habs_desc,
      imagen: habsImg || "/images/hab-hecate.jpg",
      icon: <Bed size={20} className="text-[#C4A882]" />,
    },
    {
      nombre: salaNombre || tx.lacasa_sala_estar_nombre,
      subtitulo: tx.lacasa_sala_estar_sub,
      descripcion: tx.lacasa_sala_estar_desc,
      imagen: salaImg || "/images/distribuidor.jpg",
      icon: <Flame size={20} className="text-[#8B6914]" />,
    },
  ];

  return (
    <>
      <div className="text-center mb-12">
        <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
          {tx.lacasa_espacios_label}
        </p>
        <h2
          className="text-3xl md:text-4xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {tx.lacasa_espacios_title}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {espacios.map((espacio) => (
          <div key={espacio.nombre} className="group">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative">
              <img
                src={espacio.imagen}
                alt={espacio.nombre}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/hero2.jpg";
                }}
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              {espacio.icon}
              <span className="text-xs text-[#2C1810]/50 uppercase tracking-wide">
                {espacio.subtitulo}
              </span>
            </div>
            <h3
              className="text-xl text-[#2C1810] mb-2"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {espacio.nombre}
            </h3>
            <p className="text-[#2C1810]/65 text-sm leading-relaxed">
              {espacio.descripcion}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export function LaCasaCalendario({ unavailDates = [], foto1, foto2 }: { unavailDates?: DateRange[]; foto1?: string; foto2?: string }) {
  const { lang } = useLanguage();
  const locale = lang === "ca" ? "ca-ES" : "es-ES";
  const monthNames = lang === "ca" ? MONTHS_CA : MONTHS_ES;
  const dayNames   = lang === "ca" ? DAYS_CA   : DAYS_ES;

  const CABANYA_FOTOS = [
    { src: foto1 || "/images/cabanya-grupo.jpg", alt: "La Cabanya — espacio exterior" },
    { src: foto2 || "/images/cabanya-luna.jpg",  alt: "La Cabanya — noche de luna" },
    { src: "/images/hero2.jpg",                  alt: "La Cabanya — jardín" },
  ];

  // Photo slider
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % CABANYA_FOTOS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Calendar open/close
  const [open, setOpen] = useState(false);

  // Calendar navigation
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [hovered,   setHovered]   = useState<Date|null>(null);
  const nextM = viewMonth === 11 ? 0  : viewMonth + 1;
  const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;

  // Selection — single day only
  const [selectedDay, setSelectedDay] = useState<Date|null>(null);
  const [personas, setPersonas] = useState(10);
  const [nombre,   setNombre]   = useState("");
  const [email,    setEmail]    = useState("");
  const [tel,      setTel]      = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const total = personas * 10;

  function handleDay(date: Date) {
    if (selectedDay && sameDay(date, selectedDay)) {
      setSelectedDay(null); // deselect
    } else {
      setSelectedDay(date);
    }
  }

  function prevMo() { if(viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }
  function nextMo() { if(viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }

  async function handleReservar() {
    if (!selectedDay) { setError(lang==="ca"?"Selecciona un dia":"Selecciona un día"); return; }
    if (!nombre.trim() || !email.trim()) { setError(lang==="ca"?"Nom i email requerits":"Nombre y email requeridos"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "cabanya",
          precio: total,
          personas,
          dias: 1,
          fecha_entrada: fmtDate(selectedDay),
          fecha_salida: fmtDate(selectedDay),
          nombre_cliente: nombre.trim(),
          email_cliente: email.trim(),
          telefono_cliente: tel.trim(),
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setError(data.error ?? "Error al iniciar el pago"); setLoading(false); }
    } catch { setError("Error de red"); setLoading(false); }
  }

  return (
    <section className="py-16 px-6 bg-[#F0EAD6]">
      <div className="max-w-5xl mx-auto">

        {/* ── Photo slider + header ── */}
        <div className="relative rounded-2xl overflow-hidden mb-10 h-64 md:h-80">
          {CABANYA_FOTOS.map((f, i) => (
            <img key={f.src} src={f.src} alt={f.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === slide ? "opacity-100" : "opacity-0"}`}
              onError={e => { (e.target as HTMLImageElement).src = "/images/hero2.jpg"; }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/70 via-transparent to-transparent" />
          {/* Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {CABANYA_FOTOS.map((_,i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i===slide?"bg-[#F0EAD6] scale-125":"bg-[#F0EAD6]/50"}`}
              />
            ))}
          </div>
          <div className="absolute bottom-8 left-6 right-6">
            <p className="text-[#C4A882] text-xs tracking-[0.2em] uppercase font-medium mb-1">
              {lang === "ca" ? "Espai exterior 350 m²" : "Espacio exterior 350 m²"}
            </p>
            <h2 className="text-2xl md:text-3xl text-[#F0EAD6]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              La Cabanya
            </h2>
          </div>
        </div>

        {/* ── Booking card ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Price bar */}
          <div className="bg-[#2A3F24] px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-[#C4A882] text-xs tracking-[0.2em] uppercase font-medium mb-0.5">
                {lang === "ca" ? "Preu base" : "Precio base"}
              </p>
              <span className="text-3xl font-bold text-[#F0EAD6]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                10€
              </span>
              <span className="text-[#E8DCC8]/60 text-sm ml-2">
                / {lang === "ca" ? "persona · dia" : "persona · día"}
              </span>
            </div>
            <button onClick={() => setOpen(v => !v)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#C4A882] text-[#2C1810] text-sm font-semibold hover:bg-[#F0EAD6] transition-colors">
              {open
                ? (lang === "ca" ? "Tancar" : "Cerrar")
                : (lang === "ca" ? "Reservar" : "Reservar")}
              <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
            </button>
          </div>

          {/* Booking panel */}
          {open && (
            <div className="px-6 md:px-8 pb-8 pt-6 space-y-7">

              {/* Calendar */}
              <div>
                <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-3">
                  {lang === "ca" ? "Selecciona les dates" : "Selecciona las fechas"}
                </p>
                <div className="border border-[#E8DCC8] rounded-2xl p-4 bg-[#FAFAF6]">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMo} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] transition-colors text-[#2C1810]">
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex-1" />
                    <button onClick={nextMo} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] transition-colors text-[#2C1810]">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CalMes year={viewYear} month={viewMonth} checkIn={selectedDay} checkOut={null}
                      hovered={null} unavail={unavailDates} onDay={handleDay} onHover={() => {}}
                      monthNames={monthNames} dayNames={dayNames} />
                    <CalMes year={nextY} month={nextM} checkIn={selectedDay} checkOut={null}
                      hovered={null} unavail={unavailDates} onDay={handleDay} onHover={() => {}}
                      monthNames={monthNames} dayNames={dayNames} />
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E8DCC8] text-xs text-[#2C1810]/60">
                    {!selectedDay && (lang === "ca" ? "Selecciona el dia" : "Selecciona el día")}
                    {selectedDay && (
                      <span className="text-[#4A6741] font-medium">
                        {selectedDay.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personas */}
              <div>
                <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-3">
                  {lang === "ca" ? "Nombre de persones" : "Número de personas"}
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPersonas(p => Math.max(1, p - 1))} disabled={personas <= 1}
                    className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] flex items-center justify-center text-lg font-medium hover:bg-[#E8DCC8] transition-colors disabled:opacity-40">−</button>
                  <span className="w-10 text-center text-[#2C1810] font-medium text-base tabular-nums">{personas}</span>
                  <button onClick={() => setPersonas(p => Math.min(200, p + 1))} disabled={personas >= 200}
                    className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] flex items-center justify-center text-lg font-medium hover:bg-[#E8DCC8] transition-colors disabled:opacity-40">+</button>
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-[#F0EAD6] rounded-xl p-5 space-y-1.5">
                <div className="flex justify-between text-sm text-[#2C1810]/60">
                  <span>{personas} {lang === "ca" ? "persones" : "personas"} × 1 {lang === "ca" ? "dia" : "día"} × 10€</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-[#2C1810]/60">Total</span>
                  <span className="text-2xl font-bold text-[#2C1810]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>{total}€</span>
                </div>
              </div>

              {/* Contact form */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide">
                  {lang === "ca" ? "Les teves dades" : "Tus datos"}
                </p>
                {[
                  { label: lang === "ca" ? "Nom" : "Nombre", val: nombre, set: setNombre, type: "text", ph: lang === "ca" ? "El teu nom" : "Tu nombre" },
                  { label: "Email", val: email, set: setEmail, type: "email", ph: "tu@email.com" },
                  { label: lang === "ca" ? "Telèfon" : "Teléfono", val: tel, set: setTel, type: "tel", ph: "+34 600 000 000" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1">{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 placeholder:text-[#2C1810]/30" />
                  </div>
                ))}
              </div>

              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <button onClick={handleReservar} disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-semibold hover:bg-[#3A5432] transition-colors disabled:opacity-60">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {lang === "ca" ? "Reservar ara" : "Reservar ahora"} — {total}€
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function LaCasaCTA() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <section className="py-20 px-6 bg-[#2A3F24] text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-4">
          {tx.lacasa_cta_label}
        </p>
        <h2
          className="text-3xl md:text-4xl text-[#F0EAD6] mb-6"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {tx.lacasa_cta_title2}
        </h2>
        <p className="text-[#E8DCC8]/70 mb-3 leading-relaxed">
          <strong className="text-[#E8DCC8]">{lang === "ca" ? "Allotjament + esmorzar" : "Alojamiento + desayuno"}</strong>{" "}
          — {lang === "ca" ? "35€/nit per persona" : "35€/noche por persona"}
        </p>
        <p className="text-[#E8DCC8]/70 mb-8 leading-relaxed">
          <strong className="text-[#E8DCC8]">{lang === "ca" ? "Allotjament + mitja pensió" : "Alojamiento + media pensión"}</strong>{" "}
          — {lang === "ca" ? "50€/nit per persona" : "50€/noche por persona"}
        </p>
        <p className="text-[#E8DCC8]/50 text-sm mb-8 max-w-lg mx-auto">
          {tx.lacasa_cta_nota}
        </p>
        <Link
          href="/alojamiento"
          className="inline-block px-10 py-4 bg-[#C4A882] text-[#2C1810] rounded-full font-semibold text-lg hover:bg-[#F0EAD6] transition-colors"
        >
          {tx.lacasa_cta_btn}
        </Link>
      </div>
    </section>
  );
}

export function LaCasaFooter() {
  const { lang } = useLanguage();
  const tx = getT(lang);

  return (
    <footer className="py-8 px-6 bg-[#2C1810] text-center text-xs text-[#E8DCC8]/40">
      © {new Date().getFullYear()} Mas Besaura · Vidrà, Girona. {tx.footer_rights_short}
    </footer>
  );
}
