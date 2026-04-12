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

  // Upsert actividades
  const actividades = [
    {
      id: "actividad-familiar",
      titulo: "Activitat Familiar — Ruta Orientació i Gimcana",
      descripcion: "Paseo por sendero, el bosque y el río. Visita a la cueva y un lugar secreto donde bailan las hadas con los duendes. Una experiencia mágica para toda la familia.",
      imagen_url: "/images/hero4.jpg",
      categoria: "Familiar",
      precio_base: 10,
      precio_texto: "10€/adulto · Niños menores de 16 años: gratis",
      tipo_reserva: "simple",
      orden: 1,
      activa: true,
    },
    {
      id: "btt-brunch",
      titulo: "Ruta BTT amb Brunch",
      descripcion: "Diferentes rutas por la zona entre el Ripollès y la Garrotxa con desayuno de tenedor incluido.",
      imagen_url: "/images/hero5.jpg",
      categoria: "Deporte & Gastronomia",
      precio_base: 20,
      precio_texto: "20€/persona",
      tipo_reserva: "con_fecha",
      orden: 2,
      activa: true,
    },
    {
      id: "constelacio-familiar",
      titulo: "Constel·lació Familiar",
      descripcion: "Trabajo terapéutico en grupo, familia o equipo profesional, que combina dinámicas grupales e indicaciones terapéuticas.",
      imagen_url: "/images/hero6.jpg",
      categoria: "Terapia Grupal",
      precio_base: 35,
      precio_texto: "35€/persona · 2h – 3h",
      duracion: "2h – 3h",
      tipo_reserva: "con_fecha",
      orden: 3,
      activa: true,
    },
    {
      id: "immersio-terapeutica",
      titulo: "Immersió Terapèutica",
      descripcion: "7h de proceso personal y relacional que combinan terapia, constelaciones familiares y dinámicas en la naturaleza.",
      imagen_url: "/images/hero7.jpg",
      categoria: "Proceso Personal",
      precio_base: 369,
      precio_extra: 20,
      precio_texto: "369€ · 20€ extra por persona a partir de 5",
      duracion: "7h",
      tipo_reserva: "simple",
      orden: 4,
      activa: true,
    },
    {
      id: "retiro-sanar-relacio",
      titulo: "Retiro: Sanar la Relació entre Homes i Dones",
      descripcion: "Un proceso de sanación colectiva que trabaja los vínculos, heridas y patrones en la relación entre hombres y mujeres. Un espacio de encuentro, verdad y transformación.",
      imagen_url: "/images/hero9.jpg",
      categoria: "Retiro Terapéutico",
      precio_base: 369,
      precio_texto: "369€/persona",
      tipo_reserva: "simple",
      orden: 5,
      activa: true,
    },
    {
      id: "sala-cabanya",
      titulo: "Sala Cabanya — Alquiler por día",
      descripcion: "350 m² de sala con suelo de microcemento. Para actividades profesionales, comidas familiares, eventos... Unas 100 personas.",
      imagen_url: "/images/hero8.jpg",
      categoria: "Alquiler Sala",
      precio_base: 10,
      precio_texto: "10€/persona/día",
      tipo_reserva: "cabanya",
      orden: 6,
      activa: true,
    },
  ];

  for (const act of actividades) {
    await prisma.actividad.upsert({
      where: { id: act.id },
      update: {
        titulo: act.titulo,
        descripcion: act.descripcion,
        imagen_url: act.imagen_url,
        categoria: act.categoria,
        precio_base: act.precio_base,
        precio_extra: act.precio_extra ?? null,
        precio_texto: act.precio_texto,
        duracion: act.duracion ?? null,
        tipo_reserva: act.tipo_reserva,
        orden: act.orden,
        activa: act.activa,
      },
      create: {
        id: act.id,
        titulo: act.titulo,
        descripcion: act.descripcion,
        imagen_url: act.imagen_url ?? null,
        categoria: act.categoria ?? null,
        precio_base: act.precio_base,
        precio_extra: act.precio_extra ?? null,
        precio_texto: act.precio_texto ?? null,
        duracion: act.duracion ?? null,
        tipo_reserva: act.tipo_reserva,
        orden: act.orden,
        activa: act.activa,
      },
    });
  }

  console.log("✅ Seed completado — habitaciones, complementos y actividades listos");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
