-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "prestation" TEXT NOT NULL,
    "disponibilite" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'en_attente',

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);
