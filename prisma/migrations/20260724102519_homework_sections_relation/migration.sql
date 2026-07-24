/*
  Warnings:

  - You are about to drop the column `section_id` on the `homeworks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "homeworks" DROP CONSTRAINT "homeworks_section_id_fkey";

-- AlterTable
ALTER TABLE "homeworks" DROP COLUMN "section_id";

-- CreateTable
CREATE TABLE "homework_sections" (
    "homework_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "homework_sections_pkey" PRIMARY KEY ("homework_id","section_id")
);

-- AddForeignKey
ALTER TABLE "homework_sections" ADD CONSTRAINT "homework_sections_homework_id_fkey" FOREIGN KEY ("homework_id") REFERENCES "homeworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_sections" ADD CONSTRAINT "homework_sections_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
