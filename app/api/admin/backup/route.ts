import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  // Auth check
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Fetch all relevant data in parallel
  const [reservas, habitaciones, complementos, actividades, bloqueos, config] =
    await Promise.all([
      prisma.reserva.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          habitacion: { select: { nombre: true } },
          complementos: {
            include: { complemento: { select: { nombre: true } } },
          },
        },
      }),
      prisma.habitacion.findMany({ orderBy: { nombre: "asc" } }),
      prisma.complemento.findMany({ orderBy: { nombre: "asc" } }),
      prisma.actividad.findMany({ orderBy: { orden: "asc" } }),
      prisma.bloqueoManual.findMany({
        orderBy: { fecha_inicio: "asc" },
        include: { habitacion: { select: { nombre: true } } },
      }),
      prisma.sistemaConfig.findMany(),
    ]);

  const backup = {
    meta: {
      exportado_en: new Date().toISOString(),
      version: 1,
      sitio: "masbesaura.com",
    },

    reservas: reservas.map((r) => ({
      id: r.id,
      nombre_cliente: r.nombre_cliente,
      email_cliente: r.email_cliente,
      telefono_cliente: r.telefono_cliente,
      habitacion: r.habitacion?.nombre ?? "",
      fecha_entrada: r.fecha_entrada?.toISOString().split("T")[0] ?? "",
      fecha_salida: r.fecha_salida?.toISOString().split("T")[0] ?? "",
      precio_total: Number(r.precio_total),
      estado: r.estado,
      stripe_session_id: r.stripe_session_id ?? "",
      complementos: r.complementos.map((rc) => ({
        nombre: rc.complemento.nombre,
        precio_aplicado: Number(rc.precio_aplicado),
      })),
      creado_en: r.createdAt?.toISOString() ?? "",
    })),

    habitaciones: habitaciones.map((h) => ({
      id: h.id,
      nombre: h.nombre,
      descripcion: h.descripcion,
      capacidad: h.capacidad,
      precio_noche: Number(h.precio_noche),
      precio_desayuno: h.precio_desayuno != null ? Number(h.precio_desayuno) : null,
      precio_media_pension:
        h.precio_media_pension != null ? Number(h.precio_media_pension) : null,
      imagenes: h.imagenes,
    })),

    complementos: complementos.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      descripcion: c.descripcion,
      precio: Number(c.precio),
      tipo_cobro: c.tipo_cobro,
      activo: c.activo,
    })),

    actividades: actividades.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      descripcion: a.descripcion,
      precio_base: Number(a.precio_base),
      precio_texto: a.precio_texto,
      categoria: a.categoria,
      tipo_reserva: a.tipo_reserva,
      activa: a.activa,
      orden: a.orden,
    })),

    bloqueos_manuales: bloqueos.map((b) => ({
      id: b.id,
      habitacion: b.habitacion?.nombre ?? "",
      fecha_inicio: b.fecha_inicio.toISOString().split("T")[0],
      fecha_fin: b.fecha_fin.toISOString().split("T")[0],
      motivo: b.motivo ?? "",
    })),

    // Exclude any key that looks like a secret/token
    configuracion: config
      .filter(
        (c) =>
          !/(secret|key|token|password|pixel)/i.test(c.clave)
      )
      .map((c) => ({ clave: c.clave, valor: c.valor })),
  };

  const json = JSON.stringify(backup, null, 2);
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="masbesaura-backup-${date}.json"`,
      // Don't let proxies or browsers cache backup downloads
      "Cache-Control": "no-store",
    },
  });
}
