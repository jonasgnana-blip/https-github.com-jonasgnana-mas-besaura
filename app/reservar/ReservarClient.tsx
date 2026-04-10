"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Coffee,
  TreePine,
  Package,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { createReserva } from "@/app/actions/reservas";
import type { DateRange } from "@/app/actions/reservas";

// ── Tipos ──────────────────────────────────────────────────────────────────

type Complemento = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo_cobro: "PAGO_UNICO" | "POR_NOCHE";
};

type Props = {
  habitacionId: string;
  complementos: Complemento[];
  unavailableDates: DateRange[];
};

type TipoAlquiler = "casa" | "sala";

const OPCIONES_ALQUILER = [
  {
    id: "casa" as TipoAlquiler,
    nombre: "Casa Completa",
    subtitulo: "12 personas + 2 facilitadores",
    descripcion: "Acceso a todas las habitaciones, salón comedor, sala interior y La Cabanya.",
    precio_noche: 400,
    emoji: "🏡",
  },
  {
    id: "sala" as TipoAlquiler,
    nombre: "La Cabanya",
    subtitulo: "Sala exterior · 350 m²",
    descripcion: "Alquiler del antiguo granero restaurado. Capacidad para más de 30 personas.",
    precio_noche: 180,
    emoji: "🏛️",
  },
];

const PRECIO_NOCHE = 400; // fallback

const ICON_MAP: Record<string, React.ReactNode> = {
  lena: <Flame size={20} className="text-[#8B6914]" />,
  romantico: <Heart size={20} className="text-[#C4A882]" />,
  desayuno: <Coffee size={20} className="text-[#4A6741]" />,
  bienvenida: <TreePine size={20} className="text-[#4A6741]" />,
};

// ── Utilidades ─────────────────────────────────────────────────────────────

function toISO(date: Date) {
  return date.toISOString().split("T")[0];
}

