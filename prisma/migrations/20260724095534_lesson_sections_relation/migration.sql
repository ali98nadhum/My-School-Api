/*
  Warnings:

  - You are about to drop the column `section_id` on the `lessons` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_section_id_fkey";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "section_id";

-- CreateTable
CREATE TABLE "lesson_sections" (
    "lesson_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,

    CONSTRAINT "lesson_sections_pkey" PRIMARY KEY ("lesson_id","section_id")
);

-- AddForeignKey
ALTER TABLE "lesson_sections" ADD CONSTRAINT "lesson_sections_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_sections" ADD CONSTRAINT "lesson_sections_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
