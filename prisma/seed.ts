import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar datos previos
  await prisma.reservaComplemento.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.complemento.deleteMany();
  await prisma.habitacion.deleteMany();

  // Habitación principal
  const habitacion = await prisma.habitacion.create({
    data: {
      id: "mas-besaura-casa",
      nombre: "Mas Besaura — Casa Completa",
      descripcion:
        "La masía completa para grupos y familias. Piedra, madera y vistas al bosque. Hasta 8 personas.",
      precio_noche: 150,
      capacidad: 8,
      imagenes: [],
    },
  });

  // Complementos
  await prisma.complemento.createMany({
    data: [
      {
        id: "lena",
        nombre: "Leña para chimenea",
        descripcion: "Cesto de leña seca para veladas junto al fuego.",
        precio: 18,
        tipo_cobro: "PAGO_UNICO",
      },
      {
        id: "romantico",
        nombre: "Pack romántico",
        descripcion: "Vino artesanal, flores silvestres y velas.",
        precio: 45,
        tipo_cobro: "PAGO_UNICO",
      },
      {
        id: "desayuno",
        nombre: "Desayuno ecológico",
        descripcion: "Productos locales y de temporada cada mañana.",
        precio: 12,
        tipo_cobro: "POR_NOCHE",
      },
      {
        id: "bienvenida",
        nombre: "Cesta de bienvenida",
        descripcion: "Embutidos, quesos y mermeladas de la comarca.",
        precio: 30,
        tipo_cobro: "PAGO_UNICO",
      },
    ],
  });

  console.log("✅ Seed completado");
  console.log("   Habitación:", habitacion.nombre);
  console.log("   Complementos: 4 creados");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
