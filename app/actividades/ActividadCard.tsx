"use client";

import { useState } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import SingleDatePicker from "@/app/components/SingleDatePicker";
import type { DateRange } from "@/app/actions/reservas";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

/* ── BotonActividad ──────────────────────────────────────────────────────────── */

type BotonProps = {
  label: string;
  nombre: string;
  precio: number;
  descripcion?: string;
};

export function BotonActividad({ label, nombre, precio, descripcion }: BotonProps) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "actividad", nombre, precio, descripcion, cantidad: 1 }),
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
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {label}
      </button>
      {error && <p className="text-red-600 text-xs text-center mt-1">{error}</p>}
    </div>
  );
}

/* ── ComidaCaseraReserva ─────────────────────────────────────────────────────── */

export function ComidaCaseraReserva() {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const [open, setOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = cantidad * 15;

  async function handleReservar() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "actividad",
          nombre: "Comida Casera",
          precio: total,
          cantidad,
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
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#4A6741] text-[#4A6741] text-sm font-medium hover:bg-[#4A6741] hover:text-[#F0EAD6] transition-colors"
      >
        {open ? tr.act_card_cerrar : tr.act_card_comida}
        <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="flex flex-col gap-3 border border-[#E8DCC8] rounded-2xl p-4 bg-[#FAFAF6]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-white text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-medium text-[#2C1810] w-10 text-center">{cantidad}</span>
            <button
              onClick={() => setCantidad((c) => c + 1)}
              className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-white text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
            >
              +
            </button>
            <span className="text-sm text-[#2C1810]/60">
              {cantidad} × 15€ = <span className="font-medium text-[#4A6741]">{total}€</span>
            </span>
          </div>
          <button
            onClick={handleReservar}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {tr.act_card_comida_btn} — {total}€
          </button>
          {error && <p className="text-red-600 text-xs">{error}</p>}
        </div>
      )}
    </div>
  );
}

/* ── ActividadConFecha ───────────────────────────────────────────────────────── */

type ActividadConFechaProps = {
  nombre: string;
  precio: number;
  descripcion: string;
  unavailableDates: DateRange[];
};

export function ActividadConFecha({
  nombre,
  precio,
  descripcion,
  unavailableDates,
}: ActividadConFechaProps) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [personas, setPersonas] = useState(1);
  const [guestNombre, setGuestNombre] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestTelefono, setGuestTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = precio * personas;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate) {
      setError(tr.act_card_error_fecha);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "actividad",
          nombre,
          precio: total,
          descripcion,
          cantidad: personas,
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
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors"
      >
        {open ? tr.act_card_cerrar : `${tr.act_card_reservar} — ${precio}€/${tr.act_card_persona}`}
        <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-[#E8DCC8] rounded-2xl p-5 bg-[#FAFAF6]">
          {/* Date picker */}
          <SingleDatePicker
            unavailableDates={unavailableDates}
            selected={selectedDate}
            onSelect={setSelectedDate}
            label={tr.act_card_fecha_label}
          />

          {/* Persons counter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#2C1810]">{tr.act_card_personas_label}</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPersonas((p) => Math.max(1, p - 1))}
                className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-white text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
              >
                −
              </button>
              <span className="text-2xl font-medium text-[#2C1810] w-10 text-center">{personas}</span>
              <button
                type="button"
                onClick={() => setPersonas((p) => p + 1)}
                className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-white text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
              >
                +
              </button>
              <span className="text-sm text-[#2C1810]/60">
                {personas} × {precio}€ = <span className="font-medium text-[#4A6741]">{total}€</span>
              </span>
            </div>
          </div>

          {/* Guest form */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder={tr.aloj_booking_nombre_ph}
              value={guestNombre}
              onChange={(e) => setGuestNombre(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl border border-[#E8DCC8] bg-white text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:border-[#4A6741] transition-colors"
            />
            <input
              type="email"
              placeholder={tr.aloj_booking_email_ph}
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl border border-[#E8DCC8] bg-white text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:border-[#4A6741] transition-colors"
            />
            <input
              type="tel"
              placeholder={tr.aloj_booking_tel_ph}
              value={guestTelefono}
              onChange={(e) => setGuestTelefono(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl border border-[#E8DCC8] bg-white text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:border-[#4A6741] transition-colors"
            />
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading || !selectedDate}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {tr.act_card_confirmar} — {total}€
          </button>
        </form>
      )}
    </div>
  );
}

/* ── CabanyaActividadReserva ─────────────────────────────────────────────────── */

type CabanyaProps = {
  unavailableDates?: DateRange[];
};

export function CabanyaActividadReserva({ unavailableDates: _unavailableDates }: CabanyaProps = {}) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  const [open, setOpen] = useState(false);
  const [personas, setPersonas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = personas * 10;

  async function handleReservar() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "cabanya", precio: total, personas }),
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
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors"
      >
        {open ? tr.act_card_cerrar : tr.act_card_cabanya_btn}
        <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="flex flex-col gap-3 border border-[#E8DCC8] rounded-2xl p-4 bg-[#FAFAF6]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPersonas((p) => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-white text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-medium text-[#2C1810] w-10 text-center">{personas}</span>
            <button
              onClick={() => setPersonas((p) => p + 1)}
              className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-white text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
            >
              +
            </button>
            <span className="text-sm text-[#2C1810]/60">
              {personas} {tr.act_card_personas_txt} · <span className="font-medium text-[#4A6741]">{total}€</span>
            </span>
          </div>
          <button
            onClick={handleReservar}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {tr.act_card_cabanya_sala} — {total}€
          </button>
          {error && <p className="text-red-600 text-xs">{error}</p>}
        </div>
      )}
    </div>
  );
}
