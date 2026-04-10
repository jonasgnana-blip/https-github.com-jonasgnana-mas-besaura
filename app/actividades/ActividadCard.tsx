"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

/* ── Single booking button ───────────────────────────────────── */

type BotonProps = {
  label: string;
  nombre: string;
  precio: number;
  descripcion?: string;
};

export function BotonActividad({ label, nombre, precio, descripcion }: BotonProps) {
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
      setError("Error de conexión. Inténtalo de nuevo.");
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

/* ── Cabanya counter for actividades page ───────────────────── */

export function CabanyaActividadReserva() {
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
      setError("Error de conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPersonas((p) => Math.max(1, p - 1))}
          className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
        >
          −
        </button>
        <span className="text-2xl font-medium text-[#2C1810] w-10 text-center">{personas}</span>
        <button
          onClick={() => setPersonas((p) => p + 1)}
          className="w-9 h-9 rounded-full border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-lg font-medium flex items-center justify-center hover:bg-[#E8DCC8] transition-colors"
        >
          +
        </button>
        <span className="text-sm text-[#2C1810]/60">personas</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-base font-medium text-[#2C1810]">
          Total: <span className="text-[#4A6741]">{total}€</span>
        </span>
        <button
          onClick={handleReservar}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Reservar Sala
        </button>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
