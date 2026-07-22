/*
  Warnings:

  - A unique constraint covering the columns `[school_id,name]` on the table `academic_years` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[school_id,grade_level_id,academic_year_id]` on the table `school_classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[school_id,code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `school_id` to the `academic_years` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `biometric_devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `parents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `school_classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `staff_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "academic_years_name_key";

-- DropIndex
DROP INDEX "idx_parents_phone";

-- DropIndex
DROP INDEX "idx_refresh_tokens_expires_at";

-- DropIndex
DROP INDEX "school_classes_grade_level_id_academic_year_id_key";

-- DropIndex
DROP INDEX "idx_student_guardians_parent_id";

-- DropIndex
DROP INDEX "idx_students_national_id";

-- DropIndex
DROP INDEX "subjects_code_key";

-- DropIndex
DROP INDEX "idx_user_biometric_facial_id";

-- DropIndex
DROP INDEX "idx_user_biometric_hardware_id";

-- AlterTable
ALTER TABLE "academic_years" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "biometric_devices" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "school_classes" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "staff_members" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "school_id" INTEGER;

-- CreateTable
CREATE TABLE "schools" (
    "id" SERIAL NOT NULL,
    "name_ar" VARCHAR(150) NOT NULL,
    "name_en" VARCHAR(150) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "logo_url" TEXT,
    "address" TEXT,
    "phone" VARCHAR(20),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schools_code_key" ON "schools"("code");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_school_id_name_key" ON "academic_years"("school_id", "name");

-- CreateIndex
CREATE INDEX "biometric_devices_school_id_idx" ON "biometric_devices"("school_id");

-- CreateIndex
CREATE INDEX "parents_school_id_idx" ON "parents"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_classes_school_id_grade_level_id_academic_year_id_key" ON "school_classes"("school_id", "grade_level_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "staff_members_school_id_idx" ON "staff_members"("school_id");

-- CreateIndex
CREATE INDEX "students_school_id_idx" ON "students"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_school_id_code_key" ON "subjects"("school_id", "code");

-- CreateIndex
CREATE INDEX "teachers_school_id_idx" ON "teachers"("school_id");

-- CreateIndex
CREATE INDEX "users_school_id_idx" ON "users"("school_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biometric_devices" ADD CONSTRAINT "biometric_devices_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_members" ADD CONSTRAINT "staff_members_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "academic_years_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_classes" ADD CONSTRAINT "school_classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
