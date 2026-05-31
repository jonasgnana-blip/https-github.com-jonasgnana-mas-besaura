import { adminGetCodigos } from "@/app/actions/admin";
import CodigosClient from "./CodigosClient";

export const dynamic = "force-dynamic";

export default async function AdminCodigosPage() {
  const codigos = await adminGetCodigos();

  return (
    <CodigosClient
      codigos={codigos.map((c) => ({
        id: c.id,
        codigo: c.codigo,
        tipo: c.tipo,
        valor: Number(c.valor),
        descripcion: c.descripcion ?? "",
        activo: c.activo,
        usos_max: c.usos_max ?? null,
        usos_actual: c.usos_actual,
        expira_en: c.expira_en ? c.expira_en.toISOString().split("T")[0] : null,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
