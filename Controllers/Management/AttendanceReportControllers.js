const { prisma } = require("../../config/prismaClient");
const { ApiError } = require("../../utils/ApiError");

exports.getDailyAttendance = async (req, res, next) => {
    try {
        const { date, userType } = req.query;

        // Default to today if no date provided
        const reportDate = date ? new Date(date) : new Date();
        reportDate.setUTCHours(0, 0, 0, 0);

        // Build query
        const query = { date: reportDate };
        if (userType) {
            query.userType = userType;
        }

        const attendances = await prisma.dailyAttendance.findMany({
            where: query,
            orderBy: { checkInTime: 'asc' }
        });

        // To make the report useful, we could join manually or map references, 
        // but for now returning the raw DB results gives the needed layout.
        // Usually, we would enrich this with names based on userType.
        
        res.status(200).json({
            status: "success",
            results: attendances.length,
            data: attendances
        });
    } catch (error) {
        next(error);
    }
};
