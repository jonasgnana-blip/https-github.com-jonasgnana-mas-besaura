-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA', 'EXPIRADA');

-- CreateEnum
CREATE TYPE "TipoCobro" AS ENUM ('PAGO_UNICO', 'POR_NOCHE');

-- CreateTable
CREATE TABLE "habitaciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio_noche" DECIMAL(10,2) NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "imagenes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habitaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complementos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "tipo_cobro" "TipoCobro" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complementos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "habitacion_id" TEXT NOT NULL,
    "fecha_entrada" DATE NOT NULL,
    "fecha_salida" DATE NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "precio_total" DECIMAL(10,2) NOT NULL,
    "nombre_cliente" TEXT NOT NULL,
    "email_cliente" TEXT NOT NULL,
    "telefono_cliente" TEXT NOT NULL,
    "stripe_session_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expira_en" TIMESTAMP(3),

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva_complementos" (
    "id" TEXT NOT NULL,
    "reserva_id" TEXT NOT NULL,
    "complemento_id" TEXT NOT NULL,
    "precio_aplicado" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "reserva_complementos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservas_stripe_session_id_key" ON "reservas"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "reserva_complementos_reserva_id_complemento_id_key" ON "reserva_complementos"("reserva_id", "complemento_id");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_habitacion_id_fkey" FOREIGN KEY ("habitacion_id") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_complementos" ADD CONSTRAINT "reserva_complementos_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_complementos" ADD CONSTRAINT "reserva_complementos_complemento_id_fkey" FOREIGN KEY ("complemento_id") REFERENCES "complementos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
