import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, Calendar, Mail, Phone, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ reserva_id?: string; reserva_actividad_id?: string }>;
}) {
  const { reserva_id, reserva_actividad_id } = await searchParams;

  // ── Alojamiento ──────────────────────────────────────────────────────────────
  if (reserva_id) {
    const reserva = await prisma.reserva.findUnique({
      where: { id: reserva_id },
      include: {
        habitacion: true,
        complementos: { include: { complemento: true } },
      },
    });

    if (reserva) {
      const noches = Math.round(
        (reserva.fecha_salida.getTime() - reserva.fecha_entrada.getTime()) / 86400000
      );
      return (
        <ExitoLayout titulo="¡Reserva confirmada!" subtitulo="Hemos recibido tu pago. Te esperamos en Mas Besaura.">
          <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4A6741] mb-4">
              {reserva.habitacion.nombre}
            </p>
            <div className="space-y-4">
              <Row icon={<Calendar size={16} />}>
                <span className="text-sm font-medium text-[#2C1810]">
                  {reserva.fecha_entrada.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  {" → "}
                  {reserva.fecha_salida.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="text-xs text-[#2C1810]/50 mt-0.5 block">
                  {noches} noche{noches > 1 ? "s" : ""}{reserva.num_adultos > 1 ? ` · ${reserva.num_adultos} personas` : ""}
                </span>
              </Row>
              <Row icon={<Mail size={16} />}>
                <span className="text-sm text-[#2C1810]">{reserva.email_cliente}</span>
              </Row>
              <Row icon={<Phone size={16} />}>
                <span className="text-sm text-[#2C1810]">{reserva.telefono_cliente}</span>
              </Row>
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
          <EmailNote email={reserva.email_cliente} />
        </ExitoLayout>
      );
    }
  }

  // ── Actividad / Cabanya / Alquiler ───────────────────────────────────────────
  if (reserva_actividad_id) {
    const ra = await prisma.reservaActividad.findUnique({
      where: { id: reserva_actividad_id },
    });

    if (ra) {
      const tipoLabel: Record<string, string> = {
        actividad: "Actividad",
        cabanya: "La Cabanya",
        alquiler: "Alquiler Casa",
      };
      const label = tipoLabel[ra.tipo] ?? ra.tipo;
      const nombre = ra.actividad_nombre ?? label;

      const fechaEntrada = ra.fecha_inicio
        ? ra.fecha_inicio.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
        : null;
      const fechaFin = ra.fecha_fin
        ? ra.fecha_fin.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
        : null;

      return (
        <ExitoLayout titulo="¡Reserva confirmada!" subtitulo="Hemos recibido tu pago. ¡Hasta pronto!">
          <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4A6741] mb-4">
              {nombre}
            </p>
            <div className="space-y-4">
              {fechaEntrada && (
                <Row icon={<Calendar size={16} />}>
                  <span className="text-sm font-medium text-[#2C1810]">
                    {fechaFin && fechaFin !== fechaEntrada
                      ? `${fechaEntrada} → ${fechaFin}`
                      : fechaEntrada}
                  </span>
                </Row>
              )}
              <Row icon={<Users size={16} />}>
                <span className="text-sm text-[#2C1810]">
                  {ra.num_adultos} persona{ra.num_adultos !== 1 ? "s" : ""}
                </span>
              </Row>
              <Row icon={<Mail size={16} />}>
                <span className="text-sm text-[#2C1810]">{ra.email_cliente}</span>
              </Row>
              {ra.telefono_cliente && (
                <Row icon={<Phone size={16} />}>
                  <span className="text-sm text-[#2C1810]">{ra.telefono_cliente}</span>
                </Row>
              )}
            </div>
            <div className="mt-5 pt-5 border-t border-[#E8DCC8] flex justify-between font-semibold">
              <span className="text-[#2C1810]">Total pagado</span>
              <span className="text-[#4A6741] text-lg">{Number(ra.precio_total)}€</span>
            </div>
          </div>
          <EmailNote email={ra.email_cliente} />
        </ExitoLayout>
      );
    }
  }

  // ── Fallback genérico ────────────────────────────────────────────────────────
  return (
    <ExitoLayout titulo="¡Pago recibido!" subtitulo="En breve recibirás un email de confirmación con todos los detalles.">
      <div className="bg-[#F0EAD6] rounded-xl p-4 mb-8 text-sm text-[#2C1810]/70 text-center">
        Si tienes alguna pregunta, escríbenos a{" "}
        <a href="https://wa.me/34665822542" className="text-[#4A6741] font-medium">WhatsApp</a>.
      </div>
    </ExitoLayout>
  );
}

// ── Componentes internos ──────────────────────────────────────────────────────

function ExitoLayout({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
}) {
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
            {titulo}
          </h1>
          <p className="text-[#2C1810]/60">{subtitulo}</p>
        </div>
        {children}
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

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[#C4A882] mt-0.5 shrink-0">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

function EmailNote({ email }: { email: string }) {
  return (
    <div className="bg-[#F0EAD6] rounded-xl p-4 mb-6 text-sm text-[#2C1810]/70 text-center">
      Hemos enviado la confirmación a <strong className="text-[#2C1810]">{email}</strong>
    </div>
  );
}
