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

  const token = generateToken(user.id, user.role, user.schoolId);
  const refreshToken = generateRefreshToken();
  
  await saveRefreshToken(user.id, refreshToken, req);

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

module.exports = {
  login,
};