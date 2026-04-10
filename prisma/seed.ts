import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Upsert habitaciones (no borrar reservas existentes)
  const habitaciones = [
    {
      id: "artemisa",
      nombre: "Artemisa",
      descripcion: "2 camas individuales y una cama doble. Baño privado. Estufa de pellets. Orientación este.",
      precio_noche: 45,
      capacidad: 4,
      imagenes: ["/images/hero1.jpg"],
    },
    {
      id: "selene",
      nombre: "Selene",
      descripcion: "Habitación con altillo. 2 camas individuales abajo, 2 arriba. Estufa de pellets. Orientación norte.",
      precio_noche: 45,
      capacidad: 4,
      imagenes: ["/images/hero2.jpg"],
    },
    {
      id: "hecate",
      nombre: "Hécate",
      descripcion: "2 camas individuales y una cama doble. Estufa de pellets. Orientación oeste.",
      precio_noche: 45,
      capacidad: 4,
      imagenes: ["/images/hero3.jpg"],
    },
    {
      id: "la-cabanya",
      nombre: "La Cabanya",
      descripcion: "Sala granero de 350 m² con suelo de microcemento. Con baño, cocina eléctrica. Hasta 100 personas.",
      precio_noche: 10,
      capacidad: 100,
      imagenes: ["/images/hero8.jpg"],
    },
    {
      id: "mas-besaura-casa",
      nombre: "Mas Besaura — Casa Completa",
      descripcion: "La masía completa para grupos y familias. Hasta 12 personas.",
      precio_noche: 400,
      capacidad: 12,
      imagenes: [],
    },
  ];

  for (const hab of habitaciones) {
    await prisma.habitacion.upsert({
      where: { id: hab.id },
      update: { nombre: hab.nombre, descripcion: hab.descripcion, precio_noche: hab.precio_noche, capacidad: hab.capacidad },
      create: hab,
    });
  }

  // Upsert complementos
  const complementos = [
    { id: "lena", nombre: "Leña para chimenea", descripcion: "Cesto de leña seca para veladas junto al fuego.", precio: 18, tipo_cobro: "PAGO_UNICO" as const },
    { id: "romantico", nombre: "Pack romántico", descripcion: "Vino artesanal, flores silvestres y velas.", precio: 45, tipo_cobro: "PAGO_UNICO" as const },
    { id: "desayuno", nombre: "Desayuno ecológico", descripcion: "Productos locales y de temporada cada mañana.", precio: 12, tipo_cobro: "POR_NOCHE" as const },
    { id: "bienvenida", nombre: "Cesta de bienvenida", descripcion: "Embutidos, quesos y mermeladas de la comarca.", precio: 30, tipo_cobro: "PAGO_UNICO" as const },
  ];

  for (const c of complementos) {
    await prisma.complemento.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }

  console.log("✅ Seed completado — habitaciones y complementos listos");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
