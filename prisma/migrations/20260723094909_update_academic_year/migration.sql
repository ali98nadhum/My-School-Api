/*
  Warnings:

  - A unique constraint covering the columns `[school_id,name]` on the table `academic_years` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "academic_years_name_key";

-- AlterTable
ALTER TABLE "academic_years" ADD COLUMN     "school_id" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "unique_academic_year_per_school" ON "academic_years"("school_id", "name");

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "academic_years_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
