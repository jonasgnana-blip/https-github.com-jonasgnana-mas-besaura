"use client";

import { useState, useTransition } from "react";
import {
  adminCreateBloqueo,
  adminDeleteBloqueo,
  adminBloquearCasaCompleta,
  adminDeleteBloqueoCasa,
} from "@/app/actions/admin";
import { Trash2, Plus, Loader2, Home } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Bloqueo = {
  id: string;
  habitacion_id: string;
  habitacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string;
};

type Habitacion = { id: string; nombre: string };

// ── Helpers ────────────────────────────────────────────────────────────────────

const CASA_IDS = ["artemisa", "selene", "hecate", "la-cabanya"];

function fmt(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Group bloqueos: when all 4 CASA_IDS share the same dates → "Casa completa" */
function groupBloqueos(bloqueos: Bloqueo[]) {
  // Map date-range key → list of bloqueos for that range
  const byRange = new Map<string, Bloqueo[]>();
  for (const b of bloqueos) {
    if (!CASA_IDS.includes(b.habitacion_id)) continue;
    const key = `${b.fecha_inicio}|${b.fecha_fin}`;
    if (!byRange.has(key)) byRange.set(key, []);
    byRange.get(key)!.push(b);
  }

  const casaGroups: { key: string; ids: string[]; inicio: string; fin: string; motivo: string }[] = [];
  const casaGroupKeys = new Set<string>();

  for (const [key, group] of byRange) {
    const coveredIds = group.map((b) => b.habitacion_id);
    if (CASA_IDS.every((id) => coveredIds.includes(id))) {
      casaGroups.push({
        key,
        ids: group.map((b) => b.id),
        inicio: group[0].fecha_inicio,
        fin: group[0].fecha_fin,
        motivo: group[0].motivo,
      });
      casaGroupKeys.add(key);
    }
  }

  // Individual bloqueos: those NOT part of a "casa completa" group
  const individual = bloqueos.filter((b) => {
    const key = `${b.fecha_inicio}|${b.fecha_fin}`;
    return !(CASA_IDS.includes(b.habitacion_id) && casaGroupKeys.has(key));
  });

  return { casaGroups, individual };
}

// ── Component ──────────────────────────────────────────────────────────────────

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

  const esCasa = habitacionId === "casa-completa";

  // ── Create ───────────────────────────────────────────────────────────────────

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fechaInicio || !fechaFin) { setError("Selecciona ambas fechas."); return; }
    if (fechaFin <= fechaInicio) { setError("La fecha de fin debe ser posterior al inicio."); return; }

    startTransition(async () => {
      if (esCasa) {
        const created = await adminBloquearCasaCompleta({
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          motivo: motivo || undefined,
        });
        // created is an array of 4 bloqueos; we need habitacion names from props
        const nameMap = Object.fromEntries(habitaciones.map((h) => [h.id, h.nombre]));
        setBloqueos((prev) => [
          ...prev,
          ...created.map((b) => ({
            id: b.id,
            habitacion_id: b.habitacion_id,
            habitacion: nameMap[b.habitacion_id] ?? b.habitacion_id,
            fecha_inicio: b.fecha_inicio.toISOString().split("T")[0],
            fecha_fin: b.fecha_fin.toISOString().split("T")[0],
            motivo: b.motivo ?? "",
          })),
        ]);
      } else {
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
      }
      setFechaInicio("");
      setFechaFin("");
      setMotivo("");
    });
  }

  // ── Delete individual ────────────────────────────────────────────────────────

  function handleDelete(id: string) {
    startTransition(async () => {
      await adminDeleteBloqueo(id);
      setBloqueos((prev) => prev.filter((b) => b.id !== id));
    });
  }

  // ── Delete casa completa group ───────────────────────────────────────────────

  function handleDeleteCasa(inicio: string, fin: string, ids: string[]) {
    startTransition(async () => {
      await adminDeleteBloqueoCasa(inicio, fin);
      setBloqueos((prev) => prev.filter((b) => !ids.includes(b.id)));
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const { casaGroups, individual } = groupBloqueos(bloqueos);
  const totalEntries = casaGroups.length + individual.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-[#2C1810]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Bloquear fechas
        </h1>
        <p className="text-sm text-[#2C1810]/50 mt-1">
          Cierra fechas para mantenimiento, uso propio o eventos privados.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">

        {/* ── Lista ── */}
        <div>
          <h2 className="text-lg text-[#2C1810] mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Fechas bloqueadas
          </h2>

          <div className="bg-white rounded-2xl border border-[#E8DCC8] overflow-hidden">
            {totalEntries === 0 ? (
              <div className="py-12 text-center text-sm text-[#2C1810]/40">
                No hay fechas bloqueadas manualmente.
              </div>
            ) : (
              <div className="divide-y divide-[#E8DCC8]">

                {/* Casa completa groups */}
                {casaGroups.map((g) => (
                  <div key={g.key} className="flex items-center gap-4 px-5 py-4 bg-[#F0EAD6]/40">
                    <div className="w-2 h-2 rounded-full bg-[#2C1810]/40 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Home size={13} className="text-[#2C1810]/50 shrink-0" />
                        <span className="text-sm font-semibold text-[#2C1810]">
                          Casa completa
                        </span>
                      </div>
                      <div className="text-xs text-[#2C1810]/50 mt-0.5">
                        {fmt(g.inicio)} → {fmt(g.fin)}
                        {g.motivo ? ` · ${g.motivo}` : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCasa(g.inicio, g.fin, g.ids)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Eliminar bloqueo de casa completa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}

                {/* Individual bloqueos */}
                {individual.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-4">
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

        {/* ── Formulario ── */}
        <div>
          <h2 className="text-lg text-[#2C1810] mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Añadir bloqueo
          </h2>

          <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#E8DCC8] p-6 space-y-4">

            <div>
              <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                Espacio
              </label>
              <select
                value={habitacionId}
                onChange={(e) => setHabitacionId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
              >
                {/* Casa completa first */}
                <option value="casa-completa">🏠 Casa completa (sala + habitaciones)</option>
                <option disabled className="text-[#2C1810]/30">──────────────────</option>
                {habitaciones.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nombre}
                  </option>
                ))}
              </select>
            </div>

            {esCasa && (
              <div className="text-xs text-[#2C1810]/60 bg-[#F0EAD6]/60 rounded-xl px-3 py-2 leading-relaxed">
                Bloqueará Artemisa, Selene, Hécate y La Cabanya para el rango indicado.
              </div>
            )}

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
                placeholder="Mantenimiento, uso propio, evento…"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 placeholder-[#2C1810]/25"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-semibold hover:bg-[#3A5432] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><Loader2 size={14} className="animate-spin" /> Guardando...</>
              ) : (
                <><Plus size={14} /> {esCasa ? "Bloquear casa completa" : "Añadir bloqueo"}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
