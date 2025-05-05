import { API_URL } from "../../helper";

// types/cache.ts
export interface CacheDetail {
  age: string;
  ageHuman: string;
  expiresIn: string;
  expiresInHuman: string;
  hasCustomTTL: boolean;
  isExpired: boolean;
  key: string;
  size: number;
  sizeHuman: string;
}

export interface CacheHealth {
  expirationRate: string;
  memoryEfficiency: string;
  status: string;
}

export interface CacheItemAge {
  average: string;
  averageHuman: string;
  newest: string;
  newestHuman: string;
  oldest: string;
  oldestHuman: string;
}

export interface CacheSummary {
  activeItems: number;
  avgItemSize: number;
  avgItemSizeHuman: string;
  expiredItems: number;
  itemsWithCustomTTL: number;
  totalItems: number;
  totalSize: number;
  totalSizeHuman: string;
}

export interface CacheTiming {
  cleanupInterval: string;
  defaultTTL: string;
  lastCleanupTime: string;
  nextCleanupIn: string;
  nextCleanupInHuman: string;
  uptime: string;
  uptimeHuman: string;
}

export interface RawCacheStats {
  details: CacheDetail[];
  health: CacheHealth;
  itemAge: CacheItemAge;
  summary: CacheSummary;
  timing: CacheTiming;
}

export interface CacheStats {
  expiredItems: number;
  totalItems: number;
  totalSize: number;
  totalSizeHuman: string;
  ttl: string;
  healthStatus: string;
  memoryEfficiency: string;
  expirationRate: string;
  uptime: string;
  uptimeHuman: string;
  nextCleanupIn: string;
  nextCleanupInHuman: string;
  avgItemSize: string;
  activeItems: number;
  itemsWithCustomTTL: number;
  lastCleanupTime: string;
  details: CacheDetail[];
}

function adaptCacheStats(raw: RawCacheStats): CacheStats {
  return {
    expiredItems: raw.summary.expiredItems,
    totalItems: raw.summary.totalItems,
    totalSize: raw.summary.totalSize,
    totalSizeHuman: raw.summary.totalSizeHuman,
    ttl: raw.timing.defaultTTL,
    healthStatus: raw.health.status,
    memoryEfficiency: raw.health.memoryEfficiency,
    expirationRate: raw.health.expirationRate,
    uptime: raw.timing.uptime,
    uptimeHuman: raw.timing.uptimeHuman,
    nextCleanupIn: raw.timing.nextCleanupIn,
    nextCleanupInHuman: raw.timing.nextCleanupInHuman,
    avgItemSize: raw.summary.avgItemSizeHuman,
    activeItems: raw.summary.activeItems,
    itemsWithCustomTTL: raw.summary.itemsWithCustomTTL,
    lastCleanupTime: raw.timing.lastCleanupTime,
    details: raw.details,
  };
}

export const cacheService = {
  async getStats(): Promise<{ success: boolean; stats: CacheStats }> {
    const response = await fetch(`${API_URL}/auth/admin/cache`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Cache istatistikleri alınamadı");
    }

    const data = await response.json();
    return {
      success: data.success,
      stats: adaptCacheStats(data.stats),
    };
  },

  async clearCache(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/auth/admin/cache`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Cache temizlenemedi");
    }

    return response.json();
  },
};
