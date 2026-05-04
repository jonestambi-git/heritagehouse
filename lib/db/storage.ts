/**
 * Storage adapter that automatically switches between JSON and MongoDB
 * - Uses JSON storage in development (localhost)
 * - Uses MongoDB storage in production (Vercel)
 */

import type { Sermon } from '@/lib/types/sermon';

// Dynamically import the appropriate storage based on environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Use MongoDB in production, JSON in development
const storage = isProduction
  ? require('./mongodb-storage')
  : require('./json-storage');

export const readSermons = storage.readSermons;
export const getSermonBySlug = storage.getSermonBySlug;
export const createSermon = storage.createSermon;
export const updateSermon = storage.updateSermon;
export const deleteSermon = storage.deleteSermon;
export const countSermons = storage.countSermons;
export const writeSermons = storage.writeSermons;
