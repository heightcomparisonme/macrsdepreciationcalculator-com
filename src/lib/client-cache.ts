/**
 * Client-Side Cache (localStorage)
 * 
 * Provides browser localStorage-based caching for client-side data.
 * Used for user-specific data that should persist across sessions.
 */

import { getTimestamp } from "./time";

/**
 * Get data from client cache
 * 
 * @param key - Cache key
 * @returns Cached value or null if not found/expired
 */
export const clientCacheGet = (key: string): string | null => {
  const valueWithExpires = localStorage.getItem(key);
  if (!valueWithExpires) {
    return null;
  }

  const valueArr = valueWithExpires.split(":");
  if (!valueArr || valueArr.length < 2) {
    return null;
  }

  const expiresAt = Number(valueArr[0]);
  const currTimestamp = getTimestamp();

  if (expiresAt !== -1 && expiresAt < currTimestamp) {
    // value expired
    clientCacheRemove(key);
    return null;
  }

  const searchStr = valueArr[0] + ":";
  const value = valueWithExpires.replace(searchStr, "");

  return value;
};

/**
 * Set data to client cache
 * 
 * @param key - Cache key
 * @param value - Value to cache
 * @param expiresAt - Absolute timestamp, -1 means no expire
 */
export const clientCacheSet = (key: string, value: string, expiresAt: number) => {
  const valueWithExpires = expiresAt + ":" + value;
  localStorage.setItem(key, valueWithExpires);
};

/**
 * Remove data from client cache
 * 
 * @param key - Cache key to remove
 */
export const clientCacheRemove = (key: string) => {
  localStorage.removeItem(key);
};

/**
 * Clear all data from client cache
 */
export const clientCacheClear = () => {
  localStorage.clear();
};

// Legacy exports for backward compatibility
export const cacheGet = clientCacheGet;
export const cacheSet = clientCacheSet;
export const cacheRemove = clientCacheRemove;
export const cacheClear = clientCacheClear;
