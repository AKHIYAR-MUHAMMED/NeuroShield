import { NextResponse } from 'next/server';
import { SAMPLE_DATASETS } from '@/data/samples';

// In-memory cache for demo/fallback mode (shared between insert and records routes)
export const inMemoryCache: any[] = [...SAMPLE_DATASETS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get('type');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 50;

  const apiEndpoint = process.env.ASTRA_DB_API_ENDPOINT || '';
  const applicationToken = process.env.ASTRA_DB_APPLICATION_TOKEN || '';
  const collectionName = process.env.ASTRA_DB_COLLECTION || 'deepfake_embeddings';

  // Attempt real Astra DB query
  if (apiEndpoint && applicationToken) {
    try {
      const filter = typeFilter ? { type: typeFilter } : {};
      const res = await fetch(`${apiEndpoint}/api/json/v1/${collectionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': applicationToken,
        },
        body: JSON.stringify({
          find: {
            filter,
            options: { limit },
            sort: { _id: -1 },
          },
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const data = await res.json();
        const documents = data?.data?.documents ?? [];
        return NextResponse.json({ success: true, source: 'astra', records: documents });
      }
    } catch {
      // Fall through to cache
    }
  }

  // Fallback: return in-memory cache + SAMPLE_DATASETS
  let records = [...inMemoryCache];
  if (typeFilter) {
    records = records.filter((r) => r.type === typeFilter);
  }
  records = records.slice(0, limit);

  return NextResponse.json({ success: true, source: 'fallback', records });
}
