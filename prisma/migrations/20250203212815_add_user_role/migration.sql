-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeActivite" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "TypeActivite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activite" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "placesDisponibles" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "datetimeDebut" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,

    CONSTRAINT "Activite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activiteId" INTEGER NOT NULL,
    "dateReservation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "etat" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Activite" ADD CONSTRAINT "Activite_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TypeActivite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_activiteId_fkey" FOREIGN KEY ("activiteId") REFERENCES "Activite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
