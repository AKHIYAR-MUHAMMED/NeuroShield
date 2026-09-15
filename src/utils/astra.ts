/**
 * DataStax Astra DB Vector Database Client & Manager for NeuroShield
 * Handles config, vector search, record insert, record fetch, and health ping.
 */

import type { EvidenceSample } from '@/data/samples';

export interface AstraDbConfig {
  apiEndpoint: string;
  applicationToken: string;
  keyspace: string;
  collectionName: string;
  vectorDimension: number;
}

const ASTRA_CONFIG_STORAGE_KEY = 'neuroshield_astra_config_v1';

export const DEFAULT_ASTRA_CONFIG: AstraDbConfig = {
  apiEndpoint: '',
  applicationToken: '',
  keyspace: 'neuroshield_forensics',
  collectionName: 'deepfake_embeddings',
  vectorDimension: 1536,
};

export function getAstraConfig(): AstraDbConfig {
  if (typeof window === 'undefined') return DEFAULT_ASTRA_CONFIG;
  const stored = localStorage.getItem(ASTRA_CONFIG_STORAGE_KEY);
  if (!stored) return DEFAULT_ASTRA_CONFIG;
  try {
    return { ...DEFAULT_ASTRA_CONFIG, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_ASTRA_CONFIG;
  }
}

export function saveAstraConfig(config: Partial<AstraDbConfig>): AstraDbConfig {
  const current = getAstraConfig();
  const updated = { ...current, ...config };
  if (typeof window !== 'undefined') {
    localStorage.setItem(ASTRA_CONFIG_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

// ─── Vector Similarity Search ────────────────────────────────────────────────

export interface VectorSearchResult {
  id: string;
  sampleTitle: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  similarityScore: number;
  threatLevel: 'AUTHENTIC' | 'SUSPECTED_DEEPFAKE' | 'CONFIRMED_SYNTHETIC';
  metadata: {
    modelUsed: string;
    datasetOrigin: string;
    timestampUtc: string;
  };
}

export async function queryAstraVectorSimilarity(
  queryVector: number[] | string,
  topK: number = 5
): Promise<{ success: boolean; results: VectorSearchResult[]; error?: string }> {
  try {
    const config = getAstraConfig();
    const response = await fetch('/api/astra/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: config.apiEndpoint,
        token: config.applicationToken,
        collection: config.collectionName,
        query: queryVector,
        topK,
      }),
    });
    const data = await response.json();
    return data;
  } catch (err: any) {
    return { success: false, results: [], error: err.message || 'Failed to query Astra DB' };
  }
}

// ─── Evidence Record Insert ───────────────────────────────────────────────────

export async function insertEvidenceRecord(
  sample: EvidenceSample
): Promise<{ success: boolean; source: 'astra' | 'fallback'; insertedId?: string; error?: string }> {
  try {
    const res = await fetch('/api/astra/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ record: sample }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, source: 'fallback', error: err.message };
  }
}

// ─── Evidence Records Fetch ───────────────────────────────────────────────────

export interface FetchRecordsOptions {
  type?: 'image' | 'video' | 'audio' | 'document';
  limit?: number;
}

export async function fetchEvidenceRecords(
  opts: FetchRecordsOptions = {}
): Promise<{ success: boolean; source: 'astra' | 'fallback'; records: EvidenceSample[] }> {
  try {
    const params = new URLSearchParams();
    if (opts.type) params.set('type', opts.type);
    if (opts.limit) params.set('limit', String(opts.limit));

    const res = await fetch(`/api/astra/records?${params.toString()}`);
    const data = await res.json();
    return data;
  } catch {
    return { success: false, source: 'fallback', records: [] };
  }
}

// ─── Health Ping ─────────────────────────────────────────────────────────────

export interface AstraHealthStatus {
  connected: boolean;
  fallback: boolean;
  latencyMs: number;
  collectionCount: number;
  message: string;
}

export async function pingAstraHealth(): Promise<AstraHealthStatus> {
  try {
    const res = await fetch('/api/astra/health');
    return await res.json();
  } catch {
    return {
      connected: false,
      fallback: true,
      latencyMs: 0,
      collectionCount: 0,
      message: 'Health check failed',
    };
  }
}
