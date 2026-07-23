const asyncHandler = require("express-async-handler");
const { ApiError } = require("../../utils/ApiError");
const { prisma } = require("../../config/prismaClient");

/**
 * @desc    Get logged-in teacher's timetable (weekly or specific day)
 * @route   GET /api/teacher/timetable
 * @access  Private (Teacher)
 */
const getMyTimetable = asyncHandler(async (req, res, next) => {
  const { dayOfWeek } = req.query;

  const teacher = await prisma.teacher.findUnique({
    where: { userId: req.user.id }
  });

  if (!teacher) {
    return next(new ApiError("لم يتم العثور على بيانات المعلم الخاصة بك", 404));
  }

  const where = { teacherId: teacher.id };
  if (dayOfWeek) {
    where.dayOfWeek = dayOfWeek; // SUNDAY, MONDAY...
  }

  const entries = await prisma.timetableEntry.findMany({
    where,
    include: {
      section: {
        select: {
          name: true,
          schoolClass: { select: { nameAr: true } }
        }
      },
      subject: { select: { nameAr: true } },
      period: { select: { name: true, startTime: true, endTime: true } }
    },
    orderBy: [
      { dayOfWeek: "asc" },
      { period: { sortOrder: "asc" } }
    ]
  });

  res.status(200).json({
    status: "success",
    results: entries.length,
    data: entries
  });
});

module.exports = {
  getMyTimetable
};
