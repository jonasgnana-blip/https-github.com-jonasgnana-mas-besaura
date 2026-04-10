"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AlquilerCliente() {
  const [personas, setPersonas] = useState(1);
  const [dias, setDias] = useState(1);
  const [loading, setLoading] = useState<"mitad" | "total" | null>(null);
  const [error, setError] = useState("");

  const totalCompleto = personas * dias * 80;
  const totalMitad = Math.round(totalCompleto / 2);

  async function handleReservar(tipo: "mitad" | "total") {
    setLoading(tipo);
    setError("");
    const precio = tipo === "mitad" ? totalMitad : totalCompleto;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "alquiler", precio, personas, dias }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Error al iniciar el pago");
        setLoading(null);
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setLoading(null);
    }
  }

  return (
    <div className="bg-[#F0EAD6] rounded-2xl p-8">
      <h3
        className="text-xl text-[#2C1810] mb-6"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Calcula tu reserva
      </h3>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-2">
            Número de personas
          </label>
          <input
            type="number"
            min={1}
            value={personas}
            onChange={(e) => setPersonas(Math.max(1, Number(e.target.value)))}
            className="w-full px-4 py-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-2">
            Número de días
          </label>
          <input
            type="number"
            min={1}
            value={dias}
            onChange={(e) => setDias(Math.max(1, Number(e.target.value)))}
            className="w-full px-4 py-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
          />
        </div>
      </div>

      <div className="bg-[#FAFAF6] rounded-xl p-5 mb-6 space-y-2">
        <div className="flex justify-between text-sm text-[#2C1810]/60">
          <span>{personas} personas × {dias} días × 80€</span>
          <span className="font-medium text-[#2C1810]">{totalCompleto}€</span>
        </div>
        <div className="flex justify-between text-sm text-[#2C1810]/60">
          <span>50% para reservar</span>
          <span className="font-medium text-[#4A6741]">{totalMitad}€</span>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleReservar("mitad")}
          disabled={loading !== null}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-60"
        >
          {loading === "mitad" && <Loader2 size={16} className="animate-spin" />}
          Reservar con el 50% — {totalMitad}€
        </button>
        <button
          onClick={() => handleReservar("total")}
          disabled={loading !== null}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#4A6741] text-[#4A6741] bg-transparent text-sm font-medium hover:bg-[#4A6741] hover:text-[#F0EAD6] transition-colors disabled:opacity-60"
        >
          {loading === "total" && <Loader2 size={16} className="animate-spin" />}
          Importe completo — {totalCompleto}€
        </button>
      </div>
    </div>
  );
}
