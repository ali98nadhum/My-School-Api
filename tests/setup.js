const { prisma } = require("../config/prismaClient");
const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== "test") {
  throw new Error("لا يمكن تشغيل ملف الإعداد إلا في بيئة الاختبار NODE_ENV=test");
}

beforeAll(async () => {
  const tablenames = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    if (tables.length > 0) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
  } catch (error) {
    console.log({ error });
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

global.generateTestToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
