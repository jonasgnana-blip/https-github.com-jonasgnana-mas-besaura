import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function CanceladoPage({
  searchParams,
}: {
  searchParams: Promise<{ reserva_id?: string }>;
}) {
  const { reserva_id } = await searchParams;

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle size={40} className="text-red-400" />
          </div>
        </div>

        <h1
          className="text-4xl text-[#2C1810] mb-3"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Pago cancelado
        </h1>
        <p className="text-[#2C1810]/60 mb-8">
          No se ha realizado ningún cargo. Tus fechas siguen reservadas durante unos minutos mientras decides.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex-1 text-center py-3 rounded-full border border-[#E8DCC8] text-[#2C1810] hover:bg-[#F0EAD6] transition-colors text-sm font-medium"
          >
            Volver al inicio
          </Link>
          <Link
            href={reserva_id ? `/reservar?retry=${reserva_id}` : "/reservar"}
            className="flex-1 text-center py-3 rounded-full bg-[#4A6741] text-[#F0EAD6] hover:bg-[#3A5432] transition-colors text-sm font-medium"
          >
            Intentar de nuevo
          </Link>
        </div>
      </div>
    </div>
  );
}
