"use client";

import { useState, useTransition } from "react";
import {
  adminCreateActividad,
  adminUpdateActividad,
  adminDeleteActividad,
  adminCreateSesion,
  adminDeleteSesion,
} from "@/app/actions/admin";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CalendarPlus,
  Pencil,
  X,
} from "lucide-react";

type Sesion = {
  id: string;
  actividad_id: string;
  fecha: string;
  hora: string | null;
  plazas_max: number | null;
  activa: boolean;
  createdAt: string;
};

type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  facilitador: string | null;
  precio_base: number;
  precio_extra: number | null;
  max_personas: number | null;
  duracion: string | null;
  imagen_url: string | null;
  activa: boolean;
  createdAt: string;
  sesiones: Sesion[];
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const EMPTY_FORM = {
  titulo: "",
  descripcion: "",
  facilitador: "",
  precio_base: "",
  duracion: "",
  imagen_url: "",
};

const EMPTY_SESION = {
  fecha: "",
  hora: "",
  plazas_max: "",
};

export default function ActividadesClient({
  actividades: initial,
}: {
  actividades: Actividad[];
}) {
  const [actividades, setActividades] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Actividad | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sesionForms, setSesionForms] = useState<Record<string, typeof EMPTY_SESION>>({});
  const [isPending, startTransition] = useTransition();

  // ── Create / Edit modal ────────────────────────────────────────────────────

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(a: Actividad) {
    setEditTarget(a);
    setForm({
      titulo: a.titulo,
      descripcion: a.descripcion,
      facilitador: a.facilitador ?? "",
      precio_base: String(a.precio_base),
      duracion: a.duracion ?? "",
      imagen_url: a.imagen_url ?? "",
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        facilitador: form.facilitador.trim() || undefined,
        precio_base: parseFloat(form.precio_base),
        duracion: form.duracion.trim() || undefined,
        imagen_url: form.imagen_url.trim() || undefined,
      };

      if (editTarget) {
        const updated = await adminUpdateActividad(editTarget.id, payload);
        setActividades((prev) =>
          prev.map((a) =>
            a.id === editTarget.id
              ? {
                  ...a,
                  ...payload,
                  precio_base: Number(payload.precio_base),
                  facilitador: payload.facilitador ?? null,
                  duracion: payload.duracion ?? null,
                  imagen_url: payload.imagen_url ?? null,
                }
              : a
          )
        );
      } else {
        const created = await adminCreateActividad(payload);
        setActividades((prev) => [
          {
            id: created.id,
            titulo: created.titulo,
            descripcion: created.descripcion,
            facilitador: created.facilitador ?? null,
            precio_base: Number(created.precio_base),
            precio_extra: created.precio_extra !== null ? Number(created.precio_extra) : null,
            max_personas: created.max_personas ?? null,
            duracion: created.duracion ?? null,
            imagen_url: created.imagen_url ?? null,
            activa: created.activa,
            createdAt: created.createdAt.toISOString(),
            sesiones: [],
          },
          ...prev,
        ]);
      }
      closeModal();
    });
  }

  // ── Toggle active ──────────────────────────────────────────────────────────

  function handleToggleActiva(id: string, current: boolean) {
    startTransition(async () => {
      await adminUpdateActividad(id, { activa: !current });
      setActividades((prev) =>
        prev.map((a) => (a.id === id ? { ...a, activa: !current } : a))
      );
    });
  }

  // ── Delete actividad ───────────────────────────────────────────────────────

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta actividad y todas sus sesiones?")) return;
    startTransition(async () => {
      await adminDeleteActividad(id);
      setActividades((prev) => prev.filter((a) => a.id !== id));
      if (expanded === id) setExpanded(null);
    });
  }

  // ── Sesion form helpers ────────────────────────────────────────────────────

  function getSesionForm(id: string) {
    return sesionForms[id] ?? EMPTY_SESION;
  }

  function updateSesionForm(id: string, patch: Partial<typeof EMPTY_SESION>) {
    setSesionForms((prev) => ({
      ...prev,
      [id]: { ...getSesionForm(id), ...patch },
    }));
  }

  function handleAddSesion(actividadId: string) {
    const sf = getSesionForm(actividadId);
    if (!sf.fecha) return;
    startTransition(async () => {
      const created = await adminCreateSesion({
        actividad_id: actividadId,
        fecha: sf.fecha,
        hora: sf.hora || undefined,
        plazas_max: sf.plazas_max ? parseInt(sf.plazas_max) : undefined,
      });
      const newSesion: Sesion = {
        id: created.id,
        actividad_id: created.actividad_id,
        fecha: created.fecha.toISOString(),
        hora: created.hora ?? null,
        plazas_max: created.plazas_max ?? null,
        activa: created.activa,
        createdAt: created.createdAt.toISOString(),
      };
      setActividades((prev) =>
        prev.map((a) =>
          a.id === actividadId
            ? { ...a, sesiones: [...a.sesiones, newSesion] }
            : a
        )
      );
      updateSesionForm(actividadId, EMPTY_SESION);
    });
  }

  function handleDeleteSesion(actividadId: string, sesionId: string) {
    startTransition(async () => {
      await adminDeleteSesion(sesionId);
      setActividades((prev) =>
        prev.map((a) =>
          a.id === actividadId
            ? { ...a, sesiones: a.sesiones.filter((s) => s.id !== sesionId) }
            : a
        )
      );
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-3xl text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Actividades
          </h1>
          <p className="text-sm text-[#2C1810]/50 mt-1">
            {actividades.length} actividad{actividades.length !== 1 ? "es" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3d5636] transition-colors"
        >
          <Plus size={16} />
          Nueva Actividad
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E8DCC8] overflow-hidden">
        {actividades.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#2C1810]/40">
            No hay actividades todavía. Crea la primera.
          </div>
        ) : (
          <div className="divide-y divide-[#E8DCC8]">
            {actividades.map((a) => (
              <div key={a.id}>
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#FAFAF6] transition-colors"
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                >
                  {/* Active badge */}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                      a.activa
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {a.activa ? "Activa" : "Inactiva"}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#2C1810] truncate">
                      {a.titulo}
                    </div>
                    <div className="text-xs text-[#2C1810]/50 mt-0.5">
                      {a.facilitador && <span>{a.facilitador} · </span>}
                      {a.precio_base.toLocaleString("es-ES")} €
                      {a.duracion && <span> · {a.duracion}</span>}
                      <span> · {a.sesiones.length} sesion{a.sesiones.length !== 1 ? "es" : ""}</span>
                    </div>
                  </div>

                  {/* Actions — stop propagation so clicks don't toggle expand */}
                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleToggleActiva(a.id, a.activa)}
                      disabled={isPending}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#F0EAD6] text-[#2C1810]/70 hover:bg-[#E8DCC8] transition-colors disabled:opacity-50"
                    >
                      {a.activa ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => openEdit(a)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-[#2C1810]/40 hover:bg-[#F0EAD6] hover:text-[#2C1810] transition-colors disabled:opacity-50"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-[#2C1810]/40 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="text-[#2C1810]/30 shrink-0">
                    {expanded === a.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                </div>

                {/* Expanded: sessions */}
                {expanded === a.id && (
                  <div className="px-6 pb-6 bg-[#FAFAF6] border-t border-[#E8DCC8]">
                    <p className="text-xs uppercase tracking-wide text-[#2C1810]/40 mt-4 mb-3">
                      Sesiones
                    </p>

                    {a.sesiones.length === 0 ? (
                      <p className="text-xs text-[#2C1810]/40 mb-3">
                        Sin sesiones programadas.
                      </p>
                    ) : (
                      <ul className="space-y-1.5 mb-4">
                        {a.sesiones.map((s) => (
                          <li
                            key={s.id}
                            className="flex items-center justify-between bg-white border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm"
                          >
                            <div className="text-[#2C1810]">
                              <span className="font-medium">{fmt(s.fecha)}</span>
                              {s.hora && (
                                <span className="text-[#2C1810]/60 ml-2">
                                  {s.hora}
                                </span>
                              )}
                              {s.plazas_max && (
                                <span className="text-[#2C1810]/50 ml-2 text-xs">
                                  · {s.plazas_max} plazas
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteSesion(a.id, s.id)}
                              disabled={isPending}
                              className="p-1 rounded text-[#2C1810]/30 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Add session form */}
                    <div className="flex flex-wrap gap-2 items-end">
                      <div>
                        <label className="block text-xs text-[#2C1810]/50 mb-1">
                          Fecha *
                        </label>
                        <input
                          type="date"
                          value={getSesionForm(a.id).fecha}
                          onChange={(e) =>
                            updateSesionForm(a.id, { fecha: e.target.value })
                          }
                          className="border border-[#E8DCC8] rounded-lg px-2.5 py-1.5 text-sm text-[#2C1810] bg-white focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#2C1810]/50 mb-1">
                          Hora
                        </label>
                        <input
                          type="time"
                          value={getSesionForm(a.id).hora}
                          onChange={(e) =>
                            updateSesionForm(a.id, { hora: e.target.value })
                          }
                          className="border border-[#E8DCC8] rounded-lg px-2.5 py-1.5 text-sm text-[#2C1810] bg-white focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#2C1810]/50 mb-1">
                          Plazas máx.
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={getSesionForm(a.id).plazas_max}
                          onChange={(e) =>
                            updateSesionForm(a.id, { plazas_max: e.target.value })
                          }
                          placeholder="—"
                          className="w-24 border border-[#E8DCC8] rounded-lg px-2.5 py-1.5 text-sm text-[#2C1810] bg-white focus:outline-none focus:border-[#4A6741]"
                        />
                      </div>
                      <button
                        onClick={() => handleAddSesion(a.id)}
                        disabled={isPending || !getSesionForm(a.id).fecha}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A6741] text-[#F0EAD6] text-xs font-medium hover:bg-[#3d5636] transition-colors disabled:opacity-50"
                      >
                        <CalendarPlus size={13} />
                        Añadir sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#E8DCC8] w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DCC8]">
              <h2
                className="text-xl text-[#2C1810]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {editTarget ? "Editar actividad" : "Nueva actividad"}
              </h2>
              <button
                onClick={closeModal}
                className="text-[#2C1810]/40 hover:text-[#2C1810] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <Field
                label="Título *"
                value={form.titulo}
                onChange={(v) => setForm((f) => ({ ...f, titulo: v }))}
                required
              />
              <div>
                <label className="block text-xs text-[#2C1810]/60 mb-1.5">
                  Descripción *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descripcion: e.target.value }))
                  }
                  className="w-full border border-[#E8DCC8] rounded-xl px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#4A6741] resize-none"
                />
              </div>
              <Field
                label="Facilitador"
                value={form.facilitador}
                onChange={(v) => setForm((f) => ({ ...f, facilitador: v }))}
              />
              <Field
                label="Precio base (€) *"
                type="number"
                min="0"
                step="0.01"
                value={form.precio_base}
                onChange={(v) => setForm((f) => ({ ...f, precio_base: v }))}
                required
              />
              <Field
                label="Duración"
                value={form.duracion}
                onChange={(v) => setForm((f) => ({ ...f, duracion: v }))}
                placeholder="ej. 2 horas"
              />
              <Field
                label="URL de imagen"
                value={form.imagen_url}
                onChange={(v) => setForm((f) => ({ ...f, imagen_url: v }))}
                placeholder="https://..."
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8DCC8] text-sm text-[#2C1810]/60 hover:bg-[#FAFAF6] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#4A6741] text-[#F0EAD6] text-sm font-medium hover:bg-[#3d5636] transition-colors disabled:opacity-50"
                >
                  {editTarget ? "Guardar cambios" : "Crear actividad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[#2C1810]/60 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full border border-[#E8DCC8] rounded-xl px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#4A6741]"
      />
    </div>
  );
}
