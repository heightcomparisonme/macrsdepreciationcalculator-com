/**
 * Cache Helper Functions
 * 
 * Provides utilities for caching data with Redis.
 * Falls back to direct API calls if Redis is not configured.
 */

import { redis } from "./redis";

/**
 * Generate cache key for weather data
 * 
 * Format: wetter_data:{date}_{hour}_{lat}_{lon}
 * 
 * @param date - Date object
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Cache key string
 */
export function generateWeatherCacheKey(
  date: Date,
  latitude: number,
  longitude: number
): string {
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const hour = date.getHours();
  const latRounded = latitude.toFixed(2);
  const lonRounded = longitude.toFixed(2);

  return `wetter_data:${dateStr}_${hour}_${latRounded}_${lonRounded}`;
}

/**
 * Generate cache key for moon phase data
 * 
 * Format: moon_data:{date}_{lat}_{lon}
 * 
 * @param date - Date object
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Cache key string
 */
export function generateMoonCacheKey(
  date: Date,
  latitude: number,
  longitude: number
): string {
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const latRounded = latitude.toFixed(2);
  const lonRounded = longitude.toFixed(2);

  return `moon_data:${dateStr}_${latRounded}_${lonRounded}`;
}

/**
 * Get data from cache or fetch from source
 * 
 * @param key - Cache key
 * @param fetchFn - Function to fetch data if not in cache
 * @param ttlSeconds - Time to live in seconds (default: 1800 = 30 minutes)
 * @returns Cached or freshly fetched data
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 1800 // Default: 30 minutes
): Promise<T> {
  const client = redis();

  // If Redis is not configured, fetch directly
  if (!client) {
    console.log(`Redis not configured, fetching directly for key: ${key}`);
    return await fetchFn();
  }

  try {
    // Try to get from cache
    const cached = await client.get<T>(key);

    if (cached !== null) {
      console.log(`Cache HIT for key: ${key}`);
      return cached;
    }

    console.log(`Cache MISS for key: ${key}`);
  } catch (error) {
    console.error(`Cache read error for key ${key}:`, error);
    // Fall through to fetch
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in cache
  try {
    await client.set(key, data, { ex: ttlSeconds });
    console.log(`Cached data for key: ${key} (TTL: ${ttlSeconds}s)`);
  } catch (error) {
    console.error(`Cache write error for key ${key}:`, error);
    // Continue anyway, we have the data
  }

  return data;
}

/**
 * Invalidate cache for a specific key
 * 
 * @param key - Cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
  const client = redis();

  if (!client) {
    return;
  }

  try {
    await client.del(key);
    console.log(`Cache invalidated for key: ${key}`);
  } catch (error) {
    console.error(`Cache invalidation error for key ${key}:`, error);
  }
}

/**
 * Invalidate all cache keys matching a pattern
 * 
 * @param pattern - Pattern to match (e.g., "wetter_data:*")
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const client = redis();

  if (!client) {
    return;
  }

  try {
    // Note: Upstash Redis doesn't support SCAN, so we'll use a simple delete
    // In production, you might want to track keys or use a different approach
    console.log(`Pattern-based cache invalidation not fully supported. Pattern: ${pattern}`);
  } catch (error) {
    console.error(`Cache pattern invalidation error for pattern ${pattern}:`, error);
  }
}
