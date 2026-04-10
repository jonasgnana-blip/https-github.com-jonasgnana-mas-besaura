"use client";

import { useState, useTransition } from "react";
import { adminUpdateReservaEstado } from "@/app/actions/admin";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

// Defined locally to avoid importing Prisma in a client bundle
const EstadoReserva = {
  CONFIRMADA: "CONFIRMADA",
  PENDIENTE_PAGO: "PENDIENTE_PAGO",
  CANCELADA: "CANCELADA",
  EXPIRADA: "EXPIRADA",
} as const;
type EstadoReserva = (typeof EstadoReserva)[keyof typeof EstadoReserva];

type Reserva = {
  id: string;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  fecha_entrada: string;
  fecha_salida: string;
  estado: EstadoReserva;
  precio_total: number;
  createdAt: string;
  habitacion: string;
  complementos: { nombre: string; precio: number }[];
};

const ESTADO_LABEL: Record<EstadoReserva, string> = {
  CONFIRMADA: "Confirmada",
  PENDIENTE_PAGO: "Pendiente",
  CANCELADA: "Cancelada",
  EXPIRADA: "Expirada",
};

const ESTADO_COLOR: Record<EstadoReserva, string> = {
  CONFIRMADA: "bg-green-100 text-green-700",
  PENDIENTE_PAGO: "bg-amber-100 text-amber-700",
  CANCELADA: "bg-red-100 text-red-600",
  EXPIRADA: "bg-gray-100 text-gray-500",
};

const FILTROS = ["TODAS", "CONFIRMADA", "PENDIENTE_PAGO", "CANCELADA", "EXPIRADA"] as const;

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReservasClient({ reservas: initial }: { reservas: Reserva[] }) {
  const [reservas, setReservas] = useState(initial);
  const [filtro, setFiltro] = useState<typeof FILTROS[number]>("TODAS");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = filtro === "TODAS" ? reservas : reservas.filter((r) => r.estado === filtro);

  function updateLocal(id: string, estado: EstadoReserva) {
    setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r)));
  }

  function handleUpdate(id: string, estado: EstadoReserva) {
    startTransition(async () => {
      await adminUpdateReservaEstado(id, estado);
      updateLocal(id, estado);
    });
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-3xl text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Reservas
          </h1>
          <p className="text-sm text-[#2C1810]/50 mt-1">
            {filtered.length} reserva{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              filtro === f
                ? "bg-[#4A6741] text-white"
                : "bg-white border border-[#E8DCC8] text-[#2C1810]/60 hover:border-[#C4A882]",
            ].join(" ")}
          >
            {f === "TODAS" ? "Todas" : ESTADO_LABEL[f as EstadoReserva]}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-[#E8DCC8] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#2C1810]/40">
            No hay reservas en este estado.
          </div>
        ) : (
          <div className="divide-y divide-[#E8DCC8]">
            {filtered.map((r) => (
              <div key={r.id}>
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#FAFAF6] transition-colors"
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  {/* Estado */}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${ESTADO_COLOR[r.estado]}`}>
                    {ESTADO_LABEL[r.estado]}
                  </span>

                  {/* Cliente */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#2C1810] truncate">
                      {r.nombre_cliente}
                    </div>
                    <div className="text-xs text-[#2C1810]/50 mt-0.5">
                      {fmt(r.fecha_entrada)} → {fmt(r.fecha_salida)} · {r.habitacion}
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="text-sm font-semibold text-[#4A6741] shrink-0">
                    {r.precio_total.toLocaleString("es-ES")} €
                  </div>

                  {/* Expand */}
                  <div className="text-[#2C1810]/30 shrink-0">
                    {expanded === r.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Detalle expandido */}
                {expanded === r.id && (
                  <div className="px-6 pb-5 bg-[#FAFAF6] border-t border-[#E8DCC8]">
                    <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
                      <div className="space-y-2">
                        <Row label="Email" value={r.email_cliente} />
                        <Row label="Teléfono" value={r.telefono_cliente} />
                        <Row label="Creada" value={fmt(r.createdAt)} />
                        <Row label="ID" value={r.id.slice(0, 12) + "…"} />
                      </div>
                      {r.complementos.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-wide text-[#2C1810]/40 mb-2">
                            Complementos
                          </p>
                          {r.complementos.map((c) => (
                            <div key={c.nombre} className="flex justify-between text-xs text-[#2C1810]/70">
                              <span>{c.nombre}</span>
                              <span>{c.precio} €</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 mt-5 flex-wrap">
                      {r.estado !== "CONFIRMADA" && (
                        <ActionBtn
                          onClick={() => handleUpdate(r.id, EstadoReserva.CONFIRMADA)}
                          disabled={isPending}
                          color="green"
                          icon={<CheckCircle size={14} />}
                          label="Confirmar"
                        />
                      )}
                      {r.estado !== "CANCELADA" && (
                        <ActionBtn
                          onClick={() => handleUpdate(r.id, EstadoReserva.CANCELADA)}
                          disabled={isPending}
                          color="red"
                          icon={<XCircle size={14} />}
                          label="Cancelar"
                        />
                      )}
                      {r.estado !== "PENDIENTE_PAGO" && r.estado !== "EXPIRADA" && (
                        <ActionBtn
                          onClick={() => handleUpdate(r.id, EstadoReserva.PENDIENTE_PAGO)}
                          disabled={isPending}
                          color="amber"
                          icon={<Clock size={14} />}
                          label="Marcar pendiente"
                        />
                      )}
                      <a
                        href={`https://wa.me/${r.telefono_cliente.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(r.nombre_cliente.split(" ")[0])}%2C%20te%20escribo%20desde%20Mas%20Besaura%20respecto%20a%20tu%20reserva.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-[#2C1810]/40 w-20 shrink-0">{label}</span>
      <span className="text-[#2C1810]/80 break-all">{value}</span>
    </div>
  );
}

function ActionBtn({
  onClick, disabled, color, icon, label,
}: {
  onClick: () => void;
  disabled: boolean;
  color: "green" | "red" | "amber";
  icon: React.ReactNode;
  label: string;
}) {
  const colors = {
    green: "bg-green-100 text-green-700 hover:bg-green-200",
    red: "bg-red-100 text-red-600 hover:bg-red-200",
    amber: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}
