-- CreateTable
CREATE TABLE "daily_attendances" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "user_type" "user_role_enum" NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "check_in_time" TIMESTAMPTZ(6),
    "check_out_time" TIMESTAMPTZ(6),
    "status" "attendance_status_enum" DEFAULT 'present',

    CONSTRAINT "daily_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_attendances_date_user_type_reference_id_key" ON "daily_attendances"("date", "user_type", "reference_id");
