const Redis = require("ioredis");

const redisOptions = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    maxRetriesPerRequest: null, // Required by BullMQ
};

const redisConnection = new Redis(redisOptions);

module.exports = {
    redisConnection
};
