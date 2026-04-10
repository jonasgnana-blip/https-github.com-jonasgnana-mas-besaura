"use client";

import { useState, useTransition } from "react";
import {
  adminUpdateHabitacion,
  adminUpdateComplemento,
} from "@/app/actions/admin";
import { Save, Loader2, CalendarCheck, CalendarX } from "lucide-react";

type Habitacion = {
  id: string;
  nombre: string;
  descripcion: string;
  precio_noche: number;
  capacidad: number;
};

type Complemento = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo_cobro: "PAGO_UNICO" | "POR_NOCHE";
  activo: boolean;
};

export default function ConfigClient({
  habitaciones: initialHabs,
  complementos: initialComps,
  gcalConnected,
  gcalStatus,
}: {
  habitaciones: Habitacion[];
  complementos: Complemento[];
  gcalConnected: boolean;
  gcalStatus?: string;
}) {
  const [habs, setHabs] = useState(initialHabs);
  const [comps, setComps] = useState(initialComps);
  const [saved, setSaved] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function saveHab(id: string) {
    const h = habs.find((x) => x.id === id)!;
    startTransition(async () => {
      await adminUpdateHabitacion(id, {
        nombre: h.nombre,
        descripcion: h.descripcion,
        precio_noche: h.precio_noche,
        capacidad: h.capacidad,
      });
      setSaved(id);
      setTimeout(() => setSaved(null), 2000);
    });
  }

  function saveComp(id: string) {
    const c = comps.find((x) => x.id === id)!;
    startTransition(async () => {
      await adminUpdateComplemento(id, {
        nombre: c.nombre,
        descripcion: c.descripcion,
        precio: c.precio,
        activo: c.activo,
      });
      setSaved(id);
      setTimeout(() => setSaved(null), 2000);
    });
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Configuración
        </h1>
        <p className="text-sm text-[#2C1810]/50 mt-1">
          Gestiona precios, capacidades y complementos.
        </p>
      </div>

      {/* ── Google Calendar ── */}
      <section className="mb-10">
        <h2
          className="text-xl text-[#2C1810] mb-5"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Google Calendar
        </h2>

        <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                gcalConnected ? "bg-green-100" : "bg-[#F0EAD6]"
              }`}
            >
              {gcalConnected ? (
                <CalendarCheck size={20} className="text-green-600" />
              ) : (
                <CalendarX size={20} className="text-[#8B6914]" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-[#2C1810]">
                {gcalConnected
                  ? "Conectado a Google Calendar"
                  : "No conectado"}
              </div>
              <div className="text-xs text-[#2C1810]/50 mt-0.5">
                {gcalConnected
                  ? "Las reservas confirmadas se crean automáticamente en masbesaura@gmail.com"
                  : "Conecta para crear eventos automáticos en cada reserva confirmada"}
              </div>
            </div>
          </div>

          {gcalStatus === "error" && (
            <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              Error al conectar. Inténtalo de nuevo.
            </div>
          )}
          {gcalStatus === "ok" && !gcalConnected && (
            <div className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
              ¡Conectado correctamente!
            </div>
          )}

          <a
            href="/api/admin/google-auth"
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              gcalConnected
                ? "bg-[#F0EAD6] text-[#2C1810] hover:bg-[#E8DCC8]"
                : "bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432]"
            }`}
          >
            {gcalConnected ? "Reconectar" : "Conectar con Google"}
          </a>
        </div>
      </section>

      {/* Habitaciones */}
      <section className="mb-10">
        <h2
          className="text-xl text-[#2C1810] mb-5"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Alojamientos
        </h2>

        <div className="space-y-4">
          {habs.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl border border-[#E8DCC8] p-6"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={h.nombre}
                    onChange={(e) =>
                      setHabs((prev) =>
                        prev.map((x) =>
                          x.id === h.id ? { ...x, nombre: e.target.value } : x
                        )
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
                    Precio/noche (€)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={h.precio_noche}
                    onChange={(e) =>
                      setHabs((prev) =>
                        prev.map((x) =>
                          x.id === h.id
                            ? { ...x, precio_noche: Number(e.target.value) }
                            : x
                        )
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={h.capacidad}
                    onChange={(e) =>
                      setHabs((prev) =>
                        prev.map((x) =>
                          x.id === h.id
                            ? { ...x, capacidad: Number(e.target.value) }
                            : x
                        )
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={h.descripcion}
                  onChange={(e) =>
                    setHabs((prev) =>
                      prev.map((x) =>
                        x.id === h.id ? { ...x, descripcion: e.target.value } : x
                      )
                    )
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 resize-none"
                />
              </div>

              <button
                onClick={() => saveHab(h.id)}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-50"
              >
                {isPending && saved === h.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : saved === h.id ? (
                  "✓ Guardado"
                ) : (
                  <><Save size={14} /> Guardar</>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Complementos */}
      <section>
        <h2
          className="text-xl text-[#2C1810] mb-5"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Complementos
        </h2>

        <div className="space-y-4">
          {comps.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-[#E8DCC8] p-6"
            >
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={c.nombre}
                    onChange={(e) =>
                      setComps((prev) =>
                        prev.map((x) =>
                          x.id === c.id ? { ...x, nombre: e.target.value } : x
                        )
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
                    Precio (€) · {c.tipo_cobro === "POR_NOCHE" ? "por noche" : "pago único"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={c.precio}
                    onChange={(e) =>
                      setComps((prev) =>
                        prev.map((x) =>
                          x.id === c.id
                            ? { ...x, precio: Number(e.target.value) }
                            : x
                        )
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <input
                      type="checkbox"
                      checked={c.activo}
                      onChange={(e) =>
                        setComps((prev) =>
                          prev.map((x) =>
                            x.id === c.id ? { ...x, activo: e.target.checked } : x
                          )
                        )
                      }
                      className="w-4 h-4 accent-[#4A6741]"
                    />
                    <span className="text-sm text-[#2C1810]/70">Activo</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
                  Descripción
                </label>
                <input
                  type="text"
                  value={c.descripcion}
                  onChange={(e) =>
                    setComps((prev) =>
                      prev.map((x) =>
                        x.id === c.id ? { ...x, descripcion: e.target.value } : x
                      )
                    )
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                />
              </div>

              <button
                onClick={() => saveComp(c.id)}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-50"
              >
                {isPending && saved === c.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : saved === c.id ? (
                  "✓ Guardado"
                ) : (
                  <><Save size={14} /> Guardar</>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
