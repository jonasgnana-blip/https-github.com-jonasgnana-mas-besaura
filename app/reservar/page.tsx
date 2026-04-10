import { getComplementos, getUnavailableDates } from "@/app/actions/reservas";
import ReservarClient from "./ReservarClient";

export const dynamic = "force-dynamic";

const HABITACION_ID = "mas-besaura-casa";

export default async function ReservarPage() {
  const [complementos, unavailableDates] = await Promise.all([
    getComplementos(),
    getUnavailableDates(HABITACION_ID),
  ]);

  return (
    <ReservarClient
      habitacionId={HABITACION_ID}
      complementos={complementos.map((c) => ({
        ...c,
        precio: Number(c.precio),
      }))}
      unavailableDates={unavailableDates}
    />
  );
}
