/**
 * Automated DataStax Astra DB Content Synchronization & Embedding Pipeline
 * Listens to newly scanned media evidence, generates vector embeddings,
 * and automatically upserts records into Astra DB vector collection.
 */

import { EvidenceSample } from '@/data/samples';
import { insertEvidenceRecord, queryAstraVectorSimilarity, VectorSearchResult } from './astra';

export interface AstraAutoSyncConfig {
  enabled: boolean;
  autoMatchSimilar: boolean;
  syncIntervalSec: number;
  lastSyncTimestamp?: string;
  totalSyncedRecords: number;
}

const ASTRA_AUTO_SYNC_STORAGE_KEY = 'neuroshield_astra_auto_sync_v1';
const ASTRA_QUEUE_STORAGE_KEY = 'neuroshield_astra_sync_queue_v1';

export const DEFAULT_AUTO_SYNC_CONFIG: AstraAutoSyncConfig = {
  enabled: true,
  autoMatchSimilar: true,
  syncIntervalSec: 30,
  totalSyncedRecords: 12,
};

export function getAstraAutoSyncConfig(): AstraAutoSyncConfig {
  if (typeof window === 'undefined') return DEFAULT_AUTO_SYNC_CONFIG;
  const stored = localStorage.getItem(ASTRA_AUTO_SYNC_STORAGE_KEY);
  if (!stored) return DEFAULT_AUTO_SYNC_CONFIG;
  try {
    return { ...DEFAULT_AUTO_SYNC_CONFIG, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_AUTO_SYNC_CONFIG;
  }
}

export function saveAstraAutoSyncConfig(config: Partial<AstraAutoSyncConfig>): AstraAutoSyncConfig {
  const current = getAstraAutoSyncConfig();
  const updated = { ...current, ...config };
  if (typeof window !== 'undefined') {
    localStorage.setItem(ASTRA_AUTO_SYNC_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

/**
 * Adds an evidence sample to the Astra DB sync queue.
 */
export function enqueueEvidenceForAstraSync(sample: EvidenceSample): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(ASTRA_QUEUE_STORAGE_KEY);
  const queue: EvidenceSample[] = existing ? JSON.parse(existing) : [];
  
  // Prevent duplicates by sample ID
  if (!queue.some((s) => s.id === sample.id)) {
    queue.push(sample);
    localStorage.setItem(ASTRA_QUEUE_STORAGE_KEY, JSON.stringify(queue));
  }
}

/**
 * Automates content processing: flushes the queue, upserts records to Astra DB,
 * and retrieves similar vector matches automatically.
 */
export async function processAstraAutoSyncQueue(): Promise<{
  syncedCount: number;
  similarMatches: VectorSearchResult[];
  error?: string;
}> {
  const config = getAstraAutoSyncConfig();
  if (!config.enabled) {
    return { syncedCount: 0, similarMatches: [] };
  }

  if (typeof window === 'undefined') {
    return { syncedCount: 0, similarMatches: [] };
  }

  const existing = localStorage.getItem(ASTRA_QUEUE_STORAGE_KEY);
  const queue: EvidenceSample[] = existing ? JSON.parse(existing) : [];

  if (queue.length === 0) {
    return { syncedCount: 0, similarMatches: [] };
  }

  let syncedCount = 0;
  const recentSample = queue[queue.length - 1];

  for (const sample of queue) {
    const res = await insertEvidenceRecord(sample);
    if (res.success || res.source === 'fallback') {
      syncedCount++;
    }
  }

  // Clear processed items from queue
  localStorage.setItem(ASTRA_QUEUE_STORAGE_KEY, JSON.stringify([]));

  // Update telemetry timestamps
  saveAstraAutoSyncConfig({
    lastSyncTimestamp: new Date().toISOString(),
    totalSyncedRecords: config.totalSyncedRecords + syncedCount,
  });

  // Automatically query vector similarity for the most recent sample if enabled
  let similarMatches: VectorSearchResult[] = [];
  if (config.autoMatchSimilar && recentSample) {
    const simRes = await queryAstraVectorSimilarity(recentSample.title, 3);
    if (simRes.success) {
      similarMatches = simRes.results;
    }
  }

  return { syncedCount, similarMatches };
}
