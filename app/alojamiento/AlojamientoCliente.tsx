"use client";

import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, Phone, MapPin } from "lucide-react";
import { createReserva } from "@/app/actions/reservas";
import type { DateRange } from "@/app/actions/reservas";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

// ── Types ──────────────────────────────────────────────────────────────────────

type Complemento = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number | string | { toNumber: () => number };
  tipo_cobro: "PAGO_UNICO" | "POR_NOCHE";
  activo: boolean;
};

type HabitacionData = {
  id: HabitacionKey;
  nombre: string;
  descripcion: string;
  imagen: string;
  capacidad: number;
  precioDesayuno: number;
  precioMediaPension: number;
};

type Props = {
  complementos: Complemento[];
  datesArtemisa: DateRange[];
  datesSelene: DateRange[];
  datesHecate: DateRange[];
  datesCabanya: DateRange[];
  habitaciones?: {
    id: string;
    nombre?: string;
    descripcion?: string;
    capacidad?: number;
    imagen?: string;
    precio_desayuno: number | null;
    precio_media_pension: number | null;
  }[];
};

type HabitacionKey = "artemisa" | "selene" | "hecate";
type BookingOption = "desayuno" | "media_pension";

const HABITACIONES_BASE: Omit<HabitacionData, "precioDesayuno" | "precioMediaPension">[] = [
  {
    id: "artemisa",
    nombre: "Artemisa",
    descripcion:
      "2 camas individuales y una cama doble, con baño. Estufa de pellets. Orientación este.",
    imagen: "/images/hero1.jpg",
    capacidad: 4,
  },
  {
    id: "selene",
    nombre: "Selene",
    descripcion:
      "Habitación con altillo. 2 camas individuales abajo, 2 camas individuales arriba. Estufa de pellets. Orientación norte.",
    imagen: "/images/hero2.jpg",
    capacidad: 4,
  },
  {
    id: "hecate",
    nombre: "Hécate",
    descripcion:
      "2 camas individuales y una cama doble. Estufa de pellets. Orientación oeste.",
    imagen: "/images/hero3.jpg",
    capacidad: 4,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function toNum(v: number | string | { toNumber: () => number }): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v);
  return v.toNumber();
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
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

// ── Calendar Component ─────────────────────────────────────────────────────────

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
  const firstDay = new Date(year, month, 1);
  // Monday-first: getDay() returns 0=Sun…6=Sat → convert to 0=Mon…6=Sun
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rangeEnd = singleSelect ? null : checkOut ?? hovered;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const resolvedMonthNames = monthNames ?? MONTH_NAMES_ES;
  const resolvedDayNames = dayNames ?? DAY_NAMES_ES;

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
            isBetween(date, checkIn < rangeEnd ? checkIn : rangeEnd, checkIn < rangeEnd ? rangeEnd : checkIn);

          let bg = "";
          let textCol = disabled ? "text-[#2C1810]/25" : "text-[#2C1810]";
          let rounded = "rounded-full";
          let cursor = disabled ? "cursor-not-allowed" : "cursor-pointer";

          if (isCheckIn || isCheckOut) {
            bg = "bg-[#4A6741]";
            textCol = "text-[#F0EAD6]";
            rounded = "rounded-full";
          } else if (inRange) {
            bg = "bg-[#4A6741]/15";
            rounded = "rounded-none";
          }

          const isHoverEnd =
            !singleSelect && hovered && !checkOut && checkIn && sameDay(date, hovered) && !sameDay(date, checkIn);
          if (isHoverEnd && !disabled) {
            bg = "bg-[#4A6741]/50";
            textCol = "text-[#FAFAF6]";
            rounded = "rounded-full";
          }

          // Range start/end rounded edges
          const isRangeStart =
            !singleSelect && checkIn && rangeEnd && sameDay(date, checkIn < rangeEnd ? checkIn : rangeEnd) && !sameDay(checkIn, rangeEnd);
          const isRangeEnd =
            !singleSelect && checkIn && rangeEnd && sameDay(date, checkIn < rangeEnd ? rangeEnd : checkIn) && !sameDay(checkIn, rangeEnd);

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

function DateRangePicker({
  checkIn,
  checkOut,
  unavailableRanges,
  onChange,
  singleSelect,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  unavailableRanges: DateRange[];
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
  singleSelect?: boolean;
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
    if (singleSelect) {
      onChange(date, null);
      return;
    }
    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onChange(date, null);
    } else {
      // Second click
      if (sameDay(date, checkIn)) {
        onChange(null, null);
        return;
      }
      const [start, end] = date > checkIn ? [checkIn, date] : [date, checkIn];
      // Check no unavailable dates in range
      const nights = nightsBetween(start, end);
      let hasConflict = false;
      for (let i = 0; i <= nights; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        if (i < nights && isUnavailable(d, unavailableRanges)) {
          hasConflict = true;
          break;
        }
      }
      if (hasConflict) {
        // Reset and start from this date
        onChange(date, null);
      } else {
        onChange(start, end);
      }
    }
  }

  return (
    <div className="bg-[#FAFAF6] rounded-2xl border border-[#E8DCC8] p-4">
      {/* Navigation */}
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

      {/* Two months */}
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
          singleSelect={singleSelect}
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
          singleSelect={singleSelect}
          monthNames={monthNames}
          dayNames={dayNames}
        />
      </div>

      {/* Legend */}
      {!singleSelect && (
        <div className="mt-4 pt-3 border-t border-[#E8DCC8] flex flex-wrap gap-4 text-xs text-[#2C1810]/60">
          {checkIn && !checkOut && (
            <span className="text-[#4A6741] font-medium">
              {tr.aloj_cal_salida}
            </span>
          )}
          {checkIn && checkOut && (
            <span className="text-[#4A6741] font-medium">
              {nightsBetween(checkIn, checkOut)} {nightsBetween(checkIn, checkOut) !== 1 ? tr.aloj_cal_dias_pl : tr.aloj_cal_dias} ·{" "}
              {checkIn.toLocaleDateString(locale, { day: "numeric", month: "short" })} →{" "}
              {checkOut.toLocaleDateString(locale, { day: "numeric", month: "short" })}
            </span>
          )}
          {!checkIn && <span>{tr.aloj_cal_entrada}</span>}
        </div>
      )}
    </div>
  );
}

