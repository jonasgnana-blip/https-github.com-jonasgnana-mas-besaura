import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, Calendar, Phone, Mail, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  const reserva = id
    ? await prisma.reserva.findUnique({
        where: { id },
        include: {
          habitacion: true,
          complementos: { include: { complemento: true } },
        },
      })
    : null;

  if (!reserva) {
    return (
      <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#2C1810]/60 mb-4">Reserva no encontrada.</p>
          <Link href="/" className="text-[#4A6741] underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const noches = Math.round(
    (reserva.fecha_salida.getTime() - reserva.fecha_entrada.getTime()) / 86400000
  );

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full">
        {/* Icono de éxito */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#4A6741]/10 flex items-center justify-center">
            <CheckCircle size={40} className="text-[#4A6741]" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1
            className="text-4xl text-[#2C1810] mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            ¡Reserva recibida!
          </h1>
          <p className="text-[#2C1810]/60">
            Hemos guardado tu solicitud. Recibirás la confirmación por email
            una vez se procese el pago.
          </p>
        </div>

        {/* Tarjeta de resumen */}
        <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 mb-6">
          <div className="flex items-center gap-2 text-[#4A6741] text-xs font-semibold uppercase tracking-wide mb-5">
            <Home size={14} />
            {reserva.habitacion.nombre}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-[#C4A882] mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-[#2C1810]">
                  {reserva.fecha_entrada.toLocaleDateString("es-ES", {
                    day: "numeric", month: "long", year: "numeric",
                  })}{" "}
                  →{" "}
                  {reserva.fecha_salida.toLocaleDateString("es-ES", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </div>
                <div className="text-xs text-[#2C1810]/50 mt-0.5">
                  {noches} noche{noches > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#C4A882] shrink-0" />
              <span className="text-sm text-[#2C1810]">{reserva.email_cliente}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#C4A882] shrink-0" />
              <span className="text-sm text-[#2C1810]">{reserva.telefono_cliente}</span>
            </div>
          </div>

          {reserva.complementos.length > 0 && (
            <div className="mt-5 pt-5 border-t border-[#E8DCC8]">
              <div className="text-xs text-[#2C1810]/50 uppercase tracking-wide mb-3">
                Complementos
              </div>
              <ul className="space-y-1">
                {reserva.complementos.map((rc) => (
                  <li key={rc.id} className="flex justify-between text-sm">
                    <span className="text-[#2C1810]/70">{rc.complemento.nombre}</span>
                    <span className="text-[#2C1810]">{Number(rc.precio_aplicado)}€</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-[#E8DCC8] flex justify-between font-semibold">
            <span className="text-[#2C1810]">Total</span>
            <span className="text-[#4A6741] text-lg">{Number(reserva.precio_total)}€</span>
          </div>
        </div>

        {/* Estado pendiente */}
        <div className="bg-[#F0EAD6] rounded-xl p-4 mb-8 text-sm text-[#2C1810]/70 text-center">
          Tu reserva está en estado <strong className="text-[#8B6914]">pendiente de pago</strong>.
          Las fechas están bloqueadas durante 15 minutos mientras se procesa.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 text-center py-3 rounded-full border border-[#E8DCC8] text-[#2C1810] hover:bg-[#F0EAD6] transition-colors text-sm font-medium"
          >
            Volver al inicio
          </Link>
          <Link
            href="/reservar"
            className="flex-1 text-center py-3 rounded-full bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432] transition-colors text-sm font-medium"
          >
            Nueva reserva
          </Link>
        </div>
      </div>
    </div>
  );
}
