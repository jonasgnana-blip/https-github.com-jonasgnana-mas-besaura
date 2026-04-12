import type { Metadata } from "next";
import { getComplementos, getUnavailableDates } from "@/app/actions/reservas";
import ReservarClient from "./ReservarClient";

export const metadata: Metadata = {
  title: "Reservar Habitación",
  description:
    "Reserva tu estancia en Mas Besaura, Vidrà (Girona). Habitaciones con desayuno o media pensión. Complementos opcionales. Pago seguro online.",
  alternates: { canonical: "https://masbesaura.com/reservar" },
  openGraph: {
    title: "Reservar Habitación — Mas Besaura",
    description:
      "Elige fechas, habitación y complementos. Reserva online segura en nuestra casa rural en Vidrà, Girona.",
    url: "https://masbesaura.com/reservar",
    images: [
      { url: "https://masbesaura.com/images/hero3.jpg", width: 1200, height: 630, alt: "Reservar habitación Mas Besaura" },
    ],
  },
  robots: { index: false, follow: false },
};

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