function daysBetween(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function isDateBlocked(date: Date, ranges: DateRange[]): boolean {
  const iso = toISO(date);
  return ranges.some((r) => iso >= r.entrada && iso < r.salida);
}

// ── Componente principal ───────────────────────────────────────────────────

export default function ReservarClient({
  habitacionId,
  complementos,
  unavailableDates,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Calendario
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [entrada, setEntrada] = useState<Date | null>(null);
  const [salida, setSalida] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<"entrada" | "salida">("entrada");
  const [hover, setHover] = useState<Date | null>(null);

  // Tipo de alquiler
  const [tipoAlquiler, setTipoAlquiler] = useState<TipoAlquiler>("casa");
  const opcionActual = OPCIONES_ALQUILER.find((o) => o.id === tipoAlquiler)!;

  // Complementos
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());

  // Step: "fechas" | "formulario"
  const [step, setStep] = useState<"fechas" | "formulario">("fechas");

  // Formulario cliente
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [serverError, setServerError] = useState("");

  // Días del mes
  const daysInMonth = useMemo(() => {
    const first = new Date(calYear, calMonth, 1);
    const last = new Date(calYear, calMonth + 1, 0);
    const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const days: (Date | null)[] = Array(startPad).fill(null);
    for (let d = 1; d <= last.getDate(); d++) {
      days.push(new Date(calYear, calMonth, d));
    }
    return days;
  }, [calYear, calMonth]);

  const monthName = new Date(calYear, calMonth).toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  function isInRange(date: Date) {
    const end = salida ?? hover;
    if (!entrada || !end) return false;
    return date > entrada && date < end;
  }

  function isSelected(date: Date) {
    return (
      (entrada && toISO(date) === toISO(entrada)) ||
      (salida && toISO(date) === toISO(salida))
    );
  }

  function handleDayClick(date: Date) {
    if (date < today || isDateBlocked(date, unavailableDates)) return;

    if (selecting === "entrada") {
      setEntrada(date);
      setSalida(null);
      setSelecting("salida");
    } else {
      if (date <= entrada!) {
        setEntrada(date);
        setSalida(null);
        setSelecting("salida");
      } else {
        // Verificar que no haya días bloqueados en el rango
        let hasBlock = false;
        const cursor = new Date(entrada!);
        cursor.setDate(cursor.getDate() + 1);
        while (cursor < date) {
          if (isDateBlocked(cursor, unavailableDates)) {
            hasBlock = true;
            break;
          }
          cursor.setDate(cursor.getDate() + 1);
        }
        if (hasBlock) {
          setEntrada(date);
          setSalida(null);
          setSelecting("salida");
        } else {
          setSalida(date);
          setSelecting("entrada");
        }
      }
    }
  }

  function toggleComplemento(id: string) {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const noches = entrada && salida ? daysBetween(entrada, salida) : 0;

  const precioTotal = useMemo(() => {
    if (!noches) return 0;
    let total = noches * opcionActual.precio_noche;
    for (const id of seleccionados) {
      const c = complementos.find((x) => x.id === id)!;
      if (!c) continue;
      total += c.tipo_cobro === "POR_NOCHE" ? c.precio * noches : c.precio;
    }
    return total;
  }, [noches, seleccionados, complementos]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    startTransition(async () => {
      const result = await createReserva({
        habitacion_id: habitacionId,
        fecha_entrada: toISO(entrada!),
        fecha_salida: toISO(salida!),
        nombre_cliente: nombre,
        email_cliente: email,
        telefono_cliente: telefono,
        complemento_ids: Array.from(seleccionados),
      });

      if (result.ok) {
        // Crear sesión de Stripe y redirigir
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reserva_id: result.reserva_id }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setServerError(data.error ?? "Error al iniciar el pago. Inténtalo de nuevo.");
        }
      } else {
        setServerError(result.error);
      }
    });
  }

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      {/* Header */}
      <header className="border-b border-[#E8DCC8] bg-[#FAFAF6]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          {step === "formulario" ? (
            <button
              onClick={() => setStep("fechas")}
              className="flex items-center gap-2 text-[#4A6741] hover:text-[#2C1810] transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> Volver
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 text-[#4A6741] hover:text-[#2C1810] transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> Volver
            </Link>
          )}
          <span className="text-[#E8DCC8]">|</span>
          <span
            className="text-lg text-[#2C1810]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {step === "fechas" ? "Selecciona tu estancia" : "Tus datos"}
          </span>
          {/* Stepper */}
          <div className="ml-auto flex items-center gap-2 text-xs text-[#2C1810]/40">
            <span className={step === "fechas" ? "text-[#4A6741] font-semibold" : ""}>
              1. Reserva
            </span>
            <span>→</span>
            <span className={step === "formulario" ? "text-[#4A6741] font-semibold" : ""}>
              2. Datos
            </span>
            <span>→</span>
            <span>3. Pago</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-10">
        {/* ── Columna izquierda ── */}
        <div>
          {step === "fechas" ? (
            <div className="space-y-10">
              {/* Tipo de alquiler */}
              <div>
                <h2
                  className="text-2xl text-[#2C1810] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  1. ¿Qué quieres reservar?
                </h2>
                <p className="text-sm text-[#2C1810]/55 mb-6">
                  Alquila la casa completa o solo la sala exterior La Cabanya.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-2">
                  {OPCIONES_ALQUILER.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setTipoAlquiler(op.id)}
                      className={[
                        "text-left p-5 rounded-xl border-2 transition-all",
                        tipoAlquiler === op.id
                          ? "border-[#4A6741] bg-[#4A6741]/5"
                          : "border-[#E8DCC8] bg-white hover:border-[#C4A882]",
                      ].join(" ")}
                    >
                      <div className="text-2xl mb-2">{op.emoji}</div>
                      <div className="font-semibold text-[#2C1810] mb-0.5">{op.nombre}</div>
                      <div className="text-xs text-[#2C1810]/55 mb-2">{op.subtitulo}</div>
                      <div className="text-xs text-[#2C1810]/50 leading-relaxed">{op.descripcion}</div>
                      <div className="mt-3 text-sm font-semibold text-[#4A6741]">
                        desde {op.precio_noche}€ / noche
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-[#F0EAD6] rounded-xl text-sm text-[#2C1810]/70 leading-relaxed">
                  💡 <strong className="text-[#2C1810]">Alojamiento:</strong> +45€/persona con desayuno · +60€/persona con media pensión.{" "}
                  La pensión completa se ofrece únicamente en Retiros organizados.
                </div>
              </div>

              {/* Calendario */}
              <div>
                <h2
                  className="text-2xl text-[#2C1810] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  2. Selecciona tus fechas
                </h2>
                <p className="text-sm text-[#2C1810]/55 mb-6">
                  {selecting === "entrada"
                    ? "Haz clic en el día de llegada."
                    : "Ahora selecciona el día de salida."}
                </p>

                <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 max-w-md">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="p-2 rounded-full hover:bg-[#F0EAD6] transition-colors text-[#2C1810]/50">
                      <ChevronLeft size={18} />
                    </button>
                    <span
                      className="text-base font-medium text-[#2C1810] capitalize"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {monthName}
                    </span>
                    <button onClick={nextMonth} className="p-2 rounded-full hover:bg-[#F0EAD6] transition-colors text-[#2C1810]/50">
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 mb-2">
                    {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
                      <div key={d} className="text-center text-xs font-medium text-[#2C1810]/40 py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-1">
                    {daysInMonth.map((date, i) => {
                      if (!date) return <div key={`pad-${i}`} />;
                      const isPast = date < today;
                      const blocked = isDateBlocked(date, unavailableDates);
                      const selected = isSelected(date);
                      const inRange = isInRange(date);
                      const isToday = toISO(date) === toISO(today);
                      const disabled = isPast || blocked;

                      return (
                        <button
                          key={toISO(date)}
                          disabled={disabled}
                          onClick={() => handleDayClick(date)}
                          onMouseEnter={() => !disabled && setHover(date)}
                          onMouseLeave={() => setHover(null)}
                          className={[
                            "h-9 w-full text-sm rounded-full transition-colors",
                            disabled ? "text-[#2C1810]/20 cursor-not-allowed" + (blocked ? " line-through" : "") : "cursor-pointer",
                            selected ? "bg-[#4A6741] text-white font-semibold"
                              : inRange ? "bg-[#4A6741]/15 text-[#2C1810]"
                              : isToday ? "border border-[#4A6741] text-[#4A6741]"
                              : !disabled ? "hover:bg-[#F0EAD6] text-[#2C1810]"
                              : "",
                          ].filter(Boolean).join(" ")}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 mt-4 pt-4 border-t border-[#E8DCC8] text-xs text-[#2C1810]/50">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#4A6741] inline-block" /> Seleccionado
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#E8DCC8] inline-block" /> No disponible
                    </span>
                  </div>
                </div>
              </div>

              {/* Complementos */}
              <div>
                <h2
                  className="text-2xl text-[#2C1810] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  3. Añade complementos
                </h2>
                <p className="text-sm text-[#2C1810]/55 mb-6">
                  Opcionales. El precio se actualiza automáticamente.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {complementos.map((c) => {
                    const selected = seleccionados.has(c.id);
                    const precioMostrado =
                      c.tipo_cobro === "POR_NOCHE" && noches
                        ? c.precio * noches
                        : c.precio;
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleComplemento(c.id)}
                        className={[
                          "text-left p-5 rounded-xl border-2 transition-all",
                          selected
                            ? "border-[#4A6741] bg-[#4A6741]/5"
                            : "border-[#E8DCC8] bg-white hover:border-[#C4A882]",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#F0EAD6] flex items-center justify-center shrink-0">
                              {ICON_MAP[c.id] ?? <Package size={20} className="text-[#2C1810]/40" />}
                            </div>
                            <div>
                              <div className="font-medium text-[#2C1810] text-sm">{c.nombre}</div>
                              <div className="text-xs text-[#2C1810]/55 mt-0.5">{c.descripcion}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-semibold text-[#4A6741]">
                              +{precioMostrado}€
                            </div>
                            <div className="text-xs text-[#2C1810]/40">
                              {c.tipo_cobro === "POR_NOCHE" ? "/ noche" : "único"}
                            </div>
                          </div>
                        </div>
                        {selected && (
                          <div className="mt-3 text-xs text-[#4A6741] font-medium">✓ Añadido</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ── Formulario datos cliente ── */
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
              <div>
                <h2
                  className="text-2xl text-[#2C1810] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  3. Tus datos de contacto
                </h2>
                <p className="text-sm text-[#2C1810]/55 mb-8">
                  Los usaremos para enviarte la confirmación y contactar contigo si es necesario.
                </p>
              </div>

              {[
                { id: "nombre", label: "Nombre completo", type: "text", value: nombre, setter: setNombre, placeholder: "Ana García López", required: true },
                { id: "email", label: "Email", type: "email", value: email, setter: setEmail, placeholder: "ana@email.com", required: true },
                { id: "telefono", label: "Teléfono", type: "tel", value: telefono, setter: setTelefono, placeholder: "+34 600 000 000", required: true },
              ].map(({ id, label, type, value, setter, placeholder, required }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-[#2C1810] mb-2">
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8DCC8] bg-white text-[#2C1810] placeholder-[#2C1810]/30 focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 focus:border-[#4A6741] transition-colors"
                  />
                </div>
              ))}

              {serverError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-full bg-[#4A6741] text-[#F0EAD6] font-semibold hover:bg-[#3A5432] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <><Loader2 size={18} className="animate-spin" /> Procesando...</>
                ) : (
                  "Confirmar y continuar al pago →"
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── Resumen lateral ── */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6">
            <h3
              className="text-xl text-[#2C1810] mb-5"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Resumen
            </h3>

            <div className="bg-[#F0EAD6] rounded-xl p-4 mb-5">
              <div className="text-sm font-medium text-[#2C1810]">
                {opcionActual.emoji} Mas Besaura — {opcionActual.nombre}
              </div>
              <div className="text-xs text-[#2C1810]/55 mt-1">{opcionActual.subtitulo}</div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#2C1810]/60">Llegada</span>
                <span className="font-medium text-[#2C1810]">
                  {entrada ? entrada.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2C1810]/60">Salida</span>
                <span className="font-medium text-[#2C1810]">
                  {salida ? salida.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </span>
              </div>
              {noches > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#2C1810]/60">Noches</span>
                  <span className="font-medium text-[#2C1810]">{noches}</span>
                </div>
              )}
            </div>

            {noches > 0 && (
              <div className="border-t border-[#E8DCC8] pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2C1810]/60">{noches} noche{noches > 1 ? "s" : ""} × {opcionActual.precio_noche}€</span>
                  <span className="text-[#2C1810]">{noches * opcionActual.precio_noche}€</span>
                </div>
                {Array.from(seleccionados).map((id) => {
                  const c = complementos.find((x) => x.id === id);
                  if (!c) return null;
                  const precio = c.tipo_cobro === "POR_NOCHE" ? c.precio * noches : c.precio;
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span className="text-[#2C1810]/60">{c.nombre}</span>
                      <span className="text-[#2C1810]">+{precio}€</span>
                    </div>
                  );
                })}
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-[#E8DCC8]">
                  <span className="text-[#2C1810]">Total</span>
                  <span className="text-[#4A6741]">{precioTotal}€</span>
                </div>
              </div>
            )}

            {step === "fechas" && (
              <button
                disabled={noches <= 0}
                onClick={() => setStep("formulario")}
                className={[
                  "w-full py-3.5 rounded-full font-semibold text-sm transition-colors",
                  noches > 0
                    ? "bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432]"
                    : "bg-[#E8DCC8] text-[#2C1810]/30 cursor-not-allowed",
                ].join(" ")}
              >
                {noches > 0 ? "Continuar con los datos →" : "Selecciona tus fechas"}
              </button>
            )}

            <p className="text-xs text-center text-[#2C1810]/40 mt-3">
              No se realizará ningún cargo hasta confirmar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
