const { Worker } = require("bullmq");
const { redisConnection } = require("../../config/redisClient");
const { processVideo } = require("../videoCompressor");
const { prisma } = require("../../config/prismaClient");

const videoWorker = new Worker(
    "video-processing",
    async (job) => {
        const { inputPath, attachmentId } = job.data;
        console.log(`[VideoWorker] Started processing attachment ${attachmentId}`);

        try {
            const compressedPath = await processVideo(inputPath);
            await prisma.lessonAttachment.update({
                where: { id: attachmentId },
                data: { status: "READY", url: compressedPath },
            });
            console.log(`[VideoWorker] Successfully processed attachment ${attachmentId}`);
            return compressedPath;
        } catch (error) {
            console.error(`[VideoWorker] Error processing attachment ${attachmentId}:`, error.message);
            // Re-throw so BullMQ knows the job failed and can retry it
            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 2, // Process up to 2 videos concurrently
    }
);

videoWorker.on("failed", async (job, err) => {
    console.error(`[VideoWorker] Job ${job.id} failed with error: ${err.message}`);
    // If it's the last attempt, update status to FAILED
    if (job.attemptsMade === job.opts.attempts) {
        try {
            await prisma.lessonAttachment.update({
                where: { id: job.data.attachmentId },
                data: { status: "FAILED" },
            });
            console.log(`[VideoWorker] Marked attachment ${job.data.attachmentId} as FAILED in database`);
        } catch (dbError) {
            console.error(`[VideoWorker] Could not update attachment ${job.data.attachmentId} to FAILED`, dbError);
        }
    }
});

module.exports = {
    videoWorker,
};
