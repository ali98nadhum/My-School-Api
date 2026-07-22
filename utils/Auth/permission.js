const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/prismaClient"); 

exports.checkPermission = (requiredPermissionCode) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ 
        message: "غير مخول. يرجى تسجيل الدخول أولاً." 
      });
    }

    const userRole = req.user.role;

    if (userRole === 'SUPER_ADMIN' || userRole === 'PRINCIPAL') {
      return next();
    }

    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        role: userRole,
        permission: {
          code: requiredPermissionCode, 
        },
      },
    });

    if (!hasPermission) {
      return res.status(403).json({
        message: `عذراً، لا تمتلك الصلاحية المطلوبة (${requiredPermissionCode}) للقيام بهذا الإجراء.`,
      });
    }

    next();
  });
};