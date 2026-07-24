/*
  Warnings:

  - You are about to drop the column `attachment_url` on the `lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "attachment_url",
ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "lesson_attachments" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "type" "attachment_type_enum" NOT NULL,
    "url" TEXT NOT NULL,
    "name" VARCHAR(200),
    "status" "attachment_status_enum" NOT NULL DEFAULT 'READY',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lesson_attachments" ADD CONSTRAINT "lesson_attachments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
