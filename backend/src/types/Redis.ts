import { RedisOptions, Redis } from "ioredis";

/**
 * Options de connection à Redis
 */
export const redisConnection: RedisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
};

/**
 * Client Redis
 */
export const redis = new Redis(
    redisConnection
);
