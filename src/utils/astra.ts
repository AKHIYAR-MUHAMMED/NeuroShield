/**
 * DataStax Astra DB Vector Database Client & Manager for NeuroShield
 */

export interface AstraDbConfig {
  apiEndpoint: string;
  applicationToken: string;
  keyspace: string;
  collectionName: string;
  vectorDimension: number;
}

const ASTRA_CONFIG_STORAGE_KEY = 'neuroshield_astra_config_v1';

export const DEFAULT_ASTRA_CONFIG: AstraDbConfig = {
  apiEndpoint: 'https://7d8a9f0e-astra.apps.astra.datastax.com',
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
