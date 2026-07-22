-- AlterTable
ALTER TABLE "academic_years" ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "announcements" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "attendance_records" ALTER COLUMN "attendance_date" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "recorded_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "event_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "exam_results" ALTER COLUMN "score" DROP NOT NULL;

-- AlterTable
ALTER TABLE "exam_types" ALTER COLUMN "name_en" DROP NOT NULL,
ALTER COLUMN "name_ar" DROP NOT NULL;

-- AlterTable
ALTER TABLE "exams" ALTER COLUMN "exam_date" DROP NOT NULL,
ALTER COLUMN "max_score" DROP NOT NULL;

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "expense_date" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "fee_structures" ALTER COLUMN "amount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "fee_types" ALTER COLUMN "name_en" DROP NOT NULL,
ALTER COLUMN "name_ar" DROP NOT NULL;

-- AlterTable
ALTER TABLE "galleries" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "gallery_images" ALTER COLUMN "image_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "grade_levels" ALTER COLUMN "name_en" DROP NOT NULL,
ALTER COLUMN "name_ar" DROP NOT NULL;

-- AlterTable
ALTER TABLE "holidays" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "homeworks" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "due_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "invoice_items" ALTER COLUMN "amount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "total_amount" DROP NOT NULL,
ALTER COLUMN "due_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "lessons" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "lesson_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "parents" ALTER COLUMN "first_name_ar" DROP NOT NULL,
ALTER COLUMN "last_name_ar" DROP NOT NULL,
ALTER COLUMN "first_name_en" DROP NOT NULL,
ALTER COLUMN "last_name_en" DROP NOT NULL,
ALTER COLUMN "phone_primary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "payment_method" DROP NOT NULL;

-- AlterTable
ALTER TABLE "periods" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "start_time" DROP NOT NULL,
ALTER COLUMN "end_time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "school_classes" ALTER COLUMN "name_en" DROP NOT NULL,
ALTER COLUMN "name_ar" DROP NOT NULL;

-- AlterTable
ALTER TABLE "schools" ALTER COLUMN "name_ar" DROP NOT NULL,
ALTER COLUMN "name_en" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sections" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "staff_members" ALTER COLUMN "first_name_ar" DROP NOT NULL,
ALTER COLUMN "last_name_ar" DROP NOT NULL,
ALTER COLUMN "first_name_en" DROP NOT NULL,
ALTER COLUMN "last_name_en" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "hire_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "student_guardians" ALTER COLUMN "relationship_type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "first_name_ar" DROP NOT NULL,
ALTER COLUMN "last_name_ar" DROP NOT NULL,
ALTER COLUMN "first_name_en" DROP NOT NULL,
ALTER COLUMN "last_name_en" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "date_of_birth" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subjects" ALTER COLUMN "name_en" DROP NOT NULL,
ALTER COLUMN "name_ar" DROP NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "first_name_ar" DROP NOT NULL,
ALTER COLUMN "last_name_ar" DROP NOT NULL,
ALTER COLUMN "first_name_en" DROP NOT NULL,
ALTER COLUMN "last_name_en" DROP NOT NULL,
ALTER COLUMN "hire_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "timetable_entries" ALTER COLUMN "day_of_week" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_biometric_credentials" ALTER COLUMN "hardware_identifier" DROP NOT NULL,
ALTER COLUMN "facial_feature_hash" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
