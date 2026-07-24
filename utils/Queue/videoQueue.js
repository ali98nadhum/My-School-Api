const { Queue } = require("bullmq");
const { redisConnection } = require("../../config/redisClient");

const videoQueue = new Queue("video-processing", {
    connection: redisConnection,
});

const addVideoJob = async (inputPath, attachmentId) => {
    await videoQueue.add(
        "compress-video",
        { inputPath, attachmentId },
        {
            attempts: 3, // Retry up to 3 times on failure
            backoff: {
                type: "exponential",
                delay: 2000, // 2s initial delay
            },
        }
    );
};

module.exports = {
    videoQueue,
    addVideoJob,
};