// ── Booking Panel ──────────────────────────────────────────────────────────────

function BookingPanel({
  habitacion,
  opcion,
  unavailableRanges,
  complementos,
  onClose,
}: {
  habitacion: HabitacionData;
  opcion: BookingOption;
  unavailableRanges: DateRange[];
  complementos: Complemento[];
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const tr = getT(lang);

  const precioPorPersonaNoche =
    opcion === "desayuno" ? habitacion.precioDesayuno : habitacion.precioMediaPension;

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [personas, setPersonas] = useState(1);
  const [selectedCompls, setSelectedCompls] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const noches = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  function calcTotal(): number {
    if (!noches) return 0;
    let total = personas * precioPorPersonaNoche * noches;
    for (const c of complementos) {
      if (selectedCompls.includes(c.id)) {
        const p = toNum(c.precio);
        total += c.tipo_cobro === "POR_NOCHE" ? p * noches : p;
      }
    }
    return total;
  }

  function toggleCompl(id: string) {
    setSelectedCompls((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError(tr.aloj_booking_error_fechas);
      return;
    }
    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      setError(tr.aloj_booking_error_contacto);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await createReserva({
        habitacion_id: habitacion.id,
        fecha_entrada: formatDate(checkIn),
        fecha_salida: formatDate(checkOut),
        nombre_cliente: nombre.trim(),
        email_cliente: email.trim(),
        telefono_cliente: telefono.trim(),
        complemento_ids: selectedCompls,
      });

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reserva_id: result.reserva_id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Error al iniciar el pago. Inténtalo de nuevo.");
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión.");
      setLoading(false);
    }
  }

  const total = calcTotal();

  return (
    <div className="mt-4 bg-[#F0EAD6] rounded-2xl border border-[#E8DCC8] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DCC8]">
        <div>
          <h4
            className="text-lg text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {tr.nav_reservar} {habitacion.nombre}
          </h4>
          <p className="text-xs text-[#2C1810]/60 mt-0.5">
            {opcion === "desayuno" ? tr.aloj_booking_desayuno : tr.aloj_booking_media_pension} ·{" "}
            {precioPorPersonaNoche}€/{tr.aloj_booking_persona}/{lang === "ca" ? "nit" : "noche"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8DCC8] text-[#2C1810]/60 hover:text-[#2C1810] transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Date picker */}
        <div>
          <p className="text-xs font-medium text-[#2C1810]/70 uppercase tracking-wide mb-2">
            {tr.aloj_booking_fecha_label}
          </p>
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            unavailableRanges={unavailableRanges}
            onChange={(ci, co) => {
              setCheckIn(ci);
              setCheckOut(co);
            }}
          />
        </div>

        {/* Personas */}
        <div>
          <p className="text-xs font-medium text-[#2C1810]/70 uppercase tracking-wide mb-3">
            {tr.aloj_booking_personas_label}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPersonas((p) => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
            >
              −
            </button>
            <span className="text-xl font-medium text-[#2C1810] w-8 text-center">
              {personas}
            </span>
            <button
              type="button"
              onClick={() => setPersonas((p) => Math.min(habitacion.capacidad, p + 1))}
              className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
            >
              +
            </button>
            <span className="text-sm text-[#2C1810]/50">
              ({tr.aloj_booking_max} {habitacion.capacidad})
            </span>
          </div>
        </div>

        {/* Complementos */}
        {complementos.length > 0 && (
          <div>
            <p className="text-xs font-medium text-[#2C1810]/70 uppercase tracking-wide mb-3">
              {tr.aloj_booking_complementos_label}
            </p>
            <div className="space-y-2">
              {complementos.map((c) => {
                const p = toNum(c.precio);
                const checked = selectedCompls.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? "border-[#4A6741] bg-[#4A6741]/5"
                        : "border-[#E8DCC8] bg-[#FAFAF6] hover:border-[#C4A882]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCompl(c.id)}
                      className="mt-0.5 accent-[#4A6741]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-[#2C1810]">
                          {c.nombre}
                        </span>
                        <span className="text-sm text-[#4A6741] font-medium whitespace-nowrap">
                          {p}€{" "}
                          <span className="text-[10px] text-[#2C1810]/50 font-normal">
                            {c.tipo_cobro === "POR_NOCHE" ? tr.aloj_booking_por_noche : tr.aloj_booking_precio_unico}
                          </span>
                        </span>
                      </div>
                      <p className="text-xs text-[#2C1810]/55 mt-0.5 leading-relaxed">
                        {c.descripcion}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Guest form */}
        <div>
          <p className="text-xs font-medium text-[#2C1810]/70 uppercase tracking-wide mb-3">
            {tr.aloj_booking_contacto_label}
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={tr.aloj_booking_nombre_ph}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:border-[#4A6741] transition-colors"
              required
            />
            <input
              type="email"
              placeholder={tr.aloj_booking_email_ph}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:border-[#4A6741] transition-colors"
              required
            />
            <input
              type="tel"
              placeholder={tr.aloj_booking_tel_ph}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:border-[#4A6741] transition-colors"
              required
            />
          </div>
        </div>

        {/* Price summary */}
        {noches > 0 && (
          <div className="bg-[#FAFAF6] rounded-xl border border-[#E8DCC8] p-4 space-y-2">
            <p className="text-xs font-medium text-[#2C1810]/70 uppercase tracking-wide mb-3">
              {tr.aloj_booking_resumen}
            </p>
            <div className="flex justify-between text-sm text-[#2C1810]/70">
              <span>
                {personas} {personas !== 1 ? tr.aloj_booking_personas : tr.aloj_booking_persona} × {precioPorPersonaNoche}€ × {noches} {noches !== 1 ? tr.aloj_booking_noches_pl : tr.aloj_booking_noches}
              </span>
              <span>{personas * precioPorPersonaNoche * noches}€</span>
            </div>
            {complementos
              .filter((c) => selectedCompls.includes(c.id))
              .map((c) => {
                const p = toNum(c.precio);
                const subtotal = c.tipo_cobro === "POR_NOCHE" ? p * noches : p;
                return (
                  <div key={c.id} className="flex justify-between text-sm text-[#2C1810]/70">
                    <span>
                      {c.nombre}{c.tipo_cobro === "POR_NOCHE" ? ` × ${noches} ${tr.aloj_booking_noches_pl}` : ""}
                    </span>
                    <span>{subtotal}€</span>
                  </div>
                );
              })}
            <div className="pt-2 border-t border-[#E8DCC8] flex justify-between font-semibold text-[#2C1810]">
              <span>{tr.aloj_booking_total}</span>
              <span className="text-[#4A6741] text-lg">{total}€</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !checkIn || !checkOut}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#4A6741] text-[#F0EAD6] font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? tr.aloj_booking_procesando : `${tr.aloj_booking_reservar_pagar}${total > 0 ? ` · ${total}€` : ""}`}
        </button>
      </form>
    </div>
  );
}

// ── Room Card ──────────────────────────────────────────────────────────────────

function RoomCard({
  habitacion,
  unavailableRanges,
  complementos,
}: {
  habitacion: HabitacionData;
  unavailableRanges: DateRange[];
  complementos: Complemento[];
}) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const [activePanel, setActivePanel] = useState<BookingOption | null>(null);

  function togglePanel(opcion: BookingOption) {
    setActivePanel((prev) => (prev === opcion ? null : opcion));
  }

  return (
    <div className="bg-[#FAFAF6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={habitacion.imagen}
          alt={habitacion.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="text-2xl text-[#2C1810] mb-3"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {habitacion.nombre}
        </h3>
        <p className="text-[#2C1810]/65 text-sm leading-relaxed mb-6">
          {habitacion.descripcion}
        </p>

        {/* Option buttons */}
        <div className="space-y-3">
          {(["desayuno", "media_pension"] as BookingOption[]).map((opcion) => {
            const precio =
              opcion === "desayuno"
                ? habitacion.precioDesayuno
                : habitacion.precioMediaPension;
            const labelText =
              opcion === "desayuno"
                ? `${tr.aloj_btn_desayuno} · ${precio}€/${tr.aloj_booking_persona}`
                : `${tr.aloj_btn_media_pension} · ${precio}€/${tr.aloj_booking_persona}`;
            const active = activePanel === opcion;
            return (
              <button
                key={opcion}
                onClick={() => togglePanel(opcion)}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#2C1810] text-[#F0EAD6]"
                    : "bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432]"
                }`}
              >
                {active ? tr.aloj_btn_close : labelText}
              </button>
            );
          })}
        </div>

        {/* Inline booking panel */}
        {activePanel && (
          <BookingPanel
            habitacion={habitacion}
            opcion={activePanel}
            unavailableRanges={unavailableRanges}
            complementos={complementos}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>
    </div>
  );
}

// ── La Cabanya ─────────────────────────────────────────────────────────────────

function CabanyaSection({
  unavailableRanges,
}: {
  unavailableRanges: DateRange[];
}) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const [open, setOpen] = useState(false);
  const [personas, setPersonas] = useState(10);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = personas * 10;

  async function handleReservar() {
    if (!selectedDate) {
      setError(tr.aloj_cabanya_error_fecha);
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
    <section className="py-20 px-6 bg-[#FAFAF6]">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img
              src="/images/hero1.jpg"
              alt="La Cabanya — Sala Granero"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-4">
              {tr.aloj_cabanya_label}
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#2C1810] mb-5"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {tr.aloj_cabanya_title}
            </h2>
            <p className="text-[#2C1810]/70 leading-relaxed mb-8">
              {tr.aloj_cabanya_desc}
            </p>

            <div className="space-y-4">
              <p className="text-sm text-[#2C1810]/60 font-medium">
                {tr.aloj_cabanya_price}
              </p>

              <button
                onClick={() => setOpen((v) => !v)}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  open
                    ? "bg-[#2C1810] text-[#F0EAD6]"
                    : "bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432]"
                }`}
              >
                {open ? tr.aloj_btn_close : tr.aloj_cabanya_consultar}
              </button>

              {open && (
                <div className="bg-[#F0EAD6] rounded-2xl p-6 space-y-5">
                  {/* Date picker */}
                  <div>
                    <p className="text-xs font-medium text-[#2C1810]/70 uppercase tracking-wide mb-2">
                      {tr.aloj_cabanya_fecha_label}
                    </p>
                    <DateRangePicker
                      checkIn={selectedDate}
                      checkOut={null}
                      unavailableRanges={unavailableRanges}
                      onChange={(d) => setSelectedDate(d)}
                      singleSelect
                    />
                    {selectedDate && (
                      <p className="text-xs text-[#4A6741] mt-2 font-medium">
                        {selectedDate.toLocaleDateString(lang === "ca" ? "ca-ES" : "es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Personas counter */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPersonas((p) => Math.max(1, p - 1))}
                      className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
                    >
                      −
                    </button>
                    <span className="text-2xl font-medium text-[#2C1810] w-10 text-center">
                      {personas}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPersonas((p) => Math.min(100, p + 1))}
                      className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
                    >
                      +
                    </button>
                    <span className="text-sm text-[#2C1810]/60 ml-2">{tr.aloj_cabanya_personas}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium text-[#2C1810]">
                      {tr.aloj_cabanya_total}{" "}
                      <span className="text-[#4A6741]">{total}€</span>
                    </span>
                    <button
                      onClick={handleReservar}
                      disabled={loading || !selectedDate}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {tr.aloj_cabanya_btn}
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-600 text-xs">{error}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Complementos info section ──────────────────────────────────────────────────

function ComplementosSection({ complementos }: { complementos: Complemento[] }) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  if (!complementos.length) return null;

  return (
    <section className="py-20 px-6 bg-[#F0EAD6]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
            {tr.compl_label}
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {tr.compl_title}
          </h2>
          <p className="text-[#2C1810]/60 mt-3 max-w-xl mx-auto text-sm">
            {tr.compl_desc}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {complementos.map((c) => {
            const p = toNum(c.precio);
            return (
              <div
                key={c.id}
                className="bg-[#FAFAF6] rounded-2xl border border-[#E8DCC8] p-5 hover:border-[#C4A882] transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3
                    className="text-lg text-[#2C1810]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {c.nombre}
                  </h3>
                  <div className="text-right shrink-0">
                    <p className="text-[#4A6741] font-semibold">{p}€</p>
                    <p className="text-[10px] text-[#2C1810]/45">
                      {c.tipo_cobro === "POR_NOCHE" ? tr.aloj_booking_por_noche : tr.aloj_booking_precio_unico}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#2C1810]/60 leading-relaxed">
                  {c.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AlojamientoCliente({
  complementos,
  datesArtemisa,
  datesSelene,
  datesHecate,
  datesCabanya,
  habitaciones: habitacionesDB = [],
}: Props) {
  const { lang } = useLanguage();
  const tr = getT(lang);

  const unavailableByRoom: Record<HabitacionKey, DateRange[]> = {
    artemisa: datesArtemisa,
    selene: datesSelene,
    hecate: datesHecate,
  };

  const HABITACIONES: HabitacionData[] = HABITACIONES_BASE.map((base, idx) => {
    // Match by name fragment (artemisa → "Artemisa") or by position
    const db = habitacionesDB.find(h =>
      h.nombre?.toLowerCase().includes(base.id.toLowerCase())
    ) ?? habitacionesDB[idx];
    return {
      ...base,
      nombre:      db?.nombre      || base.nombre,
      descripcion: db?.descripcion || base.descripcion,
      imagen:      (db?.imagen && db.imagen !== "") ? db.imagen : base.imagen,
      capacidad:   db?.capacidad   ?? base.capacidad,
      precioDesayuno:    db?.precio_desayuno    ?? 45,
      precioMediaPension: db?.precio_media_pension ?? 60,
    };
  });

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative h-[50vh] flex items-end overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/images/hero1.jpg"
            alt="Alojamiento en Mas Besaura"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 via-[#2C1810]/20 to-transparent" />
        </div>
        <div className="relative z-10 px-6 pb-12 max-w-6xl mx-auto w-full">
          <p className="text-[#C4A882] text-sm tracking-[0.2em] uppercase font-medium mb-2">
            Vidrà · Girona
          </p>
          <h1
            className="text-5xl md:text-6xl text-[#F0EAD6]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {tr.nav_alojamiento}
          </h1>
          <p className="text-[#E8DCC8]/80 text-lg mt-3 font-light">
            {tr.aloj_hero_subtitle}
          </p>
        </div>
      </section>

      {/* ─── HABITACIONES ─── */}
      <section className="py-20 px-6 bg-[#F0EAD6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#4A6741] text-sm tracking-[0.2em] uppercase font-medium mb-3">
              {tr.aloj_rooms_label}
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#2C1810]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {tr.aloj_rooms_title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HABITACIONES.map((hab) => (
              <RoomCard
                key={hab.id}
                habitacion={hab}
                unavailableRanges={unavailableByRoom[hab.id]}
                complementos={complementos}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── LA CABANYA ─── */}
      <CabanyaSection unavailableRanges={datesCabanya} />

      {/* ─── COMPLEMENTOS ─── */}
      <ComplementosSection complementos={complementos} />

      {/* ─── FOOTER ─── */}
      <footer className="py-16 px-6 bg-[#2C1810]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <span
              className="text-2xl text-[#F0EAD6]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Mas Besaura
            </span>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                href="https://maps.app.goo.gl/R5jGm9yANyER96e68"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C4A882] text-[#2C1810] rounded-full text-sm font-semibold hover:bg-[#F0EAD6] transition-colors"
              >
                <MapPin size={16} />
                Cómo llegar
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-[#F0EAD6]/20 flex items-center justify-center text-[#E8DCC8]/70 hover:text-[#F0EAD6] hover:border-[#F0EAD6]/50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-[#F0EAD6]/20 flex items-center justify-center text-[#E8DCC8]/70 hover:text-[#F0EAD6] hover:border-[#F0EAD6]/50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://wa.me/34665822542"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-[#F0EAD6]/20 flex items-center justify-center text-[#E8DCC8]/70 hover:text-[#F0EAD6] hover:border-[#F0EAD6]/50 transition-colors"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-[#F0EAD6]/10 text-center text-xs text-[#E8DCC8]/40">
            © {new Date().getFullYear()} Mas Besaura · Vidrà, Girona. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
