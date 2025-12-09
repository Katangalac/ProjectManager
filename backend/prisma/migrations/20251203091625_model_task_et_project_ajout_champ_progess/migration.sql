-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;
