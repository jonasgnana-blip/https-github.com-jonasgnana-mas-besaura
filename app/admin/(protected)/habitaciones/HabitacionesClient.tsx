"use client";

import { useState, useTransition } from "react";
import { adminUpdateHabitacion } from "@/app/actions/admin";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";
import ImageUpload from "@/app/components/ImageUpload";

type Hab = {
  id: string;
  nombre: string;
  descripcion: string;
  precio_noche: number;
  capacidad: number;
  precio_desayuno: number | null;
  precio_media_pension: number | null;
  imagenes: string[];
  activa: boolean;
};

const INPUT = "w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30";

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function HabitacionesClient({ habitaciones: initial }: { habitaciones: Hab[] }) {
  const [habs, setHabs] = useState(initial);
  const [saved, setSaved] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function saveHab(id: string) {
    const h = habs.find(x => x.id === id)!;
    startTransition(async () => {
      await adminUpdateHabitacion(id, {
        nombre: h.nombre,
        descripcion: h.descripcion,
        precio_noche: h.precio_noche,
        capacidad: h.capacidad,
        precio_desayuno: h.precio_desayuno ?? undefined,
        precio_media_pension: h.precio_media_pension ?? undefined,
        imagenes: h.imagenes,
        activa: h.activa,
      });
      setSaved(id);
      setTimeout(() => setSaved(null), 2500);
    });
  }

  function toggleActiva(id: string) {
    setHabs(prev => prev.map(x => x.id === id ? { ...x, activa: !x.activa } : x));
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl text-[#2C1810]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Habitaciones
        </h1>
        <p className="text-sm text-[#2C1810]/50 mt-1">
          Activa o desactiva habitaciones, edita precios, descripción e imágenes.
        </p>
      </div>

      <div className="space-y-6">
        {habs.map(h => (
          <div
            key={h.id}
            className={[
              "bg-white rounded-2xl border p-6 transition-opacity",
              h.activa ? "border-[#E8DCC8]" : "border-[#E8DCC8] opacity-60",
            ].join(" ")}
          >
            {/* Header with toggle */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-medium text-[#2C1810]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                {h.nombre}
              </h3>
              <button
                type="button"
                onClick={() => toggleActiva(h.id)}
                className={[
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                  h.activa
                    ? "bg-[#4A6741]/10 text-[#4A6741] hover:bg-[#4A6741]/20"
                    : "bg-[#2C1810]/8 text-[#2C1810]/50 hover:bg-[#2C1810]/12",
                ].join(" ")}
              >
                {h.activa ? <Eye size={14} /> : <EyeOff size={14} />}
                {h.activa ? "Visible" : "Oculta"}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <FieldRow label="Nombre">
                <input type="text" value={h.nombre} className={INPUT}
                  onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, nombre: e.target.value } : x))} />
              </FieldRow>
              <FieldRow label="Capacidad">
                <input type="number" min={1} value={h.capacidad} className={INPUT}
                  onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, capacidad: Number(e.target.value) } : x))} />
              </FieldRow>
              <FieldRow label="Precio/noche (€)">
                <input type="number" min={0} value={h.precio_noche} className={INPUT}
                  onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, precio_noche: Number(e.target.value) } : x))} />
              </FieldRow>
              <FieldRow label="Con desayuno (€/noche)">
                <input type="number" min={0} value={h.precio_desayuno ?? ""} placeholder="—" className={INPUT}
                  onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, precio_desayuno: e.target.value === "" ? null : Number(e.target.value) } : x))} />
              </FieldRow>
              <FieldRow label="Media pensión (€/noche)">
                <input type="number" min={0} value={h.precio_media_pension ?? ""} placeholder="—" className={INPUT}
                  onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, precio_media_pension: e.target.value === "" ? null : Number(e.target.value) } : x))} />
              </FieldRow>
            </div>

            <FieldRow label="Descripción">
              <textarea rows={2} value={h.descripcion} className={INPUT + " resize-none"}
                onChange={e => setHabs(prev => prev.map(x => x.id === h.id ? { ...x, descripcion: e.target.value } : x))} />
            </FieldRow>

            <div className="mt-4">
              <label className="block text-xs font-medium text-[#2C1810]/50 uppercase tracking-wide mb-2">Imágenes</label>
              <div className="space-y-3">
                {h.imagenes.map((url, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6]">
                    <ImageUpload currentUrl={url || null} label={`Imagen ${idx + 1}`}
                      onUpload={newUrl => setHabs(prev => prev.map(x => {
                        if (x.id !== h.id) return x;
                        const imgs = [...x.imagenes]; imgs[idx] = newUrl; return { ...x, imagenes: imgs };
                      }))} />
                    <div className="flex-1">
                      <input type="text" value={url} placeholder="/images/foto.jpg"
                        className="w-full px-3 py-2 rounded-xl border border-[#E8DCC8] bg-white text-[#2C1810] text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                        onChange={e => setHabs(prev => prev.map(x => {
                          if (x.id !== h.id) return x;
                          const imgs = [...x.imagenes]; imgs[idx] = e.target.value; return { ...x, imagenes: imgs };
                        }))} />
                    </div>
                    <button type="button" title="Eliminar"
                      onClick={() => setHabs(prev => prev.map(x => x.id !== h.id ? x : { ...x, imagenes: x.imagenes.filter((_, i) => i !== idx) }))}
                      className="mt-5 w-7 h-7 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 shrink-0 text-sm font-bold">
                      ×
                    </button>
                  </div>
                ))}
                <div className="p-3 rounded-xl border border-dashed border-[#E8DCC8] bg-[#FAFAF6]">
                  <ImageUpload currentUrl={null} label="+ Añadir imagen"
                    onUpload={newUrl => { if (newUrl) setHabs(prev => prev.map(x => x.id === h.id ? { ...x, imagenes: [...x.imagenes, newUrl] } : x)); }} />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => saveHab(h.id)}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3A5432] transition-colors disabled:opacity-50"
              >
                {isPending && saved !== h.id ? null : saved === h.id ? "✓ Guardado" : <><Save size={14} />Guardar</>}
                {isPending && saved !== h.id && <Loader2 size={14} className="animate-spin" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
