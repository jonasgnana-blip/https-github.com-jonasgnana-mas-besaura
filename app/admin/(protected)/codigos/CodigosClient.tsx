"use client";

import { useState, useTransition } from "react";
import {
  adminCreateCodigo,
  adminToggleCodigo,
  adminDeleteCodigo,
} from "@/app/actions/admin";
import { Plus, Trash2, Loader2, Copy, Check } from "lucide-react";

type Codigo = {
  id: string;
  codigo: string;
  tipo: string;
  valor: number;
  descripcion: string;
  activo: boolean;
  usos_max: number | null;
  usos_actual: number;
  expira_en: string | null;
  createdAt: string;
};

const EMPTY = {
  codigo: "",
  tipo: "porcentaje",
  valor: "",
  descripcion: "",
  usos_max: "",
  expira_en: "",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function usosLabel(c: Codigo) {
  if (c.usos_max === null) return `${c.usos_actual} usos`;
  return `${c.usos_actual} / ${c.usos_max} usos`;
}

function valorLabel(c: Codigo) {
  return c.tipo === "porcentaje" ? `${c.valor}%` : `${c.valor}€`;
}

export default function CodigosClient({ codigos: initial }: { codigos: Codigo[] }) {
  const [codigos, setCodigos] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const valor = parseFloat(form.valor);
    if (!form.codigo.trim()) { setError("El código no puede estar vacío."); return; }
    if (isNaN(valor) || valor <= 0) { setError("El valor debe ser mayor que 0."); return; }
    if (form.tipo === "porcentaje" && valor > 100) { setError("El porcentaje no puede superar 100."); return; }

    startTransition(async () => {
      try {
        const created = await adminCreateCodigo({
          codigo: form.codigo,
          tipo: form.tipo,
          valor,
          descripcion: form.descripcion || undefined,
          usos_max: form.usos_max ? parseInt(form.usos_max) : undefined,
          expira_en: form.expira_en || undefined,
        });
        setCodigos((prev) => [{
          id: created.id,
          codigo: created.codigo,
          tipo: created.tipo,
          valor: Number(created.valor),
          descripcion: created.descripcion ?? "",
          activo: created.activo,
          usos_max: created.usos_max ?? null,
          usos_actual: created.usos_actual,
          expira_en: created.expira_en ? created.expira_en.toISOString().split("T")[0] : null,
          createdAt: created.createdAt.toISOString(),
        }, ...prev]);
        setForm(EMPTY);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al crear el código");
      }
    });
  }

  function handleToggle(id: string, activo: boolean) {
    startTransition(async () => {
      await adminToggleCodigo(id, !activo);
      setCodigos((prev) => prev.map((c) => c.id === id ? { ...c, activo: !activo } : c));
    });
  }

  function handleDelete(id: string, codigo: string) {
    if (!confirm(`¿Eliminar el código "${codigo}"?`)) return;
    startTransition(async () => {
      await adminDeleteCodigo(id);
      setCodigos((prev) => prev.filter((c) => c.id !== id));
    });
  }

  function handleCopy(codigo: string, id: string) {
    navigator.clipboard.writeText(codigo);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-[#2C1810]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          Códigos de descuento
        </h1>
        <p className="text-sm text-[#2C1810]/50 mt-1">
          Promos de grupo, ofertas temporales o descuentos especiales para actividades.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">

        {/* ── Lista ── */}
        <div>
          <div className="bg-white rounded-2xl border border-[#E8DCC8] overflow-hidden">
            {codigos.length === 0 ? (
              <div className="py-14 text-center text-sm text-[#2C1810]/40">
                Aún no hay códigos. Crea el primero.
              </div>
            ) : (
              <div className="divide-y divide-[#E8DCC8]">
                {codigos.map((c) => {
                  const agotado = c.usos_max !== null && c.usos_actual >= c.usos_max;
                  const expirado = c.expira_en ? new Date(c.expira_en + "T23:59:59") < new Date() : false;
                  const estadoBadge = !c.activo
                    ? "bg-gray-100 text-gray-500"
                    : agotado || expirado
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700";
                  const estadoLabel = !c.activo ? "Inactivo" : agotado ? "Agotado" : expirado ? "Expirado" : "Activo";

                  return (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${estadoBadge}`}>
                        {estadoLabel}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#2C1810] text-sm tracking-wider">
                            {c.codigo}
                          </span>
                          <button
                            onClick={() => handleCopy(c.codigo, c.id)}
                            className="text-[#2C1810]/30 hover:text-[#4A6741] transition-colors"
                            title="Copiar código"
                          >
                            {copiedId === c.id ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                          <span className="text-sm font-semibold text-[#4A6741]">
                            -{valorLabel(c)}
                          </span>
                        </div>
                        <div className="text-xs text-[#2C1810]/50 mt-0.5 flex flex-wrap gap-x-3">
                          {c.descripcion && <span>{c.descripcion}</span>}
                          <span>{usosLabel(c)}</span>
                          {c.expira_en && <span>Expira {fmt(c.expira_en)}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggle(c.id, c.activo)}
                          disabled={isPending}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F0EAD6] text-[#2C1810]/70 hover:bg-[#E8DCC8] transition-colors disabled:opacity-50"
                        >
                          {c.activo ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.codigo)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg text-[#2C1810]/30 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Formulario ── */}
        <div>
          <h2 className="text-lg text-[#2C1810] mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Nuevo código
          </h2>
          <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#E8DCC8] p-6 space-y-4">

            <div>
              <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                Código *
              </label>
              <input
                type="text"
                value={form.codigo}
                onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                placeholder="GRUPO20, VERANO10…"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                  Tipo *
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                >
                  <option value="porcentaje">% Porcentaje</option>
                  <option value="fijo">€ Importe fijo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                  Valor *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={form.tipo === "porcentaje" ? "100" : undefined}
                    value={form.valor}
                    onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                    placeholder="20"
                    required
                    className="w-full px-3 py-2.5 pr-8 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#2C1810]/40">
                    {form.tipo === "porcentaje" ? "%" : "€"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                Descripción (visible en el formulario)
              </label>
              <input
                type="text"
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descuento de grupo · 5 o más personas"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 placeholder:text-[#2C1810]/25"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                  Usos máximos
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.usos_max}
                  onChange={(e) => setForm((f) => ({ ...f, usos_max: e.target.value }))}
                  placeholder="Ilimitado"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 placeholder:text-[#2C1810]/25"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2C1810]/60 uppercase tracking-wide mb-1.5">
                  Expira el
                </label>
                <input
                  type="date"
                  value={form.expira_en}
                  onChange={(e) => setForm((f) => ({ ...f, expira_en: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DCC8] bg-[#FAFAF6] text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-full bg-[#4A6741] text-[#F0EAD6] text-sm font-semibold hover:bg-[#3A5432] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : <><Plus size={14} /> Crear código</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
