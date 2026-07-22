const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { prisma } = require("../../config/prismaClient");
const { hashPassword } = require("../../utils/hashPassword");
const { generateToken, generateRefreshToken, REFRESH_TOKEN_EXPIRES_DAYS } = require("../../utils/Auth/generateToken");
const { ApiError } = require("../../utils/ApiError");

const saveRefreshToken = async (userId, token, req) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  const userAgent = req.headers['user-agent'] || null;
  const ipAddress = req.ip || req.connection.remoteAddress || null;

  return prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: token,      
      expiresAt,           
      userAgent,            
      ipAddress,           
    }
  });
};

/// ============================================================
// POST /api/auth/login
// ============================================================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) { 
    throw new ApiError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401);
  }

  if (!user.isActive) {
    throw new ApiError("حسابك موقوف — تواصل مع الإدارة", 403);
  }

  const refreshToken = generateRefreshToken();
  
  const savedRefreshToken = await saveRefreshToken(user.id, refreshToken, req);
  const token = generateToken(user.id, user.role, user.schoolId, savedRefreshToken.id);

  res.status(200).json({
    status: "success",
    message: "تم تسجيل الدخول بنجاح",
    data: {
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        schoolId: user.schoolId 
      },
      token,
      refreshToken,
    },
  });
});

/// ============================================================
// POST /api/auth/refresh-token
// ============================================================
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new ApiError("يرجى إرسال رمز التجديد", 400);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash: token },
    include: { user: true },
  });

  if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
    throw new ApiError("جلسة الدخول منتهية أو غير صالحة. يرجى تسجيل الدخول مجدداً", 401);
  }

  if (!storedToken.user.isActive) {
    throw new ApiError("حسابك موقوف — تواصل مع الإدارة", 403);
  }

  const newAccessToken = generateToken(
    storedToken.user.id,
    storedToken.user.role,
    storedToken.user.schoolId,
    storedToken.id
  );

  res.status(200).json({
    status: "success",
    message: "تم تجديد الجلسة بنجاح",
    data: { token: newAccessToken },
  });
});

/// ============================================================
// POST /api/auth/logout
// ============================================================
const logout = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new ApiError("يرجى إرسال رمز التجديد", 400);
  }

  const result = await prisma.refreshToken.updateMany({
    where: { tokenHash: token, isRevoked: false },
    data: { isRevoked: true, revokedAt: new Date() },
  });

  if (result.count === 0) {
    throw new ApiError("الجلسة غير موجودة أو تم تسجيل الخروج منها مسبقاً", 404);
  }

  res.status(200).json({
    status: "success",
    message: "تم تسجيل الخروج بنجاح",
  });
});

/// ============================================================
// POST /api/auth/change-password
// ============================================================
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!(await bcrypt.compare(oldPassword, user.passwordHash))) {
    throw new ApiError(
      "كلمة المرور القديمة غير صحيحة. إذا نسيتها، يرجى مراجعـة الإدارة لحل المشكلة",
      401
    );
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash },
  });

  res.status(200).json({
    status: "success",
    message: "تم تحديث كلمة المرور بنجاح",
  });
});

module.exports = {
  login,
  refreshToken,
  logout,
  changePassword,
};