import { RedisOptions, Redis } from "ioredis";

/**
 *
 */
export const redisConnection: RedisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

export const redis = new Redis({
  host: redisConnection.host || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null, // recommandé pour Socket.IO
});
