import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // regenerate once per hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://masbesaura.com";
  const now = new Date();

  const actividades = await prisma.actividad.findMany({
    where: { activa: true },
    select: { id: true, updatedAt: true },
    orderBy: { orden: "asc" },
  });

  return [
    { url: base,                    lastModified: now, changeFrequency: "weekly",  priority: 1    },
    { url: `${base}/la-casa`,       lastModified: now, changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/alojamiento`,   lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/actividades`,   lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    ...actividades.map((act) => ({
      url: `${base}/actividades/${act.id}`,
      lastModified: act.updatedAt ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    { url: `${base}/alquiler`,      lastModified: now, changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/reservar`,      lastModified: now, changeFrequency: "monthly", priority: 0.6  },
  ];
}
