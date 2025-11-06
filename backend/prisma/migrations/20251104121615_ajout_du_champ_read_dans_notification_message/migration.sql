-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;
