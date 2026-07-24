/*
  Warnings:

  - You are about to drop the column `photo_url` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `teachers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "attachment_type_enum" AS ENUM ('IMAGE', 'VIDEO', 'PDF', 'YOUTUBE_LINK');

-- CreateEnum
CREATE TYPE "attachment_status_enum" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "staff_members" ADD COLUMN     "avatar_url" TEXT;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "photo_url",
ADD COLUMN     "avatar_url" TEXT;

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "photo_url",
ADD COLUMN     "avatar_url" TEXT;
