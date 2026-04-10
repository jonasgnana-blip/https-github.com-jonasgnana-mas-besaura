import { adminGetBloqueos, adminGetHabitaciones } from "@/app/actions/admin";
import BloqueosClient from "./BloqueosClient";

export const dynamic = "force-dynamic";

export default async function AdminBloqueosPage() {
  const [bloqueos, habitaciones] = await Promise.all([
    adminGetBloqueos(),
    adminGetHabitaciones(),
  ]);

  return (
    <BloqueosClient
      bloqueos={bloqueos.map((b) => ({
        id: b.id,
        habitacion_id: b.habitacion_id,
        habitacion: b.habitacion.nombre,
        fecha_inicio: b.fecha_inicio.toISOString().split("T")[0],
        fecha_fin: b.fecha_fin.toISOString().split("T")[0],
        motivo: b.motivo ?? "",
      }))}
      habitaciones={habitaciones.map((h) => ({
        id: h.id,
        nombre: h.nombre,
      }))}
    />
  );
}
