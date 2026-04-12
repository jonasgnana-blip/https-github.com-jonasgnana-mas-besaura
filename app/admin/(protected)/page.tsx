import { adminGetStats } from "@/app/actions/admin";
import { TrendingUp, Calendar, Clock, Euro } from "lucide-react";

export const dynamic = "force-dynamic";

function fmt(date: Date) {
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboard() {
  const stats = await adminGetStats();

  const cards = [
    {
      label: "Reservas confirmadas",
      value: stats.confirmadas,
      icon: <Calendar size={20} className="text-[#4A6741]" />,
      bg: "bg-[#4A6741]/8",
    },
    {
      label: "Pendientes de pago",
      value: stats.pendientes,
      icon: <Clock size={20} className="text-[#8B6914]" />,
      bg: "bg-[#8B6914]/8",
    },
    {
      label: "Total reservas",
      value: stats.total,
      icon: <TrendingUp size={20} className="text-[#C4A882]" />,
      bg: "bg-[#C4A882]/15",
    },
    {
      label: "Ingresos confirmados",
      value: `${stats.ingresos.toLocaleString("es-ES")} €`,
      icon: <Euro size={20} className="text-[#4A6741]" />,
      bg: "bg-[#4A6741]/8",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl text-[#2C1810]"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[#2C1810]/50 mt-1">
          Bienvenido al panel de administración de Mas Besaura.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {cards.map(({ label, value, icon, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-[#E8DCC8] p-6"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              {icon}
            </div>
            <div
              className="text-3xl font-semibold text-[#2C1810] mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {value}
            </div>
            <div className="text-xs text-[#2C1810]/50 uppercase tracking-wide">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Próximas llegadas */}
      <div className="bg-white rounded-2xl border border-[#E8DCC8] p-6">
        <h2
          className="text-xl text-[#2C1810] mb-5"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Próximas llegadas
        </h2>

        {stats.proximas.length === 0 ? (
          <p className="text-sm text-[#2C1810]/40 py-4 text-center">
            No hay llegadas próximas confirmadas.
          </p>
        ) : (
          <div className="divide-y divide-[#E8DCC8]">
            {stats.proximas.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <div className="text-sm font-medium text-[#2C1810]">
                    {r.nombre_cliente}
                  </div>
                  <div className="text-xs text-[#2C1810]/50 mt-0.5">
                    {fmt(new Date(r.fecha_entrada))} → {fmt(new Date(r.fecha_salida))}
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#4A6741]">
                  {Number(r.precio_total).toLocaleString("es-ES")} €
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
