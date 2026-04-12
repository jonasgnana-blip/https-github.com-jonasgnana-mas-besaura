"use client";

import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { DateRange } from "@/app/actions/reservas";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = {
  datesCabanya: DateRange[];
  datesCasa: DateRange[];
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isUnavailable(date: Date, ranges: DateRange[]): boolean {
  const ds = formatDate(date);
  return ranges.some((r) => ds >= r.entrada && ds < r.salida);
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(date: Date, start: Date, end: Date): boolean {
  return date > start && date < end;
}

function nightsBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const MONTH_NAMES_CA = [
  "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre",
];
const DAY_NAMES_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const DAY_NAMES_CA = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"];

// ── CalendarMonth ──────────────────────────────────────────────────────────────

function CalendarMonth({
  year,
  month,
  checkIn,
  checkOut,
  hovered,
  unavailableRanges,
  onDayClick,
  onDayHover,
  singleSelect,
  monthNames,
  dayNames,
}: {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  hovered: Date | null;
  unavailableRanges: DateRange[];
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  singleSelect?: boolean;
  monthNames?: string[];
  dayNames?: string[];
}) {
  const resolvedMonthNames = monthNames ?? MONTH_NAMES_ES;
  const resolvedDayNames = dayNames ?? DAY_NAMES_ES;

  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rangeEnd = singleSelect ? null : checkOut ?? hovered;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="select-none">
      <div className="text-center font-medium text-[#2C1810] mb-3 text-sm tracking-wide">
        {resolvedMonthNames[month]} {year}
      </div>
      <div className="grid grid-cols-7 mb-1">
        {resolvedDayNames.map((d) => (
          <div key={d} className="text-center text-[10px] text-[#2C1810]/40 font-medium py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const ds = formatDate(date);
          const past = isPast(date);
          const unavail = isUnavailable(date, unavailableRanges);
          const disabled = past || unavail;

          const isCheckIn = checkIn && sameDay(date, checkIn);
          const isCheckOut = !singleSelect && checkOut && sameDay(date, checkOut);
          const inRange =
            !singleSelect &&
            checkIn &&
            rangeEnd &&
            !sameDay(checkIn, date) &&
            !sameDay(rangeEnd, date) &&
            isBetween(
              date,
              checkIn < rangeEnd ? checkIn : rangeEnd,
              checkIn < rangeEnd ? rangeEnd : checkIn
            );

          let bg = "";
          let textCol = disabled ? "text-[#2C1810]/25" : "text-[#2C1810]";
          let rounded = "rounded-full";
          const cursor = disabled ? "cursor-not-allowed" : "cursor-pointer";

          if (isCheckIn || isCheckOut) {
            bg = "bg-[#4A6741]";
            textCol = "text-[#F0EAD6]";
            rounded = "rounded-full";
          } else if (inRange) {
            bg = "bg-[#4A6741]/15";
            rounded = "rounded-none";
          }

          const isHoverEnd =
            !singleSelect &&
            hovered &&
            !checkOut &&
            checkIn &&
            sameDay(date, hovered) &&
            !sameDay(date, checkIn);
          if (isHoverEnd && !disabled) {
            bg = "bg-[#4A6741]/50";
            textCol = "text-[#FAFAF6]";
            rounded = "rounded-full";
          }

          const isRangeStart =
            !singleSelect &&
            checkIn &&
            rangeEnd &&
            sameDay(date, checkIn < rangeEnd ? checkIn : rangeEnd) &&
            !sameDay(checkIn, rangeEnd);
          const isRangeEnd =
            !singleSelect &&
            checkIn &&
            rangeEnd &&
            sameDay(date, checkIn < rangeEnd ? rangeEnd : checkIn) &&
            !sameDay(checkIn, rangeEnd);

          if (isRangeStart && !isCheckIn && !isCheckOut) {
            rounded = "rounded-l-full rounded-r-none";
          } else if (isRangeEnd && !isCheckIn && !isCheckOut) {
            rounded = "rounded-r-full rounded-l-none";
          }

          return (
            <div
              key={ds}
              className={`relative flex items-center justify-center ${inRange ? bg : ""} ${inRange ? rounded : ""}`}
            >
              <button
                disabled={disabled}
                onClick={() => !disabled && onDayClick(date)}
                onMouseEnter={() => !disabled && onDayHover(date)}
                onMouseLeave={() => onDayHover(null)}
                className={`
                  w-8 h-8 text-xs font-medium transition-all
                  ${isCheckIn || isCheckOut || isHoverEnd ? bg + " " + rounded : ""}
                  ${!isCheckIn && !isCheckOut && !isHoverEnd && !inRange ? (disabled ? "" : "hover:bg-[#4A6741]/10 rounded-full") : ""}
                  ${textCol} ${cursor}
                  flex items-center justify-center
                  ${unavail && !past ? "line-through opacity-40" : ""}
                `}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SingleDatePicker ───────────────────────────────────────────────────────────

function SingleDatePicker({
  selected,
  unavailableRanges,
  onChange,
}: {
  selected: Date | null;
  unavailableRanges: DateRange[];
  onChange: (d: Date | null) => void;
}) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const monthNames = lang === "ca" ? MONTH_NAMES_CA : MONTH_NAMES_ES;
  const dayNames = lang === "ca" ? DAY_NAMES_CA : DAY_NAMES_ES;
  const locale = lang === "ca" ? "ca-ES" : "es-ES";

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  function handlePrev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNext() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(date: Date) {
    if (selected && sameDay(date, selected)) {
      onChange(null);
    } else {
      onChange(date);
    }
  }

  return (
    <div className="bg-[#FAFAF6] rounded-2xl border border-[#E8DCC8] p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrev}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] transition-colors text-[#2C1810]"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1" />
        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] transition-colors text-[#2C1810]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <CalendarMonth
        year={viewYear}
        month={viewMonth}
        checkIn={selected}
        checkOut={null}
        hovered={null}
        unavailableRanges={unavailableRanges}
        onDayClick={handleDayClick}
        onDayHover={() => {}}
        singleSelect
        monthNames={monthNames}
        dayNames={dayNames}
      />

      {selected && (
        <div className="mt-4 pt-3 border-t border-[#E8DCC8] text-xs text-[#4A6741] font-medium">
          {selected.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      )}
      {!selected && (
        <div className="mt-4 pt-3 border-t border-[#E8DCC8] text-xs text-[#2C1810]/50">
          {tr.aloj_cabanya_consultar}
        </div>
      )}
    </div>
  );
}

// ── DateRangePicker ────────────────────────────────────────────────────────────

function DateRangePicker({
  checkIn,
  checkOut,
  unavailableRanges,
  onChange,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  unavailableRanges: DateRange[];
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
}) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const monthNames = lang === "ca" ? MONTH_NAMES_CA : MONTH_NAMES_ES;
  const dayNames = lang === "ca" ? DAY_NAMES_CA : DAY_NAMES_ES;
  const locale = lang === "ca" ? "ca-ES" : "es-ES";

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [hovered, setHovered] = useState<Date | null>(null);

  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  function handlePrev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNext() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(date: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      onChange(date, null);
    } else {
      if (sameDay(date, checkIn)) {
        onChange(null, null);
        return;
      }
      const [start, end] = date > checkIn ? [checkIn, date] : [date, checkIn];
      const nights = nightsBetween(start, end);
      let hasConflict = false;
      for (let i = 0; i < nights; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        if (isUnavailable(d, unavailableRanges)) {
          hasConflict = true;
          break;
        }
      }
      if (hasConflict) {
        onChange(date, null);
      } else {
        onChange(start, end);
      }
    }
  }

  return (
    <div className="bg-[#FAFAF6] rounded-2xl border border-[#E8DCC8] p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrev}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] transition-colors text-[#2C1810]"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1" />
        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] transition-colors text-[#2C1810]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CalendarMonth
          year={viewYear}
          month={viewMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          hovered={hovered}
          unavailableRanges={unavailableRanges}
          onDayClick={handleDayClick}
          onDayHover={setHovered}
          monthNames={monthNames}
          dayNames={dayNames}
        />
        <CalendarMonth
          year={nextYear}
          month={nextMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          hovered={hovered}
          unavailableRanges={unavailableRanges}
          onDayClick={handleDayClick}
          onDayHover={setHovered}
          monthNames={monthNames}
          dayNames={dayNames}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-[#E8DCC8] flex flex-wrap gap-4 text-xs text-[#2C1810]/60">
        {checkIn && !checkOut && (
          <span className="text-[#4A6741] font-medium">
            {tr.aloj_cal_salida}
          </span>
        )}
        {checkIn && checkOut && (
          <span className="text-[#4A6741] font-medium">
            {nightsBetween(checkIn, checkOut)} {nightsBetween(checkIn, checkOut) !== 1 ? tr.alq_dias : tr.aloj_cal_dias} ·{" "}
            {checkIn.toLocaleDateString(locale, { day: "numeric", month: "short" })} →{" "}
            {checkOut.toLocaleDateString(locale, { day: "numeric", month: "short" })}
          </span>
        )}
        {!checkIn && <span>{tr.aloj_cal_entrada}</span>}
      </div>
    </div>
  );
}

// ── Counter helper ─────────────────────────────────────────────────────────────

function Counter({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] flex items-center justify-center text-lg font-medium hover:bg-[#E8DCC8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-8 text-center text-[#2C1810] font-medium text-base tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] flex items-center justify-center text-lg font-medium hover:bg-[#E8DCC8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}

// ── Input helper ───────────────────────────────────────────────────────────────

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-2">
        {label}
        {required && <span className="text-[#4A6741] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 placeholder:text-[#2C1810]/30"
      />
    </div>
  );
}

// ── Section A: La Cabanya ──────────────────────────────────────────────────────

function CabanySalaSection({ datesCabanya }: { datesCabanya: DateRange[] }) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const locale = lang === "ca" ? "ca-ES" : "es-ES";
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [personas, setPersonas] = useState(10);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = personas * 10;

  async function handleReservar() {
    if (!selectedDate) {
      setError(tr.alq_cabanya_error_fecha);
      return;
    }
    if (!nombre.trim() || !email.trim()) {
      setError(tr.alq_cabanya_error_contacto);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "cabanya",
          precio: total,
          personas,
          fecha: formatDate(selectedDate),
          nombre_cliente: nombre.trim(),
          email_cliente: email.trim(),
          telefono_cliente: telefono.trim(),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Error al iniciar el pago");
        setLoading(false);
      }
    } catch {
      setError(tr.act_card_error_conexion);
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#FAFAF6] rounded-2xl border border-[#E8DCC8] overflow-hidden mb-6">
      {/* Header — always visible */}
      <div className="bg-[#2C1810] px-8 py-6">
        <p className="text-[#C4A882] text-xs tracking-[0.2em] uppercase font-medium mb-1">
          {tr.alq_cabanya_tipo}
        </p>
        <h3
          className="text-2xl text-[#F0EAD6] mb-1"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {tr.alq_cabanya_title}
        </h3>
        <p className="text-[#E8DCC8]/60 text-sm">
          {tr.alq_cabanya_price}
        </p>
      </div>

      {/* Description + CTA — always visible */}
      <div className="px-8 pt-6 pb-4">
        <p className="text-[#2C1810]/70 text-sm leading-relaxed mb-6">
          {tr.alq_cabanya_desc}
        </p>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors"
        >
          {open ? tr.alq_cerrar : tr.alq_cabanya_consultar}
          <ChevronRight size={15} className={`transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* Booking panel — only when open */}
      {open && (
        <div className="px-8 pb-8 space-y-7 border-t border-[#E8DCC8] pt-6 mt-2">
          {/* Date picker */}
          <div>
            <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-3">
              {tr.alq_cabanya_fecha_label}
            </p>
            <SingleDatePicker
              selected={selectedDate}
              unavailableRanges={datesCabanya}
              onChange={setSelectedDate}
            />
          </div>

          {/* Personas counter */}
          <div>
            <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-3">
              {tr.alq_cabanya_personas_label}
            </p>
            <Counter value={personas} min={1} max={100} onChange={setPersonas} />
          </div>

          {/* Price summary */}
          <div className="bg-[#F0EAD6] rounded-xl p-5 space-y-1.5">
            <div className="flex justify-between text-sm text-[#2C1810]/60">
              <span>{personas} {tr.aloj_booking_personas} × 10€</span>
              <span className="font-semibold text-[#2C1810] text-base">{total}€</span>
            </div>
            {selectedDate && (
              <div className="text-xs text-[#2C1810]/50">
                {selectedDate.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}
          </div>

          {/* Guest form */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide">
              {tr.alq_cabanya_contacto_label}
            </p>
            <Field label={tr.alq_cabanya_nombre_label} value={nombre} onChange={setNombre} placeholder={tr.alq_cabanya_nombre_ph} required />
            <Field label={tr.alq_cabanya_email_label} type="email" value={email} onChange={setEmail} placeholder="tu@email.com" required />
            <Field label={tr.alq_cabanya_tel_label} type="tel" value={telefono} onChange={setTelefono} placeholder={tr.alq_cabanya_tel_ph} required />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleReservar}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {tr.alq_cabanya_reservar} — {total}€
          </button>
        </div>
      )}
    </div>
  );
}

// ── Section B: Casa Retiros ────────────────────────────────────────────────────

function CasaRetirosSection({ datesCasa }: { datesCasa: DateRange[] }) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [personas, setPersonas] = useState(1);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState<"mitad" | "total" | null>(null);
  const [error, setError] = useState("");

  const dias = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const totalCompleto = personas * dias * 80;
  const totalMitad = Math.round(totalCompleto / 2);

  function handleRangeChange(ci: Date | null, co: Date | null) {
    setCheckIn(ci);
    setCheckOut(co);
  }

  async function handleReservar(tipo: "mitad" | "total") {
    if (!checkIn || !checkOut) {
      setError(tr.alq_casa_error_fechas);
      return;
    }
    if (!nombre.trim() || !email.trim()) {
      setError(tr.alq_casa_error_contacto);
      return;
    }
    setLoading(tipo);
    setError("");

    const precio = tipo === "mitad" ? totalMitad : totalCompleto;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "alquiler",
          precio,
          personas,
          dias,
          fecha_entrada: formatDate(checkIn),
          fecha_salida: formatDate(checkOut),
          nombre_cliente: nombre.trim(),
          email_cliente: email.trim(),
          telefono_cliente: telefono.trim(),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Error al iniciar el pago");
        setLoading(null);
      }
    } catch {
      setError(tr.act_card_error_conexion);
      setLoading(null);
    }
  }

  return (
    <div className="bg-[#FAFAF6] rounded-2xl border border-[#E8DCC8] overflow-hidden">
      {/* Header — always visible */}
      <div className="bg-[#4A6741] px-8 py-6">
        <p className="text-[#F0EAD6]/60 text-xs tracking-[0.2em] uppercase font-medium mb-1">
          {tr.alq_casa_tipo}
        </p>
        <h3
          className="text-2xl text-[#F0EAD6] mb-1"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {tr.alq_casa_title}
        </h3>
        <p className="text-[#F0EAD6]/60 text-sm">
          {tr.alq_casa_price}
        </p>
      </div>

      {/* Description + CTA — always visible */}
      <div className="px-8 pt-6 pb-4">
        <p className="text-[#2C1810]/70 text-sm leading-relaxed mb-6">
          {tr.alq_casa_desc}
        </p>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors"
        >
          {open ? tr.alq_cerrar : tr.alq_casa_consultar}
          <ChevronRight size={15} className={`transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* Booking panel — only when open */}
      {open && (
        <div className="px-8 pb-8 space-y-7 border-t border-[#E8DCC8] pt-6 mt-2">
          {/* Date range picker */}
          <div>
            <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-3">
              {tr.alq_casa_fechas_label}
            </p>
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              unavailableRanges={datesCasa}
              onChange={handleRangeChange}
            />
          </div>

          {/* Personas counter */}
          <div>
            <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-3">
              {tr.alq_casa_personas_label}
            </p>
            <Counter value={personas} min={1} max={12} onChange={setPersonas} />
          </div>

          {/* Price summary */}
          <div className="bg-[#F0EAD6] rounded-xl p-5 space-y-2">
            <div className="flex justify-between text-sm text-[#2C1810]/60">
              <span>
                {personas} {tr.aloj_booking_personas} × {dias > 0 ? dias : "—"} {tr.alq_dias} × 80€
              </span>
              <span className="font-semibold text-[#2C1810] text-base">
                {dias > 0 ? `${totalCompleto}€` : "—"}
              </span>
            </div>
            {dias > 0 && (
              <div className="flex justify-between text-sm text-[#2C1810]/60">
                <span>{tr.alq_casa_50}</span>
                <span className="font-medium text-[#4A6741]">{totalMitad}€</span>
              </div>
            )}
          </div>

          {/* Guest form */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide">
              {tr.alq_casa_contacto_label}
            </p>
            <Field label={tr.alq_casa_nombre_label} value={nombre} onChange={setNombre} placeholder={tr.alq_casa_nombre_ph} required />
            <Field label={tr.alq_casa_email_label} type="email" value={email} onChange={setEmail} placeholder="tu@email.com" required />
            <Field label={tr.alq_casa_tel_label} type="tel" value={telefono} onChange={setTelefono} placeholder={tr.alq_casa_tel_ph} required />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleReservar("mitad")}
              disabled={loading !== null || dias === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
            >
              {loading === "mitad" && <Loader2 size={16} className="animate-spin" />}
              {tr.alq_casa_reservar_mitad}{dias > 0 ? ` — ${totalMitad}€` : ""}
            </button>
            <button
              onClick={() => handleReservar("total")}
              disabled={loading !== null || dias === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#4A6741] text-[#4A6741] bg-transparent text-sm font-medium hover:bg-[#4A6741] hover:text-[#F0EAD6] transition-colors disabled:opacity-60"
            >
              {loading === "total" && <Loader2 size={16} className="animate-spin" />}
              {tr.alq_casa_reservar_total}{dias > 0 ? ` — ${totalCompleto}€` : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function AlquilerCliente({ datesCabanya, datesCasa }: Props) {
  return (
    <div className="space-y-10">
      <CabanySalaSection datesCabanya={datesCabanya} />
      <CasaRetirosSection datesCasa={datesCasa} />
    </div>
  );
}
