import { LRUCache } from 'lru-cache';
import { VideoCacheValue } from '@/types';

// Configure thumbnail cache
export const thumbnailCache = new LRUCache<string, string>({
  max: 100,
  maxSize: 5000000, // 5MB
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  updateAgeOnGet: true,
  ttlAutopurge: true
});

// Configure video cache
export const videoCache = new LRUCache<string, VideoCacheValue>({
  max: 500,
  maxSize: 50000000, // 50MB
  ttl: 1000 * 60 * 60,
  updateAgeOnGet: true,
  ttlAutopurge: true,
  sizeCalculation: (value: VideoCacheValue) => value.size
});

export default { thumbnailCache, videoCache };
