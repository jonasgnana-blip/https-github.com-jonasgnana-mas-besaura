"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  nombre: string;
  opcion: "desayuno" | "media_pension";
  precio: number;
  label: string;
};

export default function BotonReservaHabitacion({ nombre, opcion, precio, label }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "habitacion",
          nombre,
          opcion,
          precio,
          cantidad: 1,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned", data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {label}
    </button>
  );
}

/* ── Cabanya counter + booking ─────────────────────────────────── */

export function CabanyaReserva() {
  const [personas, setPersonas] = useState(1);
  const [loading, setLoading] = useState(false);
  const total = personas * 10;

  async function handleReservar() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "cabanya",
          nombre: "La Cabanya",
          opcion: "dia",
          precio: 10,
          cantidad: personas,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned", data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Counter */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPersonas((p) => Math.max(1, p - 1))}
          className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
        >
          −
        </button>
        <span className="text-2xl font-medium text-[#2C1810] w-10 text-center">
          {personas}
        </span>
        <button
          onClick={() => setPersonas((p) => p + 1)}
          className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
        >
          +
        </button>
        <span className="text-sm text-[#2C1810]/60 ml-2">personas</span>
      </div>

      {/* Total + button */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-lg font-medium text-[#2C1810]">
          Total: <span className="text-[#4A6741]">{total}€</span>
        </span>
        <button
          onClick={handleReservar}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Reservar Cabanya
        </button>
      </div>
    </div>
  );
}
