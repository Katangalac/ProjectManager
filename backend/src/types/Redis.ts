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
 * Url de connexion
 */
export const redisUrl = process.env.REDIS_URL||"redis://127.0.0.1:6379";

/**
 * Client Redis
 */
export const redis = new Redis(redisUrl,
    {maxRetriesPerRequest: null}
);
redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis error", err));
