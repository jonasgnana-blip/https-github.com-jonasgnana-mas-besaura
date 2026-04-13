"use client";

import { useState } from "react";
import { Loader2, ChevronRight, CalendarDays } from "lucide-react";
import SingleDatePicker from "@/app/components/SingleDatePicker";
import type { DateRange } from "@/app/actions/reservas";
import { useLanguage } from "@/lib/LanguageContext";
import { getT } from "@/lib/i18n";

// ── Shared helpers ─────────────────────────────────────────────────────────────

function formatDateES(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── ActividadReserva (unified for ALL activity types) ─────────────────────────

type ActividadReservaProps = {
  /** Activity name shown in Stripe checkout */
  nombre: string;
  /** Price per person / per unit */
  precio: number;
  /** Short description passed to Stripe */
  descripcion?: string;
  /** Dates to block in the calendar */
  unavailableDates?: DateRange[];
  /**
   * cabanya  → sends { tipo:"cabanya", ... }
   * actividad → sends { tipo:"actividad", ... }
   */
  tipoPago?: "actividad" | "cabanya";
  /** Label for the open button, e.g. "Reservar — 45€/persona" */
  btnLabel?: string;
};

export function ActividadReserva({
  nombre,
  precio,
  descripcion = "",
  unavailableDates = [],
  tipoPago = "actividad",
  btnLabel,
}: ActividadReservaProps) {
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

  const defaultLabel =
    tipoPago === "cabanya"
      ? tr.act_card_cabanya_btn
      : `${tr.act_card_reservar} — ${precio}€/${tr.act_card_persona}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate) {
      setError(tr.act_card_error_fecha);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload =
        tipoPago === "cabanya"
          ? {
              tipo: "cabanya",
              precio: total,
              personas,
              dias: 1,
              fecha_entrada: selectedDate,
              nombre_cliente: guestNombre,
              email_cliente: guestEmail,
              telefono_cliente: guestTelefono,
            }
          : {
              tipo: "actividad",
              nombre,
              precio: total,
              descripcion,
              cantidad: personas,
              fecha_entrada: selectedDate,
              nombre_cliente: guestNombre,
              email_cliente: guestEmail,
              telefono_cliente: guestTelefono,
            };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors self-start"
      >
        {open ? (
          tr.act_card_cerrar
        ) : (
          <>
            <CalendarDays size={14} />
            {btnLabel ?? defaultLabel}
          </>
        )}
        <ChevronRight
          size={14}
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {/* Booking form */}
      {open && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 border border-[#E8DCC8] rounded-2xl p-5 bg-[#FAFAF6]"
        >
          {/* ── Calendar ── */}
          <SingleDatePicker
            unavailableDates={unavailableDates}
            selected={selectedDate}
            onSelect={setSelectedDate}
            label={tr.act_card_fecha_label}
          />

          {/* Selected date badge */}
          {selectedDate && (
            <div className="flex items-center gap-2 bg-[#4A6741]/8 rounded-xl px-3 py-2">
              <CalendarDays size={13} className="text-[#4A6741] shrink-0" />
              <span className="text-xs text-[#4A6741] font-medium">
                {formatDateES(selectedDate)}
              </span>
            </div>
          )}

          {/* ── Persons counter ── */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#2C1810]">
              {tr.act_card_personas_label}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPersonas((p) => Math.max(1, p - 1))}
                className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-white text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
              >
                −
              </button>
              <span className="text-2xl font-medium text-[#2C1810] w-10 text-center">
                {personas}
              </span>
              <button
                type="button"
                onClick={() => setPersonas((p) => p + 1)}
                className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-white text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
              >
                +
              </button>
              <span className="text-sm text-[#2C1810]/60">
                {personas} × {precio}€ ={" "}
                <span className="font-medium text-[#4A6741]">{total}€</span>
              </span>
            </div>
          </div>

          {/* ── Contact fields ── */}
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

          {/* ── Submit ── */}
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

// ── Legacy re-exports kept for backward compat (used nowhere else, but safe) ──

export function BotonActividad({
  label,
  nombre,
  precio,
  descripcion,
}: {
  label: string;
  nombre: string;
  precio: number;
  descripcion?: string;
}) {
  return (
    <ActividadReserva
      nombre={nombre}
      precio={precio}
      descripcion={descripcion}
      btnLabel={label}
    />
  );
}

export function ActividadConFecha(props: {
  nombre: string;
  precio: number;
  descripcion: string;
  unavailableDates: DateRange[];
}) {
  return <ActividadReserva {...props} tipoPago="actividad" />;
}

export function CabanyaActividadReserva({
  unavailableDates = [],
}: {
  unavailableDates?: DateRange[];
}) {
  const { lang } = useLanguage();
  const tr = getT(lang);
  return (
    <ActividadReserva
      nombre="La Cabanya — Mas Besaura"
      precio={10}
      unavailableDates={unavailableDates}
      tipoPago="cabanya"
      btnLabel={tr.act_card_cabanya_btn}
    />
  );
}

export function ComidaCaseraReserva() {
  const { lang } = useLanguage();
  const tr = getT(lang);
  return (
    <ActividadReserva
      nombre="Comida Casera — Mas Besaura"
      precio={15}
      tipoPago="actividad"
      btnLabel={tr.act_card_comida}
    />
  );
}
