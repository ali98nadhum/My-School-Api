const { prisma } = require('../config/prismaClient');
const { hashPassword } = require('../utils/hashPassword');

async function main() {
  // 1. كلمة المرور الخاصة بالسوبر أدمن (يمكنك تغييرها لاحقاً)
  const plainPassword = 'SuperAdminPassword123!';
  const hashedPassword = await hashPassword(plainPassword);

  // 2. إنشاء أو تحديث حساب السوبر أدمن الأساسي
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@system.com' }, // الإيميل الافتراضي للدخول
    update: {}, // إذا كان موجوداً مسبقاً، لا تقم بتعديل شيء
    create: {
      email: 'admin@system.com',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
      isEmailVerified: true,
      // ملاحظة: schoolId يبقى فارغاً (null) لأنه مدير عام للنظام وليس مرتبطاً بمدرسة محددة
    },
  });

  console.log('تم إنشاء حساب السوبر أدمن بنجاح:');
  console.log({ email: superAdmin.email, role: superAdmin.role });
}

main()
  .catch((e) => {
    console.error('حدث خطأ أثناء تشغيل السيدر:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });