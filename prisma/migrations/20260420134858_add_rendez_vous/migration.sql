-- CreateTable
CREATE TABLE "rendez_vous" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "prestation" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirme',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rendez_vous_pkey" PRIMARY KEY ("id")
);
