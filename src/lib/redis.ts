/**
 * Upstash Redis Client Configuration
 * 
 * This module provides a configured Redis client for caching.
 * Supports optional Redis configuration - if not configured, caching will be disabled.
 */

import { Redis } from "@upstash/redis";

/**
 * Check if Redis is configured
 */
export function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Get Redis client instance
 * Returns null if Redis is not configured
 */
export function getRedisClient(): Redis | null {
  if (!isRedisConfigured()) {
    console.warn("Redis is not configured. Caching will be disabled.");
    return null;
  }

  try {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } catch (error) {
    console.error("Failed to initialize Redis client:", error);
    return null;
  }
}

/**
 * Singleton Redis client instance
 */
let redisClient: Redis | null | undefined;

/**
 * Get or create Redis client singleton
 */
export function redis(): Redis | null {
  if (redisClient === undefined) {
    redisClient = getRedisClient();
  }
  return redisClient;
}
