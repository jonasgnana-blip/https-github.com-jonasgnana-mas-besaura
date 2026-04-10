import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import AlojamientoCliente from "./AlojamientoCliente";
import { getComplementos, getUnavailableDates } from "@/app/actions/reservas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alojamiento",
  description:
    "Tres habitaciones únicas entre bosques y ríos en Mas Besaura, Vidrà (Girona). Alojamiento con desayuno o media pensión. La Cabanya: sala de 350 m² para grupos.",
};

export default async function AlojamientoPage() {
  const [compls, datesArtemisa, datesSelene, datesHecate, datesCabanya] =
    await Promise.all([
      getComplementos(),
      getUnavailableDates("artemisa"),
      getUnavailableDates("selene"),
      getUnavailableDates("hecate"),
      getUnavailableDates("la-cabanya"),
    ]);

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <NavBar />
      <AlojamientoCliente
        complementos={compls}
        datesArtemisa={datesArtemisa}
        datesSelene={datesSelene}
        datesHecate={datesHecate}
        datesCabanya={datesCabanya}
      />
    </div>
  );
}
