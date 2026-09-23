import type { CacheService } from "./types";

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

export class MemoryCacheService implements CacheService {
  private readonly entries = new Map<string, CacheEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.entries.get(key);
    if (!entry) return null;

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + Math.max(ttlSeconds, 1) * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }
}

export const cache = new MemoryCacheService();
