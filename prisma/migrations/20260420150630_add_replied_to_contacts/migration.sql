-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "replied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repliedAt" TIMESTAMP(3);
