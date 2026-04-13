import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, Calendar, Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ reserva_id?: string }>;
}) {
  const { reserva_id } = await searchParams;

  const reserva = reserva_id
    ? await prisma.reserva.findUnique({
        where: { id: reserva_id },
        include: {
          habitacion: true,
          complementos: { include: { complemento: true } },
        },
      })
    : null;

  if (!reserva) {
    // Generic success page for actividades, cabanya, alquiler (no reserva_id)
    return (
      <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#4A6741]/10 flex items-center justify-center">
              <CheckCircle size={40} className="text-[#4A6741]" />
            </div>
          </div>
          <h1
            className="text-4xl text-[#2C1810] mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            ¡Pago recibido!
          </h1>
          <p className="text-[#2C1810]/60 mb-8">
            Hemos recibido tu pago correctamente. En breve recibirás un email de confirmación con todos los detalles.
          </p>
          <div className="bg-[#F0EAD6] rounded-xl p-4 mb-8 text-sm text-[#2C1810]/70">
            Si tienes alguna pregunta, escríbenos a{" "}
            <a href="https://wa.me/34665822542" className="text-[#4A6741] font-medium">WhatsApp</a>.
          </div>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-full bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432] transition-colors text-sm font-medium"
          >
            Volver al inicio
          </Link>
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
            ¡Reserva confirmada!
          </h1>
          <p className="text-[#2C1810]/60">
            Hemos recibido tu pago. Te esperamos en Mas Besaura.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#4A6741] mb-4">
            {reserva.habitacion.nombre}
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-[#C4A882] mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-[#2C1810]">
                  {reserva.fecha_entrada.toLocaleDateString("es-ES", {
                    day: "numeric", month: "long", year: "numeric",
                  })}{" "}→{" "}
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
              <div className="text-xs text-[#2C1810]/50 uppercase tracking-wide mb-3">Complementos</div>
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
            <span className="text-[#2C1810]">Total pagado</span>
            <span className="text-[#4A6741] text-lg">{Number(reserva.precio_total)}€</span>
          </div>
        </div>

        <div className="bg-[#F0EAD6] rounded-xl p-4 mb-8 text-sm text-[#2C1810]/70 text-center">
          Recibirás un email de confirmación en <strong>{reserva.email_cliente}</strong> con todos los detalles y las instrucciones de llegada.
        </div>

        <Link
          href="/"
          className="block text-center py-3 rounded-full bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432] transition-colors text-sm font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
