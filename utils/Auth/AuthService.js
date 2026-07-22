const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../config/prismaClient");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "لم تقم بتسجيل الدخول. يرجى تسجيل الدخول للوصول.",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      role: true,
      isActive: true,
      lockedUntil: true,
    },
  });

  if (!currentUser) {
    return res.status(401).json({
      message: "هذا المستخدم لم يعد موجوداً في النظام.",
    });
  }

  if (!currentUser.isActive) {
    return res.status(403).json({
      message: "تم إيقاف حسابك من قبل الإدارة.",
    });
  }

  if (
    currentUser.lockedUntil &&
    new Date(currentUser.lockedUntil) > new Date()
  ) {
    return res.status(403).json({
      message: `حسابك مقفول مؤقتاً حتى ${new Date(currentUser.lockedUntil).toLocaleString("ar-EG")}.`,
    });
  }

  req.user = currentUser;
  next();
});