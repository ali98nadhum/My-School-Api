/*
  Warnings:

  - You are about to drop the column `academic_year_id` on the `student_enrollments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,class_id]` on the table `student_enrollments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class_id` to the `student_enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_of_week` to the `timetable_entries` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "day_of_week_enum" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- DropForeignKey
ALTER TABLE "student_enrollments" DROP CONSTRAINT "student_enrollments_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "student_enrollments" DROP CONSTRAINT "student_enrollments_section_id_fkey";

-- DropIndex
DROP INDEX "student_enrollments_student_id_academic_year_id_key";

-- AlterTable
ALTER TABLE "student_enrollments" DROP COLUMN "academic_year_id",
ADD COLUMN     "class_id" INTEGER NOT NULL,
ALTER COLUMN "section_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "timetable_entries" DROP COLUMN "day_of_week",
ADD COLUMN     "day_of_week" "day_of_week_enum" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_student_id_class_id_key" ON "student_enrollments"("student_id", "class_id");

-- CreateIndex
CREATE INDEX "idx_students_school_id" ON "students"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_entries_section_id_day_of_week_period_id_academic_key" ON "timetable_entries"("section_id", "day_of_week", "period_id", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_entries_teacher_id_day_of_week_period_id_academic_key" ON "timetable_entries"("teacher_id", "day_of_week", "period_id", "academic_year_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "school_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
