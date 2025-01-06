import { LRUCache } from 'lru-cache';
import { VideoCacheValue } from '@/types';

// Configure thumbnail cache
export const thumbnailCache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 60 * 24,
  updateAgeOnGet: true,
  ttlAutopurge: true,
  maxEntrySize: 5000000, // 5MB per entry
  sizeCalculation: () => 1 // Each entry counts as 1 unit
});

// Configure video cache
export const videoCache = new LRUCache<string, VideoCacheValue>({
  max: 500,
  ttl: 1000 * 60 * 60,
  updateAgeOnGet: true,
  ttlAutopurge: true,
  maxEntrySize: 50000000, // 50MB per entry
  sizeCalculation: () => 1 // Each entry counts as 1 unit
});

export default { thumbnailCache, videoCache };
