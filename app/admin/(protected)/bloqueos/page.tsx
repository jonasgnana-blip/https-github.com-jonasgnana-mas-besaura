import { adminGetBloqueos, adminGetHabitaciones } from "@/app/actions/admin";
import BloqueosClient from "./BloqueosClient";

export const dynamic = "force-dynamic";

// Only these IDs are valid blockable resources (no duplicates, no "casa completa")
const BLOCKABLE_IDS = ["artemisa", "selene", "hecate", "la-cabanya"];

export default async function AdminBloqueosPage() {
  const [bloqueos, habitacionesAll] = await Promise.all([
    adminGetBloqueos(),
    adminGetHabitaciones(),
  ]);

  // Keep only the 3 rooms + La Cabanya, in a defined order
  const habitaciones = BLOCKABLE_IDS
    .map((id) => habitacionesAll.find((h) => h.id === id))
    .filter(Boolean) as typeof habitacionesAll;

  return (
    <BloqueosClient
      bloqueos={bloqueos
        .filter((b) => BLOCKABLE_IDS.includes(b.habitacion_id))
        .map((b) => ({
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
