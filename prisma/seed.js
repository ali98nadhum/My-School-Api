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

  // 3. إضافة الصلاحيات الأساسية للمدارس
  const permissions = [
    { code: 'CREATE_SCHOOL', description: 'إنشاء مدرسة جديدة' },
    { code: 'VIEW_SCHOOLS', description: 'عرض قائمة المدارس' },
    { code: 'VIEW_SCHOOL_DETAILS', description: 'عرض تفاصيل مدرسة محددة' },
    { code: 'UPDATE_SCHOOL', description: 'تحديث بيانات مدرسة' },
    { code: 'DELETE_SCHOOL', description: 'حذف مدرسة' },

    { code: 'CREATE_USER', description: 'إنشاء مستخدم جديد' },
    { code: 'VIEW_USERS', description: 'عرض قائمة المستخدمين' },
    { code: 'VIEW_USER_DETAILS', description: 'عرض تفاصيل مستخدم محدد' },
    { code: 'UPDATE_USER', description: 'تحديث بيانات مستخدم' },
    { code: 'DELETE_USER', description: 'حذف مستخدم' },
  ];

  console.log('جاري ضخ الصلاحيات (Permissions) إلى قاعدة البيانات...');
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: { description: perm.description }, // تحديث الوصف إذا تم تغييره لاحقاً
      create: {
        code: perm.code,
        description: perm.description,
      },
    });
  }
  console.log('تم إدخال الصلاحيات بنجاح!');
}

main()
  .catch((e) => {
    console.error('حدث خطأ أثناء تشغيل السيدر:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });