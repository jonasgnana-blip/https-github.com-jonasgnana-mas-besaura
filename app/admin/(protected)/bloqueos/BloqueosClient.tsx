"use client";

import { useState, useTransition } from "react";
import { adminCreateBloqueo, adminDeleteBloqueo } from "@/app/actions/admin";
import { Trash2, Plus, Loader2 } from "lucide-react";

type Bloqueo = {
  id: string;
  habitacion_id: string;
  habitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string;
};

type Habitacion = { id: string; nombre: string };

function fmt(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BloqueosClient({
  bloqueos: initial,
  habitaciones,
}: {
  bloqueos: Bloqueo[];
  habitaciones: Habitacion[];
}) {
  const [bloqueos, setBloqueos] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const [habitacionId, setHabitacionId] = useState(habitaciones[0]?.id ?? "");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fechaInicio || !fechaFin) {
      setError("Selecciona ambas fechas.");
      return;
    }
    if (fechaFin <= fechaInicio) {
      setError("La fecha de fin debe ser posterior al inicio.");
      return;
    }
    startTransition(async () => {
      const b = await adminCreateBloqueo({
        habitacion_id: habitacionId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        motivo: motivo || undefined,
      });
      const hab = habitaciones.find((h) => h.id === habitacionId)!;
      setBloqueos((prev) => [
        ...prev,
        {
          id: b.id,
          habitacion_id: b.habitacion_id,
          habitacion: hab.nombre,
          fecha_inicio: b.fecha_inicio.toISOString().split("T")[0],
          fecha_fin: b.fecha_fin.toISOString().split("T")[0],
          motivo: b.motivo ?? "",
        },
      ]);
      setFechaInicio("");
      setFechaFin("");
      setMotivo("");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await adminDeleteBloqueo(id);
      setBloqueos((prev) => prev.filter((b) => b.id !== id));
    });
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Bloquear fechas
        </h1>
        <p className="text-sm text-[#2C1810]/50 mt-1">
          Cierra fechas manualmente para mantenimiento, uso propio o eventos privados.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Lista de bloqueos */}
        <div>
          <h2
            className="text-lg text-[#2C1810] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Fechas bloqueadas
          </h2>

          <div className="bg-white rounded-2xl border border-[#E8DCC8] overflow-hidden">
            {bloqueos.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#2C1810]/40">
                No hay fechas bloqueadas manualmente.
              </div>
            ) : (
              <div className="divide-y divide-[#E8DCC8]">
                {bloqueos.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#2C1810]">
                        {fmt(b.fecha_inicio)} → {fmt(b.fecha_fin)}
                      </div>
                      <div className="text-xs text-[#2C1810]/50 mt-0.5">
                        {b.habitacion}
                        {b.motivo ? ` · ${b.motivo}` : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Formulario nuevo bloqueo */}
        <div>
          <h2
            className="text-lg text-[#2C1810] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Añadir bloqueo
          </h2>

          <form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl border border-[#E8DCC8] p-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                Alojamiento
              </label>
              <select
                value={habitacionId}
                onChange={(e) => setHabitacionId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
              >
                {habitaciones.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                  Inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                  Fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                Motivo (opcional)
              </label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Mantenimiento, uso propio…"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 placeholder-[#2C1810]/25"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-semibold hover:bg-[#3A5432] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><Loader2 size={14} className="animate-spin" /> Guardando...</>
              ) : (
                <><Plus size={14} /> Añadir bloqueo</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
