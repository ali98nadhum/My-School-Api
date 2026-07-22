/*
  Warnings:

  - You are about to drop the column `school_id` on the `academic_years` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `biometric_devices` table. All the data in the column will be lost.
  - You are about to drop the column `pdf_url` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `school_classes` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `logo_url` on the `schools` table. All the data in the column will be lost.
  - You are about to alter the column `name_ar` on the `schools` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(100)`.
  - You are about to alter the column `name_en` on the `schools` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(100)`.
  - You are about to drop the column `school_id` on the `staff_members` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `teachers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `academic_years` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[grade_level_id,academic_year_id]` on the table `school_classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "expense_status_enum" AS ENUM ('pending', 'paid', 'cancelled');

-- DropForeignKey
ALTER TABLE "academic_years" DROP CONSTRAINT "academic_years_school_id_fkey";

-- DropForeignKey
ALTER TABLE "biometric_devices" DROP CONSTRAINT "biometric_devices_school_id_fkey";

-- DropForeignKey
ALTER TABLE "parents" DROP CONSTRAINT "parents_school_id_fkey";

-- DropForeignKey
ALTER TABLE "school_classes" DROP CONSTRAINT "school_classes_school_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_members" DROP CONSTRAINT "staff_members_school_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_school_id_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_school_id_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_school_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_school_id_fkey";

-- DropIndex
DROP INDEX "academic_years_school_id_name_key";

-- DropIndex
DROP INDEX "biometric_devices_school_id_idx";

-- DropIndex
DROP INDEX "parents_school_id_idx";

-- DropIndex
DROP INDEX "school_classes_school_id_grade_level_id_academic_year_id_key";

-- DropIndex
DROP INDEX "schools_code_key";

-- DropIndex
DROP INDEX "staff_members_school_id_idx";

-- DropIndex
DROP INDEX "students_school_id_idx";

-- DropIndex
DROP INDEX "subjects_school_id_code_key";

-- DropIndex
DROP INDEX "teachers_school_id_idx";

-- DropIndex
DROP INDEX "users_school_id_idx";

-- AlterTable
ALTER TABLE "academic_years" DROP COLUMN "school_id";

-- AlterTable
ALTER TABLE "biometric_devices" DROP COLUMN "school_id";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "pdf_url",
DROP COLUMN "video_url";

-- AlterTable
ALTER TABLE "parents" DROP COLUMN "school_id";

-- AlterTable
ALTER TABLE "school_classes" DROP COLUMN "school_id";

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "code",
DROP COLUMN "is_active",
DROP COLUMN "logo_url",
ALTER COLUMN "name_ar" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "name_en" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "staff_members" DROP COLUMN "school_id";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "school_id";

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "school_id";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "school_id";

-- CreateTable
CREATE TABLE "expenses" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "expense_date" DATE NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "status" "expense_status_enum" NOT NULL DEFAULT 'paid',
    "receipt_url" TEXT,
    "recorded_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "targetRole" "user_role_enum",
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "event_date" DATE NOT NULL,
    "location" VARCHAR(100),
    "image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "title" VARCHAR(100) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" SERIAL NOT NULL,
    "gallery_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "caption" VARCHAR(200),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_name_key" ON "academic_years"("name");

-- CreateIndex
CREATE INDEX "idx_parents_phone" ON "parents"("phone_primary");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_expires_at" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "school_classes_grade_level_id_academic_year_id_key" ON "school_classes"("grade_level_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "idx_student_guardians_parent_id" ON "student_guardians"("parent_id");

-- CreateIndex
CREATE INDEX "idx_students_national_id" ON "students"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE INDEX "idx_user_biometric_facial_id" ON "user_biometric_credentials"("facial_biometric_id");

-- CreateIndex
CREATE INDEX "idx_user_biometric_hardware_id" ON "user_biometric_credentials"("hardware_identifier");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
